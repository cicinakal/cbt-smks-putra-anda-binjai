export type QuestionType = 'MULTIPLE_CHOICE' | 'ESSAY' | 'TRUE_FALSE' | 'MATCHING';
export type ExamStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  options?: Option[];
  correctAnswer?: string;
  matchingPairs?: MatchingPair[];
}

export interface Option {
  id: string;
  label: string;
  text: string;
}

export interface MatchingPair {
  id: string;
  leftItem: string;
  rightItem: string;
}

export interface StudentAnswer {
  questionId: string;
  answerText?: string;
  selectedOption?: string;
  matchingAnswers?: { leftItem: string; selectedRight: string }[];
}

export interface ExamResult {
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  grade: string;
  passed: boolean;
}
