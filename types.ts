export enum ViewState {
  HOME = 'HOME',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  ROLEPLAY = 'ROLEPLAY',
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
  isCorrect?: boolean; // For feedback on user imperative usage
  correction?: string; // If user made a mistake
}

export enum QuizDifficulty {
  BEGINNER = 'Principiante',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzato'
}