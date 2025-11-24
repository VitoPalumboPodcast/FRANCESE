
export enum ViewState {
  HOME = 'HOME',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  ROLEPLAY = 'ROLEPLAY',
}

export enum TopicId {
  PRONUNCIATION = 'PRONUNCIATION',
  GREETINGS = 'GREETINGS',
  ARTICLES = 'ARTICLES',
  NUMBERS = 'NUMBERS',
  COD = 'COD',
  IMPERATIF = 'IMPERATIF',
  VERBI_ER = 'VERBI_ER',
  VERBI_IR = 'VERBI_IR',
  VERBI_TOP = 'VERBI_TOP',
  VERBI_3_GROUP = 'VERBI_3_GROUP',
  NEGATION = 'NEGATION',
  GENDER_NUMBER = 'GENDER_NUMBER',
  FAMILY = 'FAMILY',
  DESCRIPTION = 'DESCRIPTION',
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
  type: 'multiple-choice' | 'cloze'; // New field for question type
  question: string; // For cloze, this will contain the sentence with "_______"
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
  // Fields for grammar correction
  hasError?: boolean;
  correction?: {
    sentence: string;
    explanation: string;
  };
}

export enum UserLevel {
  A1 = 'A1 (Principiante)',
  A2 = 'A2 (Elementare)',
  B1 = 'B1 (Intermedio)',
  B2 = 'B2 (Intermedio Alto)',
  C1 = 'C1 (Avanzato)',
  C2 = 'C2 (Madrelingua)'
}

export interface SessionConfig {
    level: UserLevel;
    timeMinutes: number;
}