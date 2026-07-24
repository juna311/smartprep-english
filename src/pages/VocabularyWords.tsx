import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import Button from "../components/Button";
import VocabularyWordCard from "../components/VocabularyWordCard";
import { VOCABULARY_TOPICS } from "../data/vocabulary";
import { getSavedWordIds } from "../services/savedWords";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

type VocabularyWord = {
  id: string;
  word: string;
  translation: string;
  example: string;
  image?: string;
  association?: string;
};

export default function VocabularyWords() {
  const { topicId, level } = useParams();
  const navigate = useNavigate();
  const [savedWordIds, setSavedWordIds] = useState<string[]>([]);
  const [savedWordsError, setSavedWordsError] = useState<string | null>(null);

  const topic = VOCABULARY_TOPICS.find((t) => t.id === topicId);

  const { user } = useAuth();
  const words =
    topic && level
      ? (topic.levels[level as keyof typeof topic.levels] as
          VocabularyWord[] | undefined)
      : undefined;

  useEffect(() => {
    let ignore = false;

    const fetchSavedWords = async () => {
      if (!user || !topic || !level) {
        setSavedWordIds([]);
        setSavedWordsError(null);
        return;
      }

      setSavedWordsError(null);

      try {
        const wordIds = await getSavedWordIds(user.id);

        if (!ignore) {
          setSavedWordIds(wordIds);
        }
      } catch (error) {
        console.error("Error fetching saved words:", error);

        if (!ignore) {
          setSavedWordsError(
            "Your saved-word status could not be loaded. You can still study these words.",
          );
        }
      }
    };

    void fetchSavedWords();

    return () => {
      ignore = true;
    };
  }, [user, topic, level]);

  if (!topic || !level) {
    return (
      <PageShell>
        <p className="text-red-600 font-semibold">
          Vocabulary section not found.
        </p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate("/vocabulary")}
        >
          ← Back to Vocabulary
        </Button>
      </PageShell>
    );
  }

  if (!words) {
    return (
      <PageShell>
        <p className="text-red-600 font-semibold">Level not found.</p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate(`/vocabulary/${topic.id}`)}
        >
          ← Back to {topic.title}
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Button
        variant="soft"
        size="md"
        className="mb-4 text-sm"
        onClick={() => navigate(`/vocabulary/${topic.id}`)}
      >
        ← Back to {topic.title}
      </Button>

      <PageHeader
        eyebrow="Vocabulary"
        title={`${topic.title} • ${LEVEL_LABELS[level] ?? level}`}
        description={
          <>
            Learn and review useful vocabulary for this topic and level.{" "}
            {words.length} words are included.
          </>
        }
        className="mb-6 sm:mb-8 md:mb-10"
      />

      {savedWordsError && (
        <p role="alert" className="mb-6 text-red-700">
          {savedWordsError}
        </p>
      )}

      <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {words.map((word) => (
          <VocabularyWordCard
            key={word.id}
            id={word.id}
            word={word.word}
            translation={word.translation}
            example={word.example}
            topicId={topic.id}
            level={level}
            image={word.image}
            association={word.association}
            isSaved={savedWordIds.includes(word.id)}
            onToggleSaved={(nextSaved) => {
              if (nextSaved) {
                setSavedWordIds((prev) =>
                  prev.includes(word.id) ? prev : [...prev, word.id],
                );
              } else {
                setSavedWordIds((prev) =>
                  prev.filter((savedId) => savedId !== word.id),
                );
              }
            }}
          />
        ))}
      </section>

      <Button
        variant="gold"
        size="md"
        className="mt-6 text-sm"
        onClick={() => navigate(`/practice/vocabulary/${topic.id}/${level}`)}
      >
        Practice {topic.title}
      </Button>
    </PageShell>
  );
}
