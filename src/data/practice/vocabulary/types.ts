export type VocabularyMcqQuestion = {
  id: string;
  type: "mcq";
  prompt: string;
  choices: string[];
  correct: number;
  explanation: string;
};
export type VocabularyUsageQuestion = {
  id: string;
  type: "usage";
  prompt: string;
  choices: string[];
  correct: number;
  explanation: string;
};

export type VocabularyFillQuestion = {
  id: string;
  type: "fill";
  prompt: string;
  clue?: string;
  answer: string;
  explanation: string;
};

export type VocabularyPracticeQuestion =
  | VocabularyMcqQuestion
  | VocabularyFillQuestion
  | VocabularyUsageQuestion;