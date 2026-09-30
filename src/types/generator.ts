import { GradeLevel, AfbDistribution } from './curriculum';
import { AiProvider } from './ai';

export type TaskFormatId = 
  | 'lernstation'
  | 'arbeitsblatt'
  | 'lernspiel'
  | 'test'
  | 'einstieg';

export interface TaskFormat {
  id: TaskFormatId;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  tag: string;
}

export type GameMode = 'quiz' | 'memory' | 'order';
export type GameSocialMode = 'solo' | 'duell' | 'escape';
export type GameStoryTheme = 'neutral' | 'detective' | 'space' | 'alchemy' | 'custom';

export interface StationModulesConfig {
  goals: boolean;
  knowledge: boolean;
  flashcards: boolean;
  cloze: boolean;
  afbTasks: boolean;
  specialModule: boolean;
  quiz: boolean;
  reflection: boolean;
}

export interface StationCustomizationConfig {
  flashcardCount: number; // z.B. 4, 6, 8, 10
  clozeHoleCount: number; // z.B. 3, 5, 8
  clozeWithWordBank: boolean; // true = Kasten mit Wörtern anzeigen
  quizQuestionCount: number; // z.B. 4, 6, 8, 10
  afb1TaskCount: number; // Anzahl Basis-Aufgaben (AFB I)
  afb2TaskCount: number; // Anzahl Standard-Aufgaben (AFB II)
  afb3TaskCount: number; // Anzahl Experten-Aufgaben (AFB III)
  youtubeLinkCount: number; // Anzahl empfohlener YouTube-Recherchen (z.B. 1 bis 5)
}

export type StationSpecialType = 'auto' | 'timeline' | 'detective' | 'experiment';

export type HtmlDesignTheme =
  | 'topic-adaptive'
  | 'age-primary'
  | 'age-middle'
  | 'age-senior'
  | 'dark-arcade'
  | 'warm-parchment'
  | 'custom';

export type HtmlBgPattern = 'auto' | 'dots' | 'grid' | 'gradient' | 'minimal';

export interface GeneratorFormState {
  format: TaskFormatId;
  subjectId: string;
  gradeLevel: GradeLevel;
  topicId: string;
  customTopicDetail: string;
  selectedOperators: string[];
  afbDistribution: AfbDistribution;
  inclusionMode: boolean; // Fördermodus / DaZ / Leichte Sprache
  targetDurationMinutes: number;
  additionalInstructions: string;
  // Neue didaktische Spieloptionen
  gameMode: GameMode;
  gameSocialMode: GameSocialMode;
  includeMisconceptions: boolean;
  customMisconceptions: string;
  gameStoryTheme: GameStoryTheme;
  customStoryTheme: string;
  // Digitale Lernstation Optionen
  stationModules: StationModulesConfig;
  stationSpecialType: StationSpecialType;
  stationInclusionTipps: boolean;
  stationCustomization: StationCustomizationConfig;
  // Visuelle Gestaltung & Hintergrund
  htmlDesignTheme: HtmlDesignTheme;
  customHtmlDesignPrompt: string;
  htmlBgPattern: HtmlBgPattern;
}

export interface ParsedGenerationOutput {
  gameHtml: string;
  stationHtml?: string;
  worksheetMarkdown: string;
  rubricMarkdown: string;
  vocabulary: { term: string; explanation: string }[];
  giftExport: string;
  promptText: string;
  rawResponse: string;
  generatedAt: string;
  orderSequence?: string[];
  escapeCode?: string;
}

export type ActiveOutputTab = 'game' | 'worksheet' | 'rubric' | 'prompt';


