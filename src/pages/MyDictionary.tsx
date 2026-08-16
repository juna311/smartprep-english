import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import Button from "../components/Button";
import DictionaryFilters from "../components/DictionaryFilters";
import { useAuth } from "../context/useAuth";
import VocabularyWordCard from "../components/VocabularyWordCard";
import PageStatus from "../components/PageStatus";
import { getSavedWords } from "../services/savedWords";
import type { SavedWord } from "../types/database.types";

export default function MyDictionary() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [words, setWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const topics = Array.from(new Set(words.map((w) => w.topic_id)));
  const levels = ["beginner", "intermediate", "advanced"];

  useEffect(() => {
    let ignore = false;

    const fetchSavedWords = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(null);

      try {
        const savedWords = await getSavedWords(user.id);

        if (!ignore) {
          setWords(savedWords);
        }
      } catch (error) {
        console.error("Failed to load saved words:", error);

        if (!ignore) {
          setLoadError("We could not load your saved words. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchSavedWords();

    return () => {
      ignore = true;
    };
  }, [user, loadAttempt]);

  const filteredWords = words.filter((word) => {
    const matchesTopic = topicFilter === "all" || word.topic_id === topicFilter;

    const matchesLevel = levelFilter === "all" || word.level === levelFilter;

    return matchesTopic && matchesLevel;
  });

  return (
    <PageShell>
      <PageHeader
        eyebrow="My Dictionary"
        title="Saved vocabulary"
        description="Review and practise the vocabulary words you have saved."
        className="mb-6"
      />

      {!user ? (
        <PageStatus
          kind="empty"
          title="Sign in to use My Dictionary"
          message="Your saved vocabulary is connected to your account."
          actions={[
            {
              label: "Go to Login",
              onClick: () => navigate("/login"),
              variant: "primary",
            },
          ]}
        />
      ) : loading ? (
        <PageStatus
          kind="loading"
          title="Loading your saved vocabulary"
          message="Your words will appear here shortly."
        />
      ) : loadError ? (
        <PageStatus
          kind="error"
          title="Your dictionary could not be loaded"
          message={loadError}
          actions={[
            {
              label: "Try again",
              onClick: () => setLoadAttempt((previous) => previous + 1),
              variant: "primary",
            },
          ]}
        />
      ) : (
        <>
          {words.length > 0 && (
            <DictionaryFilters
              topicFilter={topicFilter}
              setTopicFilter={setTopicFilter}
              levelFilter={levelFilter}
              setLevelFilter={setLevelFilter}
              topics={topics}
              levels={levels}
            />
          )}

          {words.length === 0 ? (
            <PageStatus
              kind="empty"
              title="No saved words yet"
              message="Browse the vocabulary lessons and select the star beside any word you want to review later."
              actions={[
                {
                  label: "Browse Vocabulary",
                  onClick: () => navigate("/vocabulary"),
                  variant: "gold",
                },
              ]}
            />
          ) : filteredWords.length === 0 ? (
            <PageStatus
              kind="empty"
              title="No words match these filters"
              message="Choose different filters or show all of your saved words."
              actions={[
                {
                  label: "Clear filters",
                  onClick: () => {
                    setTopicFilter("all");
                    setLevelFilter("all");
                  },
                  variant: "primary",
                },
              ]}
            />
          ) : (
            <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWords.map((word) => (
                <VocabularyWordCard
                  key={word.id}
                  id={word.word_id}
                  word={word.word}
                  translation={word.translation}
                  example={word.example}
                  topicId={word.topic_id}
                  level={word.level}
                  image={word.image ?? undefined}
                  association={word.association ?? undefined}
                  isSaved={true}
                  onToggleSaved={(nextSaved) => {
                    if (!nextSaved) {
                      setWords((prev) =>
                        prev.filter(
                          (savedWord) => savedWord.word_id !== word.word_id,
                        ),
                      );
                    }
                  }}
                />
              ))}
            </section>
          )}

          {words.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate("/vocabulary")}
              >
                ← Back to Vocabulary
              </Button>

              <Button
                variant="gold"
                size="md"
                onClick={() => navigate("/my-dictionary/review")}
              >
                Review all saved words
              </Button>

              <Button
                variant="primary"
                size="md"
                disabled={filteredWords.length === 0}
                onClick={() => {
                  const params = new URLSearchParams();

                  if (topicFilter !== "all") {
                    params.set("topic", topicFilter);
                  }

                  if (levelFilter !== "all") {
                    params.set("level", levelFilter);
                  }

                  navigate(`/my-dictionary/review?${params.toString()}`);
                }}
              >
                Review filtered words
              </Button>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
