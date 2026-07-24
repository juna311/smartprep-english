import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import Button from "../components/Button";
import DictionaryFilters from "../components/DictionaryFilters";
import { useAuth } from "../context/useAuth";
import VocabularyWordCard from "../components/VocabularyWordCard";
import { getSavedWords } from "../services/savedWords";
import type { SavedWord } from "../types/database.types";

export default function MyDictionary() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [words, setWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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
  }, [user]);

  if (!user) {
    return (
      <PageShell>
        <p>Please log in to view your dictionary.</p>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <p>Loading your words...</p>
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell>
        <p role="alert" className="text-red-700">
          {loadError}
        </p>
      </PageShell>
    );
  }

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

      <DictionaryFilters
        topicFilter={topicFilter}
        setTopicFilter={setTopicFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        topics={topics}
        levels={levels}
      />

      {filteredWords.length === 0 ? (
        <p className="text-gray-600">You haven’t saved any words yet.</p>
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
    </PageShell>
  );
}
