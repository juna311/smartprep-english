export type VocabularyMcqQuestion = {
  id: string;
  type: "mcq";
  prompt: string;
  choices: string[];
  correct: number;
  explanation: string;
};

export type VocabularyFillQuestion = {
  id: string;
  type: "fill";
  prompt: string;
  answer: string;
  explanation: string;
};

export type VocabularyPracticeQuestion =
  | VocabularyMcqQuestion
  | VocabularyFillQuestion;
