import { cleftAQuestions } from "./cleft-a";

export const PRACTICE_GRAMMAR = {
  "cleft-a": cleftAQuestions,
} as const;

export function hasGrammarPractice(
  topicId: string,
): topicId is keyof typeof PRACTICE_GRAMMAR {
  return Object.prototype.hasOwnProperty.call(PRACTICE_GRAMMAR, topicId);
}

export function getGrammarPracticeQuestions(topicId?: string) {
  if (!topicId || !hasGrammarPractice(topicId)) return undefined;

  return PRACTICE_GRAMMAR[topicId];
}
