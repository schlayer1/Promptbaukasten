import { AiProvider, ApiKeyStore, GenerationRequest, GenerationResponse } from '../types/ai';
import { GeneratorFormState, ParsedGenerationOutput } from '../types/generator';
import { THUERINGEN_SUBJECTS } from '../data/thueringenCurriculum';
import { THUERINGEN_OPERATORS } from '../data/thueringenOperators';
import { TASK_FORMATS, PROVIDER_CONFIGS } from '../data/defaultPresets';
import { callGeminiApi, DEFAULT_SCHOOL_GEMINI_KEY } from './geminiEngine';
import { callOpenAiCompatibleApi } from './openAiCompatEngine';
import { buildSelfContainedGameHtml, generateMoodleGiftExport, QuizQuestion } from './gameTemplate';
import { 
  buildSelfContainedStationHtml, 
  StationFlashcard, 
  StationAfbTask, 
  StationSpecialItem, 
  StationQuizQuestion,
  escapeHtml 
} from './stationTemplate';

export function convertClozeMarkdownToHtml(rawCloze: string): string {
  if (!rawCloze) return '';
  if (rawCloze.includes('cloze-select')) return rawCloze;

  const converted = rawCloze.replace(/\[([^\]]+)\]/g, (match, inner) => {
    if (!inner.includes('/') && !inner.includes('|') && !inner.includes(';')) {
      return match;
    }
    const parts = inner.split(/[\/|;]/).map((p: string) => p.trim()).filter(Boolean);
    if (parts.length < 2) return match;

    let correctVal = '';
    const cleanOptions = parts.map((opt: string) => {
      if (opt.includes('*')) {
        const clean = opt.replace(/\*/g, '').trim();
        correctVal = clean;
        return clean;
      }
      return opt;
    });

    if (!correctVal) {
      correctVal = cleanOptions[0];
    }

    const shuffled = [...cleanOptions].sort(() => 0.5 - Math.random());

    const optsHtml = [
      '<option value="">-- bitte auswählen --</option>',
      ...shuffled.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`)
    ].join('');

    return `<select class="cloze-select" data-correct="${escapeHtml(correctVal)}">${optsHtml}</select>`;
  });

  return converted.split('\n\n').map(p => `<p style="margin-bottom:0.75rem;">${p.replace(/\n/g, '<br>')}</p>`).join('');
}

export function formatKnowledgeMarkdown(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/^### (.*$)/gim, '<h3 style="font-size:1.05rem; font-weight:800; margin-top:1.25rem; margin-bottom:0.4rem; color:#0f172a;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size:1.2rem; font-weight:900; margin-top:1.5rem; margin-bottom:0.6rem; color:#006185;">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li style="margin-left:1.25rem; margin-bottom:0.35rem;">$1</li>')
    .replace(/\n\n/gim, '</p><p style="margin-bottom:0.75rem;">');
}

const STORAGE_KEY = 'promptbaukasten_api_keys_v1';

export function getStoredApiKeys(): ApiKeyStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveApiKey(provider: AiProvider, key: string): void {
  const current = getStoredApiKeys();
  if (key.trim()) {
    current[provider] = key.trim();
  } else {
    delete current[provider];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function saveOpenRouterPreset(preset: string): void {
  const current = getStoredApiKeys();
  if (preset.trim()) {
    current.openrouterPreset = preset.trim();
  } else {
    delete current.openrouterPreset;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function getEffectiveOpenRouterPreset(): string {
  const stored = getStoredApiKeys();
  if (stored.openrouterPreset && stored.openrouterPreset.trim().length > 0) {
    return stored.openrouterPreset.trim();
  }
  const envPreset = (import.meta as any).env?.VITE_OPENROUTER_PRESET;
  if (envPreset && typeof envPreset === 'string' && envPreset.trim().length > 0) {
    return envPreset.trim();
  }
  return '@preset/freie-modelle';
}

export function getEffectiveApiKey(provider: AiProvider): { key: string; isCustom: boolean } | null {
  const stored = getStoredApiKeys();
  const custom = stored[provider];
  if (custom && custom.trim().length > 0) {
    return { key: custom.trim(), isCustom: true };
  }

  // Fallback to Vercel / Vite env variables
  const envName = PROVIDER_CONFIGS[provider]?.envKeyName;
  const envKey = (import.meta as any).env?.[envName];
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return { key: envKey.trim(), isCustom: false };
  }

  // Automatischer Schulschlüssel für Gemini (HBS Standard)
  if (provider === 'gemini' && DEFAULT_SCHOOL_GEMINI_KEY) {
    return { key: DEFAULT_SCHOOL_GEMINI_KEY, isCustom: false };
  }

  return null;
}

export function getAllKeyStatuses(): Record<AiProvider, { hasKey: boolean; isCustom: boolean }> {
  const providers: AiProvider[] = ['gemini', 'groq', 'mistral', 'openrouter'];
  const res: any = {};
  for (const p of providers) {
    const eff = getEffectiveApiKey(p);
    res[p] = {
      hasKey: !!eff,
      isCustom: eff?.isCustom ?? false
    };
  }
  return res;
}

export function buildDidacticPrompt(form: GeneratorFormState): { systemPrompt: string; userPrompt: string } {
  const subject = THUERINGEN_SUBJECTS.find(s => s.id === form.subjectId) || THUERINGEN_SUBJECTS[0];
  const topic = subject.topics.find(t => t.id === form.topicId) || subject.topics[0];
  const format = TASK_FORMATS.find(f => f.id === form.format) || TASK_FORMATS[0];

  const selectedOps = THUERINGEN_OPERATORS.filter(op => form.selectedOperators.includes(op.id));
  const operatorNames = selectedOps.map(o => `${o.name} (AFB ${o.afb})`).join(', ');

  const gameModeDesc = 
    form.gameMode === 'memory' ? 'Fachbegriff-Memory (Paare finden Begriff ↔ Erklärung)' :
    form.gameMode === 'order' ? 'Chronologie & Ablauf (Schritte/Ereignisse in logischer Reihenfolge sortieren)' :
    'Arcade-Quiz (Multiple-Choice mit Streak & Kombo)';

  const gameSocialDesc = 
    form.gameSocialMode === 'duell' ? '2-Spieler-Duell an 1 iPad (Split-Screen / Buzzer-Wettkampf)' :
    form.gameSocialMode === 'escape' ? 'Escape-Game (4-stelliger Tresorcode für Klassenraum-Schatztruhe)' :
    'Einzelspieler-Modus mit Ehrenurkunde';

  const storyThemeDesc =
    form.gameStoryTheme === 'custom' && form.customStoryTheme?.trim() ? `Individuelle Rahmenhandlung der Lehrkraft: "${form.customStoryTheme.trim()}"` :
    form.gameStoryTheme === 'detective' ? 'Detektiv-Fall (Spurensuche, Indizien analysieren, Täter überführen)' :
    form.gameStoryTheme === 'space' ? 'Weltraum-Expedition (Raumschiff-Crew auf Erkundung)' :
    form.gameStoryTheme === 'alchemy' ? 'Labor-Rettung (Gefahrgut neutralisieren & Formel entschlüsseln)' :
    'Neutral / Klassisch-Fachlich';

  const systemPrompt = `Du bist ein hochqualifizierter Fachdidaktiker und Lehrplanexperte für die Thüringer Regelschule (ThILLM).
Deine Aufgabe ist es, exzellente, differenzierte und sofort im Unterricht einsetzbare Unterrichtsmaterialien und interaktive Lernaufgaben zu erstellen.

Schulform: Staatliche Regelschule in Thüringen (Sekundarstufe I)
Pädagogische Leitlinien:
- Strenge Bindung an die Thüringer Operatoren nach ThILLM
- Klare Trennung nach den drei KMK-Anforderungsbereichen:
  * AFB I (Reproduktion & Fachwissen): z.B. Nennen, Beschreiben, Wiedergeben
  * AFB II (Reorganisation & Transfer): z.B. Erläutern, Vergleichen, Analysieren, Begründen
  * AFB III (Reflexion, Werturteil & Gestaltung): z.B. Beurteilen, Stellung nehmen, Gestalten
- Schülergerechte Sprache für Regelschüler, motivierend, alltagsnah und lebensweltbezogen
${form.inclusionMode ? '- FÖRDERMODUS & DaZ AKTIV: Verwende Leichte/Einfache Sprache, kurze Sätze, markante Zwischenüberschriften und erstelle einen integrierten Fach-Wortspeicher mit einfachen Worterklärungen!' : ''}
${form.includeMisconceptions ? `- DIDAKTISCHER FEHLKONZEPT-FOKUS AKTIV: Die falschen Antwortmöglichkeiten (Distraktoren) MÜSSEN gezielt typische Denkfehler und Schüler-Mythen der Klassenstufe ${form.gradeLevel} aufgreifen.${form.customMisconceptions?.trim() ? ` Beachte insbesondere folgende vorgegebene Schülerfalle: "${form.customMisconceptions.trim()}".` : ''} In "explanation" muss kurz erläutert werden, welcher Denkfehler hinter der falschen Option steckt!` : ''}`;

  const userPrompt = `Erstelle eine vollständige, hochqualitative Ausarbeitung für folgendes Unterrichtsszenario:

=== RAHMENDATEN ===
- Format: ${format.title} (${format.subtitle})
- Fach: ${subject.name} (${subject.category})
- Klassenstufe: Klasse ${form.gradeLevel} (Regelschule Thüringen)
- ThILLM-Lehrplanthema: "${topic?.title || 'Freies Thema'}"
- Kernkompetenzen laut Lehrplan:
${topic?.coreCompetencies.map(c => `  * ${c}`).join('\n') || '  * Fachspezifische Kernkompetenzen'}
${form.customTopicDetail ? `- Spezifischer Unterrichtsfokus der Lehrkraft: "${form.customTopicDetail}"` : ''}
${form.additionalInstructions ? `- Besondere Hinweise: "${form.additionalInstructions}"` : ''}

=== OPERATOREN & ANFORDERUNGSBEREICHE ===
- Verbindliche Thüringer Operatoren: ${operatorNames || 'Nennen (AFB I), Erläutern (AFB II), Beurteilen (AFB III)'}
- Ziel-Gewichtung: ${form.afbDistribution.afb1}% AFB I | ${form.afbDistribution.afb2}% AFB II | ${form.afbDistribution.afb3}% AFB III
- Geplante Unterrichtsdauer: ca. ${form.targetDurationMinutes} Minuten

${form.format === 'lernspiel' ? `=== LERNSPIEL-PARAMETER ===
- Gewählte Spielmechanik: ${gameModeDesc}
- Unterrichts-Szenario: ${gameSocialDesc}
- Rahmenthema / Storytelling: ${storyThemeDesc}
` : ''}
${form.format === 'lernstation' ? `=== LERNSTATION-PARAMETER (SINGLE-PAGE INTERAKTIVE WEBSAITE) ===
Gewünschte Struktur & Umfang (strikt einhalten):
- 1. Lernziel-Checkliste: ${form.stationModules?.goals !== false ? 'AKTIV (3-4 klare "Ich kann..."-Ziele)' : 'DEAKTIVIERT'}
- 2. Wissensbereich mit Merkkästen & Fachbegriffen: ${form.stationModules?.knowledge !== false ? 'AKTIV' : 'DEAKTIVIERT'}
- 💡 Wortspeicher & Inklusionshilfen (DaZ / Förderung): ${form.stationInclusionTipps !== false ? 'AKTIV' : 'DEAKTIVIERT'}
- 3. 3D-Lernkarten (Begriffe sichern): ${form.stationModules?.flashcards !== false ? `AKTIV (Erstelle genau ${form.stationCustomization?.flashcardCount || 6} Lernkarten)` : 'DEAKTIVIERT'}
- 4. Interaktiver Lückentext: ${form.stationModules?.cloze !== false ? `AKTIV (Erstelle genau ${form.stationCustomization?.clozeHoleCount || 5} Lücken, ${form.stationCustomization?.clozeWithWordBank ? 'mit Wortspeicher-Hilfe' : 'ohne Wortspeicher'})` : 'DEAKTIVIERT'}
- 5. Differenzierte Aufgaben (AFB I–III): ${form.stationModules?.afbTasks !== false ? `AKTIV (Aufteilung: genau ${form.stationCustomization?.afb1TaskCount ?? 1}x AFB I Basis, genau ${form.stationCustomization?.afb2TaskCount ?? 1}x AFB II Standard, genau ${form.stationCustomization?.afb3TaskCount ?? 1}x AFB III Transfer)` : 'DEAKTIVIERT'}
- 6. Fach-Spezialstation (${form.stationSpecialType === 'timeline' ? 'Zeitstrahl / Epochen' : form.stationSpecialType === 'detective' ? 'Quellen-Detektiv' : form.stationSpecialType === 'experiment' ? 'Experiment & Beobachtung' : 'Passend zum Fach/Thema'}): ${form.stationModules?.specialModule !== false ? 'AKTIV' : 'DEAKTIVIERT'}
- 7. Wissens-Check Quiz: ${form.stationModules?.quiz !== false ? `AKTIV (Erstelle genau ${form.stationCustomization?.quizQuestionCount || 6} Multiple-Choice-Fragen. ACHTUNG: Die richtige Lösung darf NICHT immer Antwort A sein! Verteile correctIndex zufällig auf 0, 1, 2 oder 3)` : 'DEAKTIVIERT'}
- 8. Reflexion & Selbsteinschätzung: ${form.stationModules?.reflection !== false ? `AKTIV (inkl. genau ${form.stationCustomization?.youtubeLinkCount || 3} YouTube-Suchbegriffen)` : 'DEAKTIVIERT'}
` : ''}

=== GESTALTUNG & HINTERGRUND-DESIGN DER HTML-SEITE ===
- Visueller Stil: ${
    form.htmlDesignTheme === 'topic-adaptive' ? 'Themen- & Fach-Adaptiv (visuelle Farb- und Bildmetaphern passend zu Fach & Thema)' :
    form.htmlDesignTheme === 'age-primary' ? 'Altersgerecht für Klasse 5/6 (spielerische Tonalität, leicht verständliche Sprache, ermutigend, klare Struktur)' :
    form.htmlDesignTheme === 'age-middle' ? 'Altersgerecht für Klasse 7/8 (modern, zielorientiert, dynamisch, altersangemessene Alltagsbezüge)' :
    form.htmlDesignTheme === 'age-senior' ? 'Altersgerecht für Klasse 9/10 (sachlich, akademischer Fokus, prüfungsrelevant, differenzierte Fachsprache)' :
    form.htmlDesignTheme === 'dark-arcade' ? 'Dunkles Arcade-Theme (Gaming-Atmosphäre, Missionen & Challenges)' :
    form.htmlDesignTheme === 'warm-parchment' ? 'Historisches Pergament / Bibliothek (historische Quellenarbeit & sprachliche Tiefe)' :
    `Individueller Gestaltungswunsch: "${form.customHtmlDesignPrompt || 'Themenbezogen'}"`
}
${form.customHtmlDesignPrompt ? `- Besonderer gestalterischer Wunsch der Lehrkraft: "${form.customHtmlDesignPrompt}"` : ''}
- Hintergrund-Muster: ${form.htmlBgPattern || 'auto'}
- DIDAKTISCHE VORGABE: Richte die Sprache, Beispiele, Erklärungen und Aufgabenformulierungen gezielt an dieser Altersgruppe und Gestaltung aus!

=== STRUKTUR DER ANTWORT (SEHR WICHTIG) ===
Bitte strukturiere deine Antwort GENAU mit den folgenden Trenn-Tags, damit unsere Software die Inhalte automatisch in die Tabs einsortieren kann:

${form.format === 'lernstation' ? `<!-- SECTION:STATION_GOALS -->
Valides JSON-Array von 3-4 Lernzielen ("Ich kann..." / "Ich weiß..."):
[
  "Ich verstehe die Bedeutung von ...",
  "Ich kenne die wichtigsten Merkmale von ...",
  "Ich kann erklären, warum ..."
]

<!-- SECTION:STATION_KNOWLEDGE -->
Strukturierter Erklärungstext mit Zwischenüberschriften (###) und Merksätzen. 
Formatiere zentrale Fachbegriffe fett.

<!-- SECTION:STATION_FLASHCARDS -->
Valides JSON-Array von genau ${form.stationCustomization?.flashcardCount || 6} Lernkarten (Vorderseite & Rückseite):
[
  { "front": "Fachbegriff", "back": "Schülergerechte Erklärung / Definition" }
]

<!-- SECTION:STATION_CLOZE -->
Ein zusammenhängender Lückentext mit genau ${form.stationCustomization?.clozeHoleCount || 5} Lücken im Format [Richtige Option* / Falsche Option 1 / Falsche Option 2].
Beispiel: Die Menschen lebten in [Sippen* / Einzelhäusern / Großstädten] zusammen.

<!-- SECTION:STATION_AFB -->
Valides JSON-Array von differenzierten Aufgaben (${(form.stationCustomization?.afb1TaskCount ?? 1)}x AFB I, ${(form.stationCustomization?.afb2TaskCount ?? 1)}x AFB II, ${(form.stationCustomization?.afb3TaskCount ?? 1)}x AFB III):
[
  {
    "level": "I",
    "title": "Aufgabe 1 (Niveau Grün - Basis)",
    "taskText": "Basisaufgabe (Wiedergeben, Nennen)...",
    "hintText": "Lösungstipp oder Denkhilfe...",
    "targetAudience": "Basis-Förderung"
  },
  {
    "level": "II",
    "title": "Aufgabe 2 (Niveau Gelb - Standard)",
    "taskText": "Standardaufgabe (Erläutern, Vergleichen)...",
    "hintText": "Lösungstipp oder Denkhilfe...",
    "targetAudience": "Regel-Niveau"
  },
  {
    "level": "III",
    "title": "Aufgabe 3 (Niveau Rot - Experten)",
    "taskText": "Expertenaufgabe (Beurteilen, Gestalten, Reflexion)...",
    "hintText": "Lösungstipp oder Denkhilfe...",
    "targetAudience": "Vertiefung"
  }
]

<!-- SECTION:STATION_SPECIAL -->
TITEL: ${form.stationSpecialType === 'timeline' ? 'Historischer Zeitstrahl' : form.stationSpecialType === 'detective' ? 'Quellen-Detektiv' : form.stationSpecialType === 'experiment' ? 'Experiment & Beobachtung' : 'Entdecker-Station'}
ITEMS:
[
  {
    "title": "Station 1",
    "periodOrCategory": "Epoche oder Kategorie",
    "icon": "🔍",
    "description": "Erklärung oder Beobachtung"
  }
]

<!-- SECTION:STATION_QUIZ -->
Valides JSON-Array mit genau ${form.stationCustomization?.quizQuestionCount || 6} Multiple-Choice-Fragen.
WICHTIG: Die richtige Antwort darf NICHT immer Option A sein! Verteile correctIndex (0, 1, 2 oder 3) abwechselnd und zufällig!
[
  {
    "question": "Frage mit richtiger Antwort bei Option C?",
    "options": ["Falsche Option A", "Falsche Option B", "Richtige Antwort C", "Falsche Option D"],
    "correctIndex": 2,
    "explanation": "Didaktische Begründung."
  },
  {
    "question": "Frage mit richtiger Antwort bei Option A?",
    "options": ["Richtige Antwort A", "Falsche Option B", "Falsche Option C", "Falsche Option D"],
    "correctIndex": 0,
    "explanation": "Didaktische Begründung."
  }
]

<!-- SECTION:STATION_REFLECTION -->
CHECKLIST:
[
  "Ich habe alle Stationen aufmerksam bearbeitet",
  "Ich kenne die wichtigsten Fachbegriffe und kann sie erklären",
  "Ich kann mein Wissen auf neue Aufgaben anwenden"
]
SEARCH:
Valides JSON-Array von genau ${form.stationCustomization?.youtubeLinkCount || 3} YouTube-Suchbegriffen:
[
  "${topic?.title || 'Thema'} einfach erklärt",
  "${topic?.title || 'Thema'} Dokumentation Schule",
  "${topic?.title || 'Thema'} Zusammenfassung"
]
` : ''}

<!-- SECTION:WORKSHEET -->
Hier ein druckfertiges, ansprechendes DIN-A4-Arbeitsblatt im Markdown-Format:
- Schulkopf: [Fach: ${subject.name} | Klasse: ${form.gradeLevel} | Name: ________ | Datum: ________]
- Titel & motivierender Einleitungstext
- 3 klar differenzierte Niveaustufen:
  * NIVEAU GRÜN (AFB I - Basiswissen)
  * NIVEAU GELB (AFB II - Transfer & Zusammenhang)
  * NIVEAU ROT (AFB III - Urteil, Reflexion oder Gestaltung)
- Ausführlicher Lösungsteil für die Lehrkraft am Ende

<!-- SECTION:VOCABULARY -->
Erstelle mindestens 4 bis 6 zentrale Fachbegriffe mit schülergerechter, einfacher Erklärung (Wortspeicher für DaZ & Förderung und Karten-Memory).
Format:
* **Fachbegriff 1**: Erklärung in einfacher Sprache
* **Fachbegriff 2**: Erklärung in einfacher Sprache

<!-- SECTION:GAME_QUESTIONS -->
Erstelle ein valides JSON-Array mit 5 bis 8 Multiple-Choice-Fragen für das interaktive Lernspiel (mit je 3-4 Optionen, 0-basiertem correctIndex, Erklärung und afbLevel).
Format Beispiel:
[
  {
    "question": "Frage?",
    "options": ["Antwort A", "Antwort B", "Antwort C"],
    "correctIndex": 0,
    "explanation": "Didaktische Erklärung, warum Antwort A stimmt und welcher Denkfehler bei den anderen vorliegt.",
    "afbLevel": "I"
  }
]

<!-- SECTION:GAME_ORDER -->
Erstelle ein valides JSON-Array mit 4 bis 6 Teilschritten oder Ereignissen in der KORREKTEN logischen/chronologischen Reihenfolge zum Thema:
[
  "1. Schritt: Problem erfassen / Ausgangssituation",
  "2. Schritt: Analyse und Einordnung",
  "3. Schritt: Überprüfung und Durchführung",
  "4. Schritt: Ergebnis und Bewertung"
]

<!-- SECTION:ESCAPE_CODE -->
4829

<!-- SECTION:RUBRIC -->
Erstelle ein detailliertes tabellarisches Bewertungsraster (Erwartungshorizont):
- Tabelle: Aufgabe | AFB-Stufe | Erwartete Leistung / Kriterien | Maximale Punktzahl
- Schüler-Rückmeldebogen mit Kriterien-Check (Vollständig / Teilweise / Noch üben)
- Didaktische Förderhinweise für Regelschüler

Gib jetzt die vollständige Ausarbeitung aus. Achte auf didaktische Tiefe und absolute Regelschultauglichkeit!`;

  return { systemPrompt, userPrompt };
}

export function parseAiOutput(rawResponse: string, form: GeneratorFormState): ParsedGenerationOutput {
  const subject = THUERINGEN_SUBJECTS.find(s => s.id === form.subjectId) || THUERINGEN_SUBJECTS[0];
  const topic = subject.topics.find(t => t.id === form.topicId) || subject.topics[0];

  // Helper to extract content between tags resiliently
  const extractSection = (tag: string): string => {
    const marker = `<!-- SECTION:${tag} -->`;
    const startIdx = rawResponse.indexOf(marker);
    if (startIdx === -1) return '';
    const contentStart = startIdx + marker.length;

    const nextMarkerIdx = rawResponse.indexOf('<!-- SECTION:', contentStart);
    if (nextMarkerIdx !== -1) {
      return rawResponse.slice(contentStart, nextMarkerIdx).trim();
    }
    return rawResponse.slice(contentStart).trim();
  };

  const worksheetRaw = extractSection('WORKSHEET');
  const vocabRaw = extractSection('VOCABULARY');
  const gameQuestionsRaw = extractSection('GAME_QUESTIONS');
  const gameOrderRaw = extractSection('GAME_ORDER');
  const escapeCodeRaw = extractSection('ESCAPE_CODE');
  const rubricRaw = extractSection('RUBRIC');

  // Station Sections
  const stationGoalsRaw = extractSection('STATION_GOALS');
  const stationKnowledgeRaw = extractSection('STATION_KNOWLEDGE');
  const stationFlashcardsRaw = extractSection('STATION_FLASHCARDS');
  const stationClozeRaw = extractSection('STATION_CLOZE');
  const stationAfbRaw = extractSection('STATION_AFB');
  const stationSpecialRaw = extractSection('STATION_SPECIAL');
  const stationQuizRaw = extractSection('STATION_QUIZ');
  const stationReflectionRaw = extractSection('STATION_REFLECTION');

  // Parse Vocabulary
  const vocabulary: { term: string; explanation: string }[] = [];
  if (vocabRaw) {
    const lines = vocabRaw.split('\n');
    for (const line of lines) {
      const match = line.match(/\*\*(.*?)\*\*[:\-]?\s*(.*)/);
      if (match) {
        vocabulary.push({ term: match[1].trim(), explanation: match[2].trim() });
      }
    }
  }

  // Helper for resilient JSON Array extraction from LLM outputs (handles ```json fences & trailing commas)
  const extractJsonArray = <T = any>(text: string): T[] | null => {
    if (!text) return null;
    const cleaned = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        const parsed = JSON.parse(cleaned.slice(start, end + 1));
        if (Array.isArray(parsed)) return parsed;
      } catch {
        try {
          const withoutTrailingCommas = cleaned.slice(start, end + 1).replace(/,\s*([}\]])/g, '$1');
          const parsed = JSON.parse(withoutTrailingCommas);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
    }
    return null;
  };

  // Anti-A-Bias: Shuffle quiz question options so Option A is never systematically the correct answer
  function shuffleOptionsList<T extends { options: string[]; correctIndex: number }>(items: T[]): T[] {
    return items.map(q => {
      if (!q.options || q.options.length <= 1) return q;
      const correctVal = q.options[q.correctIndex] ?? q.options[0];
      const shuffled = [...q.options];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const newIdx = shuffled.indexOf(correctVal);
      return {
        ...q,
        options: shuffled,
        correctIndex: newIdx !== -1 ? newIdx : 0
      };
    });
  }

  // Parse Questions
  let questions: QuizQuestion[] = extractJsonArray<QuizQuestion>(gameQuestionsRaw) || [];
  questions = shuffleOptionsList(questions);

  // Parse Order Items
  let orderSequence: string[] = extractJsonArray<string>(gameOrderRaw) || [];

  const escapeCode = escapeCodeRaw ? escapeCodeRaw.replace(/[^0-9]/g, '').slice(0, 4) : '4829';

  // Default fallback questions if JSON parsing didn't find questions
  if (!questions || questions.length === 0) {
    questions = [
      {
        question: `Was ist das zentrale Merkmal beim Thema "${topic?.title || 'Unterricht'}"?`,
        options: ['Grundlegende Definition und Fachwissen', 'Zufällige Vermutung', 'Unpassender Kontext', 'Irrelevante Eigenschaft'],
        correctIndex: 0,
        explanation: 'In der Thüringer Regelschule ist das Verständnis der Kernbegriffe die Basis für erfolgreiches Weiterlernen.',
        afbLevel: 'I'
      },
      {
        question: `Wie lässt sich der Sachverhalt in Klasse ${form.gradeLevel} fachlich einordnen?`,
        options: ['Nicht relevant', 'Durch Analyse von Zusammenhängen und Ursachen', 'Nur durch Auswendiglernen', 'Ohne Begründung'],
        correctIndex: 1,
        explanation: 'AFB II verlangt das Erläutern von kausalen Zusammenhängen und Transfer.',
        afbLevel: 'II'
      },
      {
        question: `Welche reflektierte Schlussfolgerung ist bei diesem Thema angemessen?`,
        options: ['Keine Aussage möglich', 'Einseitige Behauptung', 'Ein begründetes Sach- und Werturteil unter Abwägung von Kriterien', 'Ignorieren der Belege'],
        correctIndex: 2,
        explanation: 'Im Anforderungsbereich III wird die Fähigkeit zur sachgerechten Urteilsbildung gefördert.',
        afbLevel: 'III'
      }
    ];
  }

  let gameHtml = '';
  let stationHtml: string | undefined = undefined;

  if (form.format === 'lernstation') {
    // 1. Goals
    let goals: string[] = extractJsonArray<string>(stationGoalsRaw) || [];
    if (goals.length === 0) {
      goals = [
        `Ich verstehe die zentralen Grundbegriffe zum Thema "${topic?.title || 'Unterricht'}".`,
        'Ich kann die wesentlichen Zusammenhänge sachgerecht und mit Fachbegriffen erklären.',
        'Ich kann mein Wissen auf unterschiedliche Anforderungsbereiche (AFB I–III) anwenden.'
      ];
    }

    // 2. Knowledge
    const knowledgeHtml = formatKnowledgeMarkdown(stationKnowledgeRaw || worksheetRaw || '');

    // 3. Flashcards
    let flashcards: StationFlashcard[] = extractJsonArray<StationFlashcard>(stationFlashcardsRaw) || [];
    if (flashcards.length === 0 && vocabulary.length > 0) {
      flashcards = vocabulary.map(v => ({ front: v.term, back: v.explanation }));
    } else if (flashcards.length === 0) {
      flashcards = [
        { front: topic?.title || 'Fachbegriff 1', back: 'Zentraler Begriff dieser Lerneinheit.' },
        { front: 'Definition & Merkmale', back: 'Eigenschaften und wichtige Merkmale des Themas.' },
        { front: 'Zusammenhang & Bedeutung', back: 'Warum dieser Gegenstand im Fach ' + subject.name + ' bedeutsam ist.' }
      ];
    }

    // 4. Cloze
    let clozeHtml = '';
    if (form.stationModules?.cloze !== false) {
      if (stationClozeRaw) {
        clozeHtml = convertClozeMarkdownToHtml(stationClozeRaw);
      } else {
        clozeHtml = convertClozeMarkdownToHtml(
          `Im Fach ${subject.name} beschäftigt sich das Thema [${topic?.title || 'Unterricht'}* / Nebensache / Freistunde] mit den wesentlichen Grundlagen. Für Regelschüler ist es wichtig, die [Fachbegriffe* / Fremdsprachen / Abkürzungen] sicher zu beherrschen und im Alltag [anzuwenden* / zu vergessen / zu ignorieren].`
        );
      }
    }

    // 5. AFB Tasks
    let afbTasks: StationAfbTask[] = extractJsonArray<StationAfbTask>(stationAfbRaw) || [];
    if (afbTasks.length === 0) {
      afbTasks = [
        {
          level: 'I',
          title: 'Aufgabe 1 (Niveau Grün - Basis)',
          taskText: `Nenne die wichtigsten Merkmale zum Thema "${topic?.title || 'Thema'}" und beschreibe sie in einfachen Sätzen.`,
          hintText: 'Schau noch einmal in den Wissensbereich oder auf die Lernkarten.',
          targetAudience: 'Basis-Förderung'
        },
        {
          level: 'II',
          title: 'Aufgabe 2 (Niveau Gelb - Standard)',
          taskText: `Erläutere Ursachen und Zusammenhänge. Vergleiche die verschiedenen Aspekte miteinander.`,
          hintText: 'Nutze die Signalwörter "weil", "dadurch dass" und "im Unterschied zu".',
          targetAudience: 'Regel-Niveau'
        },
        {
          level: 'III',
          title: 'Aufgabe 3 (Niveau Rot - Experten)',
          taskText: `Beurteile die Bedeutung dieses Themas für die heutige Zeit. Nimm begründet Stellung.`,
          hintText: 'Wäge mindestens zwei verschiedene Standpunkte oder Argumente gegeneinander ab.',
          targetAudience: 'Vertiefung'
        }
      ];
    }

    // 6. Special Module
    let specialModuleTitle = 'Quellen- & Entdecker-Station';
    if (form.stationSpecialType === 'timeline') specialModuleTitle = 'Historischer Zeitstrahl & Epochen';
    else if (form.stationSpecialType === 'detective') specialModuleTitle = 'Quellen-Detektiv & Spurensuche';
    else if (form.stationSpecialType === 'experiment') specialModuleTitle = 'Experiment & Beobachtungs-Station';

    if (stationSpecialRaw) {
      const titleMatch = stationSpecialRaw.match(/TITEL:\s*([^\n\r]+)/i);
      if (titleMatch && titleMatch[1].trim()) {
        specialModuleTitle = titleMatch[1].trim();
      }
    }

    let specialItems: StationSpecialItem[] = extractJsonArray<StationSpecialItem>(stationSpecialRaw) || [];
    if (specialItems.length === 0) {
      specialItems = [
        {
          title: 'Entdeckung 1: Der Ausgangspunkt',
          periodOrCategory: 'Phase 1',
          icon: '🔍',
          description: `Erste Beobachtungen und historische/fachliche Ausgangslage zu ${topic?.title || 'Thema'}.`
        },
        {
          title: 'Entdeckung 2: Die Entwicklung',
          periodOrCategory: 'Phase 2',
          icon: '⚡',
          description: 'Zentrale Veränderungen und prägende Ereignisse in diesem Themengebiet.'
        },
        {
          title: 'Entdeckung 3: Die Auswirkung',
          periodOrCategory: 'Phase 3',
          icon: '💡',
          description: 'Nachhaltige Folgen und Erkenntnisse für unser heutiges Verständnis.'
        }
      ];
    }

    // 7. Quiz
    let stationQuiz: StationQuizQuestion[] = extractJsonArray<StationQuizQuestion>(stationQuizRaw) || [];
    if (stationQuiz.length === 0 && questions.length > 0) {
      stationQuiz = questions.map(q => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation || ''
      }));
    }
    stationQuiz = shuffleOptionsList(stationQuiz);

    // 8. Reflection
    let reflectionChecklist: string[] = [];
    let researchRecommendations: string[] = [];
    if (stationReflectionRaw) {
      const checklistIdx = stationReflectionRaw.indexOf('CHECKLIST:');
      const searchIdx = stationReflectionRaw.indexOf('SEARCH:');
      if (checklistIdx !== -1) {
        const checkText = searchIdx !== -1 ? stationReflectionRaw.slice(checklistIdx, searchIdx) : stationReflectionRaw.slice(checklistIdx);
        reflectionChecklist = extractJsonArray<string>(checkText) || [];
      }
      if (searchIdx !== -1) {
        const searchText = stationReflectionRaw.slice(searchIdx);
        researchRecommendations = extractJsonArray<string>(searchText) || [];
      }
      if (reflectionChecklist.length === 0) {
        reflectionChecklist = extractJsonArray<string>(stationReflectionRaw) || [];
      }
    }

    if (reflectionChecklist.length === 0) {
      reflectionChecklist = [
        'Ich habe alle Stationen aufmerksam durchgearbeitet.',
        `Ich kenne die wichtigsten Fachbegriffe zu "${topic?.title || 'Thema'}" und kann sie erklären.`,
        'Ich habe die Aufgaben auf meinem Niveau eigenständig bearbeitet.'
      ];
    }

    if (researchRecommendations.length === 0) {
      researchRecommendations = [
        `${topic?.title || subject.name} einfach erklärt`,
        `${topic?.title || subject.name} Regelschule Dokumentation`
      ];
    }

    // Inclusion Tips from vocabulary
    const inclusionTips = form.stationInclusionTipps !== false ? vocabulary : [];

    stationHtml = buildSelfContainedStationHtml({
      title: topic?.title || 'Digitale Lernstation',
      subject: subject.name,
      grade: form.gradeLevel,
      topic: topic?.title || 'Themenfeld Regelschule',
      goals: form.stationModules?.goals !== false ? goals : [],
      knowledgeHtml: form.stationModules?.knowledge !== false ? knowledgeHtml : '',
      inclusionTips,
      flashcards: form.stationModules?.flashcards !== false ? flashcards : [],
      clozeHtml,
      clozeWithWordBank: form.stationCustomization?.clozeWithWordBank ?? true,
      afbTasks: form.stationModules?.afbTasks !== false ? afbTasks : [],
      specialModuleTitle,
      specialItems: form.stationModules?.specialModule !== false ? specialItems : [],
      quizQuestions: form.stationModules?.quiz !== false ? stationQuiz : [],
      reflectionChecklist: form.stationModules?.reflection !== false ? reflectionChecklist : [],
      researchRecommendations,
      designTheme: form.htmlDesignTheme,
      customDesignPrompt: form.customHtmlDesignPrompt,
      bgPattern: form.htmlBgPattern
    });

    gameHtml = stationHtml;
  } else {
    // Build standard standalone Single-File HTML game
    gameHtml = buildSelfContainedGameHtml({
      title: topic?.title || 'Unterrichts-Lernspiel',
      subject: subject.name,
      grade: form.gradeLevel,
      topic: topic?.title || 'Themenfeld Regelschule',
      questions,
      inclusionMode: form.inclusionMode,
      vocabulary,
      gameMode: form.gameMode || 'quiz',
      gameSocialMode: form.gameSocialMode || 'solo',
      gameStoryTheme: form.gameStoryTheme || 'neutral',
      customStoryTheme: form.customStoryTheme || '',
      orderSequence,
      escapeCode: escapeCode || '4829'
    });
  }

  const giftExport = generateMoodleGiftExport(questions, topic?.title || subject.name);

  // Fallback worksheet and rubric if tags were missing
  const worksheetMarkdown = worksheetRaw || rawResponse;
  const rubricMarkdown = rubricRaw || `### Bewertungsraster & Erwartungshorizont\n\n| Aufgabe | AFB-Stufe | Kriterien | Punkte |\n|---|---|---|---|\n| Teil 1 | AFB I | Fachbegriffe korrekt benannt | 4 P. |\n| Teil 2 | AFB II | Zusammenhänge sachlich erläutert | 6 P. |\n| Teil 3 | AFB III | Begründetes Urteil gefällt | 4 P. |\n\n*Gesamt: 14 Punkte nach Thüringer Regelschul-Notenschlüssel.*`;

  const { userPrompt } = buildDidacticPrompt(form);

  return {
    gameHtml,
    stationHtml,
    worksheetMarkdown,
    rubricMarkdown,
    vocabulary,
    giftExport,
    promptText: userPrompt,
    rawResponse,
    generatedAt: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    orderSequence,
    escapeCode
  };
}

export async function executeGeneration(
  form: GeneratorFormState,
  provider: AiProvider,
  model?: string
): Promise<GenerationResponse> {
  const apiKeyInfo = getEffectiveApiKey(provider);
  if (!apiKeyInfo) {
    throw new Error(`Kein API-Schlüssel für ${PROVIDER_CONFIGS[provider].name} hinterlegt. Bitte klicke oben rechts auf "API-Schlüssel" oder hinterlege Umgebungsvariablen in Vercel.`);
  }

  const { systemPrompt, userPrompt } = buildDidacticPrompt(form);
  const startTime = Date.now();

  let targetModel = model || PROVIDER_CONFIGS[provider].defaultModel;
  if (provider === 'openrouter') {
    const customPreset = getEffectiveOpenRouterPreset();
    if (model === 'custom-preset' || model === '@preset/freie-modelle' || !model) {
      targetModel = customPreset.startsWith('@preset/') ? customPreset : `@preset/${customPreset}`;
    }
  }

  try {
    let rawText = '';
    if (provider === 'gemini') {
      rawText = await callGeminiApi({
        apiKey: apiKeyInfo.key,
        systemPrompt,
        userPrompt,
        model: targetModel
      });
    } else {
      rawText = await callOpenAiCompatibleApi({
        provider,
        apiKey: apiKeyInfo.key,
        model: targetModel,
        systemPrompt,
        userPrompt
      });
    }

    const durationMs = Date.now() - startTime;
    return {
      success: true,
      content: rawText,
      provider,
      modelUsed: targetModel,
      durationMs
    };
  } catch (err: any) {
    return {
      success: false,
      content: '',
      provider,
      modelUsed: targetModel,
      durationMs: Date.now() - startTime,
      error: err.message || 'Unbekannter Generierungsfehler'
    };
  }
}
