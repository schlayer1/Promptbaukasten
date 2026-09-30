import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  FileText, 
  Award, 
  Terminal, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Share2,
  CloudUpload,
  BookOpen,
  Globe
} from 'lucide-react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PinLoginModal } from './components/auth/PinLoginModal';
import { CloudLibraryModal } from './components/library/CloudLibraryModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { StepFormatSelect } from './components/builder/StepFormatSelect';
import { StepGameOptions } from './components/builder/StepGameOptions';
import { StepStationOptions } from './components/builder/StepStationOptions';
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
import { CloudMaterial } from './types/cloud';
import { THUERINGEN_SUBJECTS } from './data/thueringenCurriculum';
import { PROVIDER_CONFIGS } from './data/defaultPresets';
import { useAuth } from './context/AuthContext';
import { saveMaterialToCloud } from './services/firebase';
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
    additionalInstructions: '',
    gameMode: 'quiz',
    gameSocialMode: 'solo',
    includeMisconceptions: true,
    customMisconceptions: '',
    gameStoryTheme: 'neutral',
    customStoryTheme: '',
    stationModules: {
      goals: true,
      knowledge: true,
      flashcards: true,
      cloze: true,
      afbTasks: true,
      specialModule: true,
      quiz: true,
      reflection: true
    },
    stationSpecialType: 'auto',
    stationInclusionTipps: true,
    stationCustomization: {
      flashcardCount: 6,
      clozeHoleCount: 5,
      clozeWithWordBank: true,
      quizQuestionCount: 6,
      afb1TaskCount: 1,
      afb2TaskCount: 1,
      afb3TaskCount: 1,
      youtubeLinkCount: 3
    },
    htmlDesignTheme: 'topic-adaptive',
    customHtmlDesignPrompt: '',
    htmlBgPattern: 'auto'
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
      additionalInstructions: '',
      gameMode: 'quiz',
      gameSocialMode: 'solo',
      includeMisconceptions: true,
      customMisconceptions: '',
      gameStoryTheme: 'neutral',
      customStoryTheme: '',
      stationModules: {
        goals: true,
        knowledge: true,
        flashcards: true,
        cloze: true,
        afbTasks: true,
        specialModule: true,
        quiz: true,
        reflection: true
      },
      stationSpecialType: 'auto',
      stationInclusionTipps: true,
      stationCustomization: {
        flashcardCount: 6,
        clozeHoleCount: 5,
        clozeWithWordBank: true,
        quizQuestionCount: 6,
        afb1TaskCount: 1,
        afb2TaskCount: 1,
        afb3TaskCount: 1,
        youtubeLinkCount: 3
      },
      htmlDesignTheme: 'topic-adaptive',
      customHtmlDesignPrompt: '',
      htmlBgPattern: 'auto'
    });
  });

  // --- UI DIALOGS & TOASTS ---
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [isCloudLibraryOpen, setIsCloudLibraryOpen] = useState<boolean>(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- AUTH CONTEXT ---
  const { currentUser, isAuthenticated, openLoginModal } = useAuth();

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
      additionalInstructions: '',
      gameMode: 'quiz',
      gameSocialMode: 'solo',
      includeMisconceptions: true,
      customMisconceptions: '',
      gameStoryTheme: 'neutral',
      customStoryTheme: '',
      stationModules: {
        goals: true,
        knowledge: true,
        flashcards: true,
        cloze: true,
        afbTasks: true,
        specialModule: true,
        quiz: true,
        reflection: true
      },
      stationSpecialType: 'auto',
      stationInclusionTipps: true,
      stationCustomization: {
        flashcardCount: 6,
        clozeHoleCount: 5,
        clozeWithWordBank: true,
        quizQuestionCount: 6,
        afb1TaskCount: 1,
        afb2TaskCount: 1,
        afb3TaskCount: 1,
        youtubeLinkCount: 3
      },
      htmlDesignTheme: 'topic-adaptive',
      customHtmlDesignPrompt: '',
      htmlBgPattern: 'auto'
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
        if (formState.format === 'lernspiel' || formState.format === 'lernstation') {
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

  // --- CLOUD MATERIAL SAVE & LOAD HANDLERS ---
  const handleSaveToCloud = async () => {
    if (!isAuthenticated || !currentUser) {
      openLoginModal();
      addToast('Anmeldung erforderlich', 'Bitte melde dich mit deiner PIN an, um Materialien in der Schul-Cloud zu speichern.', 'info');
      return;
    }

    setIsSavingToCloud(true);
    try {
      const currentSub = THUERINGEN_SUBJECTS.find(s => s.id === formState.subjectId) || THUERINGEN_SUBJECTS[0];
      const currentTop = currentSub.topics.find(t => t.id === formState.topicId) || currentSub.topics[0];
      const title = `${currentSub.name}: ${currentTop?.title || 'Unterrichtseinheit'}`;

      const materialData: Omit<CloudMaterial, 'id' | 'createdAt'> = {
        title,
        format: formState.format,
        subjectId: formState.subjectId,
        subjectName: currentSub.name,
        gradeLevel: formState.gradeLevel,
        doubleGrade: formState.gradeLevel <= 6 ? '5/6' : formState.gradeLevel <= 8 ? '7/8' : '9/10',
        topicTitle: currentTop?.title || 'Unterrichtsthema',
        customTopicDetail: formState.customTopicDetail,
        worksheetMarkdown: output.worksheetMarkdown,
        rubricMarkdown: output.rubricMarkdown,
        vocabulary: output.vocabulary,
        gameHtml: output.gameHtml,
        giftExport: output.giftExport,
        promptText: output.promptText,
        authorId: currentUser.id,
        authorName: currentUser.name,
        sharedWithSchool: true,
        updatedAt: Date.now()
      };

      await saveMaterialToCloud(materialData);
      addToast(
        'In Schul-Cloud gespeichert!',
        `"${title}" steht nun dem Kollegium in der Schul-Bibliothek zur Verfügung.`,
        'success'
      );
    } catch (err: any) {
      console.error('Firebase save error:', err);
      addToast('Speicherfehler', err.message || 'Konnte nicht in Firebase gespeichert werden.', 'error');
    } finally {
      setIsSavingToCloud(false);
    }
  };

  const handleLoadMaterialFromCloud = (material: CloudMaterial) => {
    setOutput({
      worksheetMarkdown: material.worksheetMarkdown || '',
      rubricMarkdown: material.rubricMarkdown || '',
      vocabulary: material.vocabulary || [],
      gameHtml: material.gameHtml || '',
      giftExport: material.giftExport || '',
      promptText: material.promptText || '',
      rawResponse: '',
      generatedAt: new Date(material.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    });

    setFormState(prev => ({
      ...prev,
      format: material.format || prev.format,
      subjectId: material.subjectId || prev.subjectId,
      gradeLevel: (material.gradeLevel as GradeLevel) || prev.gradeLevel,
      customTopicDetail: material.customTopicDetail || ''
    }));

    if (material.format === 'lernspiel' || (material.gameHtml && material.gameHtml.length > 500)) {
      setActiveTab('game');
    } else {
      setActiveTab('worksheet');
    }
  };

  const currentSubject = THUERINGEN_SUBJECTS.find(s => s.id === formState.subjectId) || THUERINGEN_SUBJECTS[0];
  const currentTopic = currentSubject.topics.find(t => t.id === formState.topicId) || currentSubject.topics[0];
  const { systemPrompt, userPrompt } = buildDidacticPrompt(formState);

  return (
    <div className="min-h-screen bg-school-surface flex flex-col font-sans pb-16 lg:pb-0">
      <Header
        selectedProvider={selectedProvider}
        onSelectProvider={setSelectedProvider}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenLibrary={() => setIsCloudLibraryOpen(true)}
        onResetForm={handleResetForm}
      />

      <main className="flex-1 max-w-[1760px] 2xl:max-w-[1920px] w-full mx-auto p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:max-w-none print:w-full print:block">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block print:w-full print:p-0 print:m-0">
          
          {/* LINK SPALTE: BUILDER FORM (5 Spalten auf Desktop) */}
          <div className="lg:col-span-5 space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-school-border shadow-soft lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto custom-scrollbar print:hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-xs z-10 -mx-1 px-1">
              <h2 className="font-extrabold text-base text-school-textMain flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-school-primary" />
                Unterrichts-Konfigurator
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateWithAi}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-school-primary hover:bg-school-primaryDark active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  title="Unterrichtsmaterial & Lernspiel sofort erstellen"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Erstellt...' : 'Erstellen'}</span>
                </button>
                <span className="text-[11px] font-semibold text-slate-400 hidden xl:inline">
                  Schritt-Flow
                </span>
              </div>
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

            {/* SONDEROPTIONEN WENN FORMAT = LERNSTATION */}
            {formState.format === 'lernstation' && (
              <StepStationOptions
                stationModules={formState.stationModules}
                stationSpecialType={formState.stationSpecialType}
                stationInclusionTipps={formState.stationInclusionTipps}
                stationCustomization={formState.stationCustomization}
                htmlDesignTheme={formState.htmlDesignTheme}
                customHtmlDesignPrompt={formState.customHtmlDesignPrompt}
                htmlBgPattern={formState.htmlBgPattern}
                onModulesChange={mods => setFormState(prev => ({ ...prev, stationModules: mods }))}
                onSpecialTypeChange={st => setFormState(prev => ({ ...prev, stationSpecialType: st }))}
                onInclusionTippsToggle={enabled => setFormState(prev => ({ ...prev, stationInclusionTipps: enabled }))}
                onCustomizationChange={cust => setFormState(prev => ({ ...prev, stationCustomization: cust }))}
                onDesignThemeChange={theme => setFormState(prev => ({ ...prev, htmlDesignTheme: theme }))}
                onCustomDesignPromptChange={prompt => setFormState(prev => ({ ...prev, customHtmlDesignPrompt: prompt }))}
                onBgPatternChange={pat => setFormState(prev => ({ ...prev, htmlBgPattern: pat }))}
              />
            )}

            {/* SONDEROPTIONEN WENN FORMAT = LERNSPIEL */}
            {formState.format === 'lernspiel' && (
              <StepGameOptions
                gameMode={formState.gameMode}
                gameSocialMode={formState.gameSocialMode}
                includeMisconceptions={formState.includeMisconceptions}
                customMisconceptions={formState.customMisconceptions}
                gameStoryTheme={formState.gameStoryTheme}
                customStoryTheme={formState.customStoryTheme}
                onGameModeChange={mode => setFormState(prev => ({ ...prev, gameMode: mode }))}
                onSocialModeChange={mode => setFormState(prev => ({ ...prev, gameSocialMode: mode }))}
                onMisconceptionsToggle={enabled => setFormState(prev => ({ ...prev, includeMisconceptions: enabled }))}
                onCustomMisconceptionsChange={val => setFormState(prev => ({ ...prev, customMisconceptions: val }))}
                onStoryThemeChange={theme => setFormState(prev => ({ ...prev, gameStoryTheme: theme }))}
                onCustomStoryThemeChange={val => setFormState(prev => ({ ...prev, customStoryTheme: val }))}
              />
            )}

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
          <div id="output-pane" className="lg:col-span-7 space-y-4 scroll-mt-20 print:w-full print:block print:p-0 print:m-0">
            
            {/* TABS & CLOUD SAVE LEISTE */}
            <div className="bg-white p-2.5 rounded-2xl border border-school-border shadow-soft flex flex-wrap items-center justify-between gap-2 print:hidden">
              <div className="flex items-center gap-1.5 overflow-x-auto min-w-0 max-w-full py-0.5">
                <button
                  onClick={() => setActiveTab('game')}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition ${
                    activeTab === 'game'
                      ? 'bg-school-primary text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {formState.format === 'lernstation' ? (
                    <Globe className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Gamepad2 className="w-4 h-4" />
                  )}
                  <span>{formState.format === 'lernstation' ? '1. Lernstation (Webseite)' : '1. Lernspiel'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">HTML5</span>
                </button>

                <button
                  onClick={() => setActiveTab('worksheet')}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition ${
                    activeTab === 'worksheet'
                      ? 'bg-school-primary text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>2. Arbeitsblatt</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">A4</span>
                </button>

                <button
                  onClick={() => setActiveTab('rubric')}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition ${
                    activeTab === 'rubric'
                      ? 'bg-school-primary text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>3. Raster</span>
                </button>

                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition ${
                    activeTab === 'prompt'
                      ? 'bg-school-primary text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>4. Prompt</span>
                </button>
              </div>

              {/* SAVE TO CLOUD BUTTON & TIMESTAMP */}
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                {output.generatedAt && (
                  <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                    {output.generatedAt} Uhr
                  </span>
                )}

                <button
                  onClick={handleSaveToCloud}
                  disabled={isSavingToCloud}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-primary hover:bg-school-primaryDark text-white text-xs font-bold transition shadow-sm"
                  title="Aktuelles Material in der Firebase Cloud der Heimbürgeschule für alle Kollegen speichern"
                >
                  <CloudUpload className={`w-3.5 h-3.5 ${isSavingToCloud ? 'animate-bounce' : ''}`} />
                  <span>{isSavingToCloud ? 'Speichert...' : 'In Cloud speichern'}</span>
                </button>
              </div>
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
                  onRubricChange={md => setOutput(prev => ({ ...prev, rubricMarkdown: md }))}
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

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-30 bg-slate-900/90 backdrop-blur-md text-white p-2 rounded-2xl shadow-2xl flex items-center justify-between gap-2 border border-slate-700/80 print:hidden">
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200"
          >
            Baukasten
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('output-pane');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200"
          >
            Vorschau
          </button>
        </div>

        <button
          onClick={handleGenerateWithAi}
          disabled={isGenerating}
          className="flex-1 py-2 px-3 bg-school-primary hover:bg-school-primaryDark active:scale-95 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generiert...' : 'Erstellen'}</span>
        </button>
      </div>

      {/* PIN LOGIN MODAL */}
      <PinLoginModal onShowToast={addToast} />

      {/* CLOUD LIBRARY MODAL */}
      <CloudLibraryModal
        isOpen={isCloudLibraryOpen}
        onClose={() => setIsCloudLibraryOpen(false)}
        onLoadMaterial={handleLoadMaterialFromCloud}
        onShowToast={addToast}
      />

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
