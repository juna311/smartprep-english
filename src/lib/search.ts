import { GRAMMAR_LEVELS } from "../data/grammarData";
import { VOCABULARY_TOPICS } from "../data/vocabulary";

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  category: "Grammar" | "Vocabulary";
  to: string;
};

const vocabularyResults: SearchResult[] = VOCABULARY_TOPICS.flatMap((topic) =>
  Object.entries(topic.levels).flatMap(([level, words]) =>
    words.map((word) => ({
      id: word.id,
      title: word.word,
      description: `${word.translation} · ${topic.title} · ${level}`,
      category: "Vocabulary" as const,
      to: `/vocabulary/${topic.id}/${level}`,
    }))
  )
);

const grammarResults: SearchResult[] = GRAMMAR_LEVELS.flatMap((level) =>
  level.topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    description: `${level.title} · ${topic.summary}`,
    category: "Grammar" as const,
    to: `/grammar/${level.id}/${topic.id}`,
  }))
);

export const SEARCH_RESULTS = [...grammarResults, ...vocabularyResults];

export function searchContent(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return SEARCH_RESULTS.filter((result) =>
    [result.title, result.description, result.category]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  );
}
