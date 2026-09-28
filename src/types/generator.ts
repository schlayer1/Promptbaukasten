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

export type StationSpecialType = 'timeline' | 'detective' | 'experiment' | 'auto';

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


