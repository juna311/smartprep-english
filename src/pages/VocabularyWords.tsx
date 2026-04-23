import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import VocabularyWordCard from "../components/VocabularyWordCard";
import { VOCABULARY_TOPICS } from "../data/vocabulary";

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

  const topic = VOCABULARY_TOPICS.find((t) => t.id === topicId);

  const { user } = useAuth();

  if (!topic || !level) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <p className="text-red-600 font-semibold">Vocabulary section not found.</p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate("/vocabulary")}
          >
            ← Back to Vocabulary
          </Button>
        </PageContainer>
      </div>
    );
  }

  const words = topic.levels[level as keyof typeof topic.levels] as VocabularyWord[];

  if (!words) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <p className="text-red-600 font-semibold">Level not found.</p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate(`/vocabulary/${topic.id}`)}
          >
            ← Back to {topic.title}
          </Button>
        </PageContainer>
      </div>
    );
  }

  useEffect(() => {
    const fetchSavedWords = async () => {
      if (!user) {
        setSavedWordIds([]);
        return;
      }
  
      const { data, error } = await supabase
        .from("saved_words")
        .select("word_id")
        .eq("user_id", user.id);
  
      if (error) {
        console.error("Error fetching saved words:", error.message);
        return;
      }
  
      setSavedWordIds(data.map((row) => row.word_id));
    };
  
    fetchSavedWords();
  }, [user]);

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-6 sm:mb-8 md:mb-10">
            <Button
                className="mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm"
                onClick={() => navigate(`/vocabulary/${topic.id}`)}
            >
                ← Back to {topic.title}
            </Button>

            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-blue)]">
                Vocabulary
            </p>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
                {topic.title} • {LEVEL_LABELS[level] ?? level}
            </h1>
            
            <p className="text-gray-700 max-w-2xl text-sm md:text-base">
            Learn and review useful vocabulary for this topic and level.
            </p>
            <p className="text-gray-700 max-w-2xl text-sm md:text-base">{words.length} words in this level.</p>
        </header>

        <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <VocabularyWordCard
              key={word.id}
              id={word.id}
              word={word.word}
              translation={word.translation}
              example={word.example}
              topicId={topic.id}
              level={level ?? ""}
              image={word.image}
              association={word.association}
              isSaved={savedWordIds.includes(word.id)}
              onToggleSaved={(nextSaved) => {
                if (nextSaved) {
                  setSavedWordIds((prev) =>
                    prev.includes(word.id) ? prev : [...prev, word.id]
                  );
                } else {
                  setSavedWordIds((prev) => prev.filter((savedId) => savedId !== word.id));
                }
              }}
            />
          ))}
        </section>
        
        <Button
          className="mt-6 bg-[var(--color-brand-pink)] text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
          onClick={() => navigate(`/practice/vocabulary/${topic.id}/${level}`)}
        >
            Practice {topic.title}
        </Button>
      </PageContainer>
    </div>
  );
}