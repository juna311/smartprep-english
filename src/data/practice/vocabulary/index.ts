import foodBeginner from "./food-beginner";
import foodIntermediate from "./food-intermediate";
import type { VocabularyPracticeQuestion } from "./types";

export type { VocabularyPracticeQuestion } from "./types";

export const PRACTICE_VOCABULARY: Record<string, VocabularyPracticeQuestion[]> =
  {
    "food-beginner": foodBeginner,
    "food-intermediate": foodIntermediate,
  };