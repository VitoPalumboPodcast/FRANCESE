export const ViewState = Object.freeze({
  HOME: 'HOME',
  LEARN: 'LEARN',
  QUIZ: 'QUIZ',
  ROLEPLAY: 'ROLEPLAY',
});

export const TopicId = Object.freeze({
  PRONUNCIATION: 'PRONUNCIATION',
  GREETINGS: 'GREETINGS',
  ARTICLES: 'ARTICLES',
  NUMBERS: 'NUMBERS',
  COD: 'COD',
  IMPERATIF: 'IMPERATIF',
  VERBI_ER: 'VERBI_ER',
  VERBI_IR: 'VERBI_IR',
  VERBI_TOP: 'VERBI_TOP',
  VERBI_3_GROUP: 'VERBI_3_GROUP',
  NEGATION: 'NEGATION',
  GENDER_NUMBER: 'GENDER_NUMBER',
  FAMILY: 'FAMILY',
  DESCRIPTION: 'DESCRIPTION',
  LYON: 'LYON',
  ORIENTATION: 'ORIENTATION',
});

export const UserLevel = Object.freeze({
  A1: 'A1 (Principiante)',
  A2: 'A2 (Elementare)',
  B1: 'B1 (Intermedio)',
  B2: 'B2 (Intermedio Alto)',
  C1: 'C1 (Avanzato)',
  C2: 'C2 (Madrelingua)',
});

export const SessionDurations = [15, 30, 45, 60];

export const createModuleData = (
  id,
  title,
  description,
  icon,
  unlocked = true,
  progress = 0,
) => ({ id, title, description, icon, unlocked, progress });
