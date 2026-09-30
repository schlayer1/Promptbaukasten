import { TaskFormatId } from './generator';

export interface CloudMaterial {
  id: string;
  title: string;
  format: TaskFormatId;
  subjectId: string;
  subjectName: string;
  gradeLevel: number | string;
  doubleGrade: string;
  topicTitle: string;
  customTopicDetail?: string;
  worksheetMarkdown: string;
  rubricMarkdown: string;
  vocabulary: { term: string; explanation: string }[];
  gameHtml: string;
  giftExport: string;
  promptText: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  updatedAt?: number;
  sharedWithSchool: boolean;
}
