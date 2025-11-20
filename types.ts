
export enum ViewState {
  HOME = 'HOME',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  ROLEPLAY = 'ROLEPLAY',
}

export enum TopicId {
  COD = 'COD',
  IMPERATIF = 'IMPERATIF',
}

export interface ModuleData {
  id: TopicId;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  unlocked: boolean;
  progress: number;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  examples: { french: string; italian: string; note?: string }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isCorrect?: boolean;
  correction?: string;
}

export enum QuizDifficulty {
  BEGINNER = 'Principiante',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzato'
}
