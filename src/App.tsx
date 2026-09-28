import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  FileText, 
  Award, 
  Terminal, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { StepFormatSelect } from './components/builder/StepFormatSelect';
import { StepCurriculumSelect } from './components/builder/StepCurriculumSelect';
import { StepOperatorAfb } from './components/builder/StepOperatorAfb';
import { StepInclusionDaz } from './components/builder/StepInclusionDaz';
import { StepActionButtons } from './components/builder/StepActionButtons';

import { TabInteractiveGame } from './components/preview/TabInteractiveGame';
import { TabWorksheetPrint } from './components/preview/TabWorksheetPrint';
import { TabRubricAssessment } from './components/preview/TabRubricAssessment';
import { TabPromptHub } from './components/preview/TabPromptHub';

import { AiProvider } from './types/ai';
import { GradeLevel } from './types/curriculum';
import { GeneratorFormState, ParsedGenerationOutput, ActiveOutputTab } from './types/generator';
import { THUERINGEN_SUBJECTS } from './data/thueringenCurriculum';
import { PROVIDER_CONFIGS } from './data/defaultPresets';
import { 
  buildDidacticPrompt, 
  executeGeneration, 
  parseAiOutput,
  getEffectiveApiKey 
} from './services/aiService';

export const App: React.FC = () => {
  // --- FORM STATE ---
  const [formState, setFormState] = useState<GeneratorFormState>({
    format: 'arbeitsblatt',
    subjectId: 'deutsch',
    gradeLevel: 6,
    topicId: 'de-56-1',
    customTopicDetail: '',
    selectedOperators: ['nennen', 'beschreiben', 'erlaeutern', 'beurteilen'],
    afbDistribution: { afb1: 40, afb2: 40, afb3: 20 },
    inclusionMode: true,
    targetDurationMinutes: 45,
    additionalInstructions: ''
  });

  // --- AI PROVIDER STATE ---
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>('gemini');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // --- OUTPUT & TAB STATE ---
  const [activeTab, setActiveTab] = useState<ActiveOutputTab>('worksheet');
  const [output, setOutput] = useState<ParsedGenerationOutput>(() => {
    // Initial sample output so the right pane is never blank
    const sampleRaw = `<!-- SECTION:WORKSHEET -->
# Fabeln untersuchen & die Moral entschlüsseln
Klassenstufe 6 • Deutsch • Staatliche Regelschule Heimbürgeschule Kahla

### NIVEAU GRÜN (AFB I - Basiswissen)
1. **Nenne** vier typische Tiere, die in Fabeln vorkommen, und **beschreibe** ihre menschlichen Charaktereigenschaften (z.B. Fuchs = schlau/listig).
2. Lies den Fabeltext "Der Rabe und der Fuchs" von Aesop. **Markiere** die wörtliche Rede im Text mit Textmarker.

### NIVEAU GELB (AFB II - Transfer & Zusammenhang)
3. **Erläutere**, mit welcher Absicht der Fuchs dem Raben schmeichelt. Warum fällt der Rabe auf den Trick herein?
4. **Vergleiche** das Verhalten der Tiere mit einer Situation aus deinem eigenen Schulalltag. Worin besteht die Ähnlichkeit?

### NIVEAU ROT (AFB III - Reflexion & Urteil)
5. **Beurteile**, welche Lehre (Moral) der Dichter den Menschen mit dieser Fabel vermitteln wollte.
6. **Gestalte** einen kurzen Dialog, in dem der Rabe den Schwindel rechtzeitig durchschaut und dem Fuchs eine schlagfertige Antwort gibt.

### Musterlösung & Erwartungshorizont (Für die Lehrkraft)
- Zu 1: Fuchs (listig/schlau), Esel (stur/töricht), Wolf (gierig), Löwe (stark/herrschsüchtig).
- Zu 3: Der Fuchs will den Käse erbeuten. Der Rabe ist eitel und öffnet vor Stolz den Schnabel zum Singen.
- Zu 5: Moral: Schmeichlern darf man nicht blind vertrauen, Eitelkeit schadet einem selbst.

<!-- SECTION:VOCABULARY -->
* **Fabel**: Eine kurze Erzählung, in der Tiere wie Menschen handeln und sprechen. Am Ende gibt es eine Lehre.
* **Moral**: Die Lehre oder Lebensweisheit, die der Leser aus einer Geschichte lernen soll.
* **Eitelkeit**: Wenn jemand übertrieben stolz auf sein eigenes Aussehen oder Können ist.
* **Charaktereigenschaft**: Ein typisches Merkmal des Verhaltens eines Tieres oder Menschen.

<!-- SECTION:GAME_QUESTIONS -->
[
  {
    "question": "Welche Eigenschaft wird dem Fuchs in traditionellen Fabeln typischerweise zugeordnet?",
    "options": ["Schlauheit und List", "Dummheit und Naivität", "Treue und Hilfsbereitschaft", "Faulheit"],
    "correctIndex": 0,
    "explanation": "In der Fabeltradition (z.B. bei Aesop und Lessing) steht Meister Reineke Fuchs symbolisch für Schlauheit und Tücke.",
    "afbLevel": "I"
  },
  {
    "question": "Was bezweckt die 'Moral' am Ende einer Fabel?",
    "options": ["Sie soll die Geschichte künstlich verlängern", "Sie gibt den Menschen einen lehrreichen Ratschlag für ihr Zusammenleben", "Sie nennt das Todesdatum des Autors", "Sie beschreibt das Wetter"],
    "correctIndex": 1,
    "explanation": "Die Fabel verfolgt die didaktische Absicht 'docere et delectare' (belehren und unterhalten).",
    "afbLevel": "II"
  },
  {
    "question": "Warum lässt der Rabe in der berühmten Fabel den Käse fallen?",
    "options": ["Weil der Käse schlecht war", "Weil der Fuchs den Baumstamm umgesägt hat", "Weil er dem Fuchs ein Lied vorsingen wollte und vor Eitelkeit den Schnabel öffnete", "Aus Versehen beim Einschlafen"],
    "correctIndex": 2,
    "explanation": "Der Fuchs schmeichelt der schönen Stimme des Raben, bis dieser eitel lossingt und der Käse hinabfällt.",
    "afbLevel": "II"
  },
  {
    "question": "Wie beurteilst du die Aktualität von Fabeln im heutigen Zeitalter von Social Media?",
    "options": ["Völlig veraltet, niemand fällt mehr auf Schmeicheleien herein", "Sehr aktuell, da auch im Internet Schmeichelei und Täuschung für Klicks genutzt werden", "Fabeln dürfen heute nicht mehr gelesen werden", "Fabeln handeln nur von Tieren und haben keinen Menschenbezug"],
    "correctIndex": 1,
    "explanation": "Im AFB III erkennen Regelschüler den zeitlosen Transfer auf Phänomene wie 'Fake News' und 'Influencer-Schmeicheleien'.",
    "afbLevel": "III"
  }
]

<!-- SECTION:RUBRIC -->
### Bewertungsraster & Erwartungshorizont (Thüringer Regelschule)

| Aufgabe | AFB-Stufe | Kriterien & Teilleistungen | Punkte |
|---|---|---|---|
| Aufgabe 1 | AFB I | 4 Fabeltiere und menschliche Eigenschaften sachlich richtig benannt | 4 P. |
| Aufgabe 2 | AFB I | Wörtliche Rede vollständig und korrekt im Text markiert | 2 P. |
| Aufgabe 3 | AFB II | Absicht des Fuchses und psychologische Ursache schlüssig erläutert | 4 P. |
| Aufgabe 4 | AFB II | Gelungener Transfer auf den Alltag mit konkretem Beispiel | 4 P. |
| Aufgabe 5 | AFB III | Moral der Fabel präzise formuliert und begründet | 3 P. |
| Aufgabe 6 | AFB III | Eigener kreativer Dialog sprachlich passend und logisch gestaltet | 5 P. |

*Gesamtpunktzahl: 22 Punkte.*`;

    return parseAiOutput(sampleRaw, {
      format: 'arbeitsblatt',
      subjectId: 'deutsch',
      gradeLevel: 6,
      topicId: 'de-56-1',
      customTopicDetail: '',
      selectedOperators: ['nennen', 'beschreiben', 'erlaeutern', 'beurteilen'],
      afbDistribution: { afb1: 40, afb2: 40, afb3: 20 },
      inclusionMode: true,
      targetDurationMinutes: 45,
      additionalInstructions: ''
    });
  });

  // --- UI DIALOGS & TOASTS ---
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync model selection with active provider
  useEffect(() => {
    setSelectedModel(PROVIDER_CONFIGS[selectedProvider].defaultModel);
  }, [selectedProvider]);

  // Adjust topic when subject or grade changes
  const handleSubjectChange = (subjectId: string) => {
    const sub = THUERINGEN_SUBJECTS.find(s => s.id === subjectId) || THUERINGEN_SUBJECTS[0];
    const newGrade = sub.allowedGrades.includes(formState.gradeLevel) ? formState.gradeLevel : sub.allowedGrades[0];
    const newTopic = sub.topics[0]?.id || '';
    setFormState(prev => ({
      ...prev,
      subjectId,
      gradeLevel: newGrade,
      topicId: newTopic
    }));
  };

  const handleGradeChange = (gradeLevel: GradeLevel) => {
    const sub = THUERINGEN_SUBJECTS.find(s => s.id === formState.subjectId) || THUERINGEN_SUBJECTS[0];
    const doubleGrade = gradeLevel <= 6 ? '5/6' : gradeLevel <= 8 ? '7/8' : '9/10';
    const applicableTopic = sub.topics.find(t => t.doubleGrade === doubleGrade) || sub.topics[0];
    setFormState(prev => ({
      ...prev,
      gradeLevel,
      topicId: applicableTopic?.id || prev.topicId
    }));
  };

  const handleOperatorToggle = (operatorId: string) => {
    setFormState(prev => {
      const exists = prev.selectedOperators.includes(operatorId);
      const nextOps = exists
        ? prev.selectedOperators.filter(id => id !== operatorId)
        : [...prev.selectedOperators, operatorId];
      return { ...prev, selectedOperators: nextOps };
    });
  };

  const handleResetForm = () => {
    setFormState({
      format: 'arbeitsblatt',
      subjectId: 'deutsch',
      gradeLevel: 6,
      topicId: 'de-56-1',
      customTopicDetail: '',
      selectedOperators: ['nennen', 'beschreiben', 'erlaeutern', 'beurteilen'],
      afbDistribution: { afb1: 40, afb2: 40, afb3: 20 },
      inclusionMode: true,
      targetDurationMinutes: 45,
      additionalInstructions: ''
    });
    addToast('Zurückgesetzt', 'Formular auf Standardwerte zurückgesetzt.', 'info');
  };

  // --- GENERATION HANDLERS ---
  const handleGeneratePromptOnly = () => {
    const { userPrompt } = buildDidacticPrompt(formState);
    setOutput(prev => ({
      ...prev,
      promptText: userPrompt
    }));
    setActiveTab('prompt');
    addToast('Prompt aktualisiert', 'Der didaktische Prompt wurde erzeugt und im Prompt-Hub angezeigt.', 'success');
  };

  const handleGenerateWithAi = async () => {
    const keyInfo = getEffectiveApiKey(selectedProvider);
    if (!keyInfo) {
      setIsKeyModalOpen(true);
      addToast('Kein API-Key hinterlegt', `Bitte trage einen Key für ${PROVIDER_CONFIGS[selectedProvider].name} ein oder nutze "Nur Prompt generieren".`, 'error');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const resp = await executeGeneration(formState, selectedProvider, selectedModel);
      if (resp.success) {
        const parsed = parseAiOutput(resp.content, formState);
        setOutput(parsed);
        // Switch tab based on format
        if (formState.format === 'lernspiel') {
          setActiveTab('game');
        } else {
          setActiveTab('worksheet');
        }
        addToast(
          'Erfolgreich generiert',
          `Material in ${(resp.durationMs / 1000).toFixed(1)}s via ${PROVIDER_CONFIGS[selectedProvider].name} erstellt.`,
          'success'
        );
      } else {
        setGenerationError(resp.error || 'Fehler bei der Generierung');
        addToast('Fehler bei Generierung', resp.error, 'error');
      }
    } catch (err: any) {
      setGenerationError(err.message || 'Generierungsfehler');
      addToast('Fehler', err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSubject = THUERINGEN_SUBJECTS.find(s => s.id === formState.subjectId) || THUERINGEN_SUBJECTS[0];
  const currentTopic = currentSubject.topics.find(t => t.id === formState.topicId) || currentSubject.topics[0];
  const { systemPrompt, userPrompt } = buildDidacticPrompt(formState);

  return (
    <div className="min-h-screen bg-school-surface flex flex-col font-sans">
      <Header
        selectedProvider={selectedProvider}
        onSelectProvider={setSelectedProvider}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onResetForm={handleResetForm}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LINK SPALTE: BUILDER FORM (5 Spalten auf Desktop) */}
          <div className="lg:col-span-5 space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-school-border shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-extrabold text-base text-school-textMain flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-school-primary" />
                Unterrichts-Konfigurator
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                Schritt-für-Schritt Flow
              </span>
            </div>

            {/* ERROR BANNER IF ANY */}
            {generationError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong>Generierungsfehler:</strong> {generationError}
                </div>
              </div>
            )}

            {/* SCHRITT 1: FORMAT */}
            <StepFormatSelect
              selectedFormat={formState.format}
              onSelectFormat={f => setFormState(prev => ({ ...prev, format: f }))}
            />

            {/* SCHRITT 2: CURRICULUM */}
            <StepCurriculumSelect
              subjectId={formState.subjectId}
              gradeLevel={formState.gradeLevel}
              topicId={formState.topicId}
              customTopicDetail={formState.customTopicDetail}
              onSubjectChange={handleSubjectChange}
              onGradeChange={handleGradeChange}
              onTopicChange={t => setFormState(prev => ({ ...prev, topicId: t }))}
              onCustomDetailChange={d => setFormState(prev => ({ ...prev, customTopicDetail: d }))}
            />

            {/* SCHRITT 3: OPERATOREN & AFB */}
            <StepOperatorAfb
              distribution={formState.afbDistribution}
              selectedOperators={formState.selectedOperators}
              onDistributionChange={d => setFormState(prev => ({ ...prev, afbDistribution: d }))}
              onOperatorToggle={handleOperatorToggle}
            />

            {/* SCHRITT 4: INKLUSION / DaZ */}
            <StepInclusionDaz
              inclusionMode={formState.inclusionMode}
              targetDurationMinutes={formState.targetDurationMinutes}
              additionalInstructions={formState.additionalInstructions}
              onInclusionToggle={enabled => setFormState(prev => ({ ...prev, inclusionMode: enabled }))}
              onDurationChange={dur => setFormState(prev => ({ ...prev, targetDurationMinutes: dur }))}
              onAdditionalInstructionsChange={txt => setFormState(prev => ({ ...prev, additionalInstructions: txt }))}
            />

            {/* SCHRITT 5: AKTIONEN & GENERIEREN */}
            <StepActionButtons
              provider={selectedProvider}
              model={selectedModel}
              isGenerating={isGenerating}
              onModelChange={setSelectedModel}
              onGeneratePromptOnly={handleGeneratePromptOnly}
              onGenerateWithAi={handleGenerateWithAi}
              onOpenKeyModal={() => setIsKeyModalOpen(true)}
            />
          </div>

          {/* RECHTE SPALTE: DREIGLEISIGE AUSGABE (7 Spalten auf Desktop) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* TABS LEISTE */}
            <div className="bg-white p-2 rounded-2xl border border-school-border shadow-soft flex items-center justify-between gap-1 overflow-x-auto">
              <div className="flex items-center gap-1.5 min-w-max">
                <button
                  onClick={() => setActiveTab('game')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                    activeTab === 'game'
                      ? 'bg-school-primary text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>1. Interaktives Lernspiel</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">HTML5</span>
                </button>

                <button
                  onClick={() => setActiveTab('worksheet')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                    activeTab === 'worksheet'
                      ? 'bg-school-primary text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>2. Druckfertiges Arbeitsblatt</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">DIN-A4</span>
                </button>

                <button
                  onClick={() => setActiveTab('rubric')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                    activeTab === 'rubric'
                      ? 'bg-school-primary text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>3. Bewertungsraster</span>
                </button>

                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                    activeTab === 'prompt'
                      ? 'bg-school-primary text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>4. Prompt-Hub</span>
                </button>
              </div>

              {output.generatedAt && (
                <span className="text-[11px] text-slate-400 font-semibold pr-2 hidden sm:inline">
                  Stand: {output.generatedAt} Uhr
                </span>
              )}
            </div>

            {/* TAB CONTENTS */}
            <div className="transition-all">
              {activeTab === 'game' && (
                <TabInteractiveGame
                  gameHtml={output.gameHtml}
                  giftExport={output.giftExport}
                  title={currentTopic?.title || currentSubject.name}
                  onShowToast={addToast}
                />
              )}

              {activeTab === 'worksheet' && (
                <TabWorksheetPrint
                  worksheetMarkdown={output.worksheetMarkdown}
                  vocabulary={output.vocabulary}
                  subjectName={currentSubject.name}
                  gradeLevel={formState.gradeLevel}
                  topicTitle={currentTopic?.title || 'Unterrichtsthema'}
                  inclusionMode={formState.inclusionMode}
                />
              )}

              {activeTab === 'rubric' && (
                <TabRubricAssessment
                  rubricMarkdown={output.rubricMarkdown}
                  topicTitle={currentTopic?.title || 'Unterrichtsthema'}
                  subjectName={currentSubject.name}
                  gradeLevel={formState.gradeLevel}
                />
              )}

              {activeTab === 'prompt' && (
                <TabPromptHub
                  systemPrompt={systemPrompt}
                  userPrompt={userPrompt}
                  onShowToast={addToast}
                />
              )}
            </div>
          </div>

        </div>
      </main>

      {/* API KEY SETTINGS MODAL */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeysChanged={() => {}}
        onShowToast={addToast}
      />

      {/* TOAST NOTIFICATIONS */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
