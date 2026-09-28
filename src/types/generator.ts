import { GradeLevel, AfbDistribution } from './curriculum';
import { AiProvider } from './ai';

export type TaskFormatId = 
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
}

export interface ParsedGenerationOutput {
  gameHtml: string;
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

