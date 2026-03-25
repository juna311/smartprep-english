import foodBeginner from "./food-beginner";
import type { VocabularyPracticeQuestion } from "./types";

export type { VocabularyPracticeQuestion } from "./types";

export const PRACTICE_VOCABULARY: Record<string, VocabularyPracticeQuestion[]> =
  {
    "food-beginner": foodBeginner,
  };