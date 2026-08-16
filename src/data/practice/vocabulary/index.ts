import foodBeginner from "./food-beginner";
import foodIntermediate from "./food-intermediate";
import type { VocabularyPracticeQuestion } from "./types";

export type { VocabularyPracticeQuestion } from "./types";

export const PRACTICE_VOCABULARY = {
  "food-beginner": foodBeginner,
  "food-intermediate": foodIntermediate,
} satisfies Record<string, VocabularyPracticeQuestion[]>;

type VocabularyPracticeKey = keyof typeof PRACTICE_VOCABULARY;

function isVocabularyPracticeKey(key: string): key is VocabularyPracticeKey {
  return Object.prototype.hasOwnProperty.call(PRACTICE_VOCABULARY, key);
}

export function getVocabularyPracticeQuestions(
  topicId?: string,
  level?: string,
) {
  if (!topicId || !level) return undefined;

  const key = `${topicId}-${level}`;
  return isVocabularyPracticeKey(key) ? PRACTICE_VOCABULARY[key] : undefined;
}

export function hasVocabularyPracticeTopic(topicId: string) {
  return Object.keys(PRACTICE_VOCABULARY).some((key) =>
    key.startsWith(`${topicId}-`),
  );
}
