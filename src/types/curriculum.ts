export type GradeLevel = 5 | 6 | 7 | 8 | 9 | 10;

export type DoubleGrade = '5/6' | '7/8' | '9/10';

export type SubjectCategory = 
  | 'Kernfächer'
  | 'Naturwissenschaftlich-technisch'
  | 'Gesellschaftswissenschaftlich'
  | 'Ästhetisch & Sport'
  | 'Werte & Orientierung'
  | 'Wahlpflichtbereich';

export interface CurriculumTopic {
  id: string;
  doubleGrade: DoubleGrade;
  title: string;
  coreCompetencies: string[];
  suggestedTasks?: string[];
}

export interface SchoolSubject {
  id: string;
  name: string;
  shortName: string;
  category: SubjectCategory;
  allowedGrades: GradeLevel[];
  icon: string;
  topics: CurriculumTopic[];
}

export type AfbLevel = 'I' | 'II' | 'III';

export interface Operator {
  id: string;
  name: string;
  afb: AfbLevel;
  description: string;
  signalWords: string[];
  example: string;
}

export interface AfbDistribution {
  afb1: number; // Percentage, e.g. 40
  afb2: number; // Percentage, e.g. 40
  afb3: number; // Percentage, e.g. 20
}
