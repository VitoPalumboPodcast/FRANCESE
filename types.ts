
export enum ViewState {
  HOME = 'HOME',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  ROLEPLAY = 'ROLEPLAY',
}

export enum TopicId {
  COD = 'COD',
  IMPERATIF = 'IMPERATIF',
  VERBI_IR = 'VERBI_IR',
  LYON = 'LYON',
  ORIENTATION = 'ORIENTATION',
}

export interface ModuleData {
  id: TopicId;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  unlocked: boolean;
  progress: number;
}

export interface ConjugationTable {
  title: string;
  rows: { pronoun: string; verb: string }[];
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  videoUrl?: string; // New optional field for videos
  transcript?: string; // Full text transcript of the video
  examples: { french: string; italian: string; note?: string }[];
  conjugationTables?: ConjugationTable[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  exampleSentence: {
    french: string;
    italian: string;
  };
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