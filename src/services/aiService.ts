import { AiProvider, ApiKeyStore, GenerationRequest, GenerationResponse } from '../types/ai';
import { GeneratorFormState, ParsedGenerationOutput } from '../types/generator';
import { THUERINGEN_SUBJECTS } from '../data/thueringenCurriculum';
import { THUERINGEN_OPERATORS } from '../data/thueringenOperators';
import { TASK_FORMATS, PROVIDER_CONFIGS } from '../data/defaultPresets';
import { callGeminiApi, DEFAULT_SCHOOL_GEMINI_KEY } from './geminiEngine';
import { callOpenAiCompatibleApi } from './openAiCompatEngine';
import { buildSelfContainedGameHtml, generateMoodleGiftExport, QuizQuestion } from './gameTemplate';

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

=== STRUKTUR DER ANTWORT (SEHR WICHTIG) ===
Bitte strukturiere deine Antwort GENAU mit den folgenden Trenn-Tags, damit unsere Software die Inhalte automatisch in die Tabs einsortieren kann:

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

  // Helper to extract content between tags
  const extractSection = (tag: string, nextTags: string[]): string => {
    const startIdx = rawResponse.indexOf(`<!-- SECTION:${tag} -->`);
    if (startIdx === -1) return '';
    const contentStart = startIdx + `<!-- SECTION:${tag} -->`.length;

    let endIdx = rawResponse.length;
    for (const nextTag of nextTags) {
      const idx = rawResponse.indexOf(`<!-- SECTION:${nextTag} -->`, contentStart);
      if (idx !== -1 && idx < endIdx) {
        endIdx = idx;
      }
    }
    return rawResponse.slice(contentStart, endIdx).trim();
  };

  const worksheetRaw = extractSection('WORKSHEET', ['VOCABULARY', 'GAME_QUESTIONS', 'GAME_ORDER', 'ESCAPE_CODE', 'RUBRIC']);
  const vocabRaw = extractSection('VOCABULARY', ['GAME_QUESTIONS', 'GAME_ORDER', 'ESCAPE_CODE', 'RUBRIC']);
  const gameQuestionsRaw = extractSection('GAME_QUESTIONS', ['GAME_ORDER', 'ESCAPE_CODE', 'RUBRIC']);
  const gameOrderRaw = extractSection('GAME_ORDER', ['ESCAPE_CODE', 'RUBRIC']);
  const escapeCodeRaw = extractSection('ESCAPE_CODE', ['RUBRIC']);
  const rubricRaw = extractSection('RUBRIC', []);

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

  // Parse Questions
  let questions: QuizQuestion[] = [];
  if (gameQuestionsRaw) {
    try {
      const jsonStart = gameQuestionsRaw.indexOf('[');
      const jsonEnd = gameQuestionsRaw.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = gameQuestionsRaw.slice(jsonStart, jsonEnd + 1);
        questions = JSON.parse(jsonStr);
      }
    } catch (e) {
      console.warn('Could not parse game questions as JSON:', e);
    }
  }

  // Parse Order Items
  let orderSequence: string[] = [];
  if (gameOrderRaw) {
    try {
      const jsonStart = gameOrderRaw.indexOf('[');
      const jsonEnd = gameOrderRaw.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        orderSequence = JSON.parse(gameOrderRaw.slice(jsonStart, jsonEnd + 1));
      }
    } catch (e) {
      console.warn('Could not parse game order sequence as JSON:', e);
    }
  }

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

  // Build the complete standalone Single-File HTML game
  const gameHtml = buildSelfContainedGameHtml({
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

  const giftExport = generateMoodleGiftExport(questions, topic?.title || subject.name);

  // Fallback worksheet and rubric if tags were missing
  const worksheetMarkdown = worksheetRaw || rawResponse;
  const rubricMarkdown = rubricRaw || `### Bewertungsraster & Erwartungshorizont\n\n| Aufgabe | AFB-Stufe | Kriterien | Punkte |\n|---|---|---|---|\n| Teil 1 | AFB I | Fachbegriffe korrekt benannt | 4 P. |\n| Teil 2 | AFB II | Zusammenhänge sachlich erläutert | 6 P. |\n| Teil 3 | AFB III | Begründetes Urteil gefällt | 4 P. |\n\n*Gesamt: 14 Punkte nach Thüringer Regelschul-Notenschlüssel.*`;

  const { userPrompt } = buildDidacticPrompt(form);

  return {
    gameHtml,
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
