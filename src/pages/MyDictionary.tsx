import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import VocabularyWordCard from "../components/VocabularyWordCard";

type SavedWord = {
  id: string;
  word_id: string;
  word: string;
  translation: string;
  example: string;
  topic_id: string;
  level: string;
  image?: string | null;
  association?: string | null;
};

export default function MyDictionary() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [words, setWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedWords = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_words")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error.message);
        return;
      }

      setWords(data || []);
      setLoading(false);
    };

    fetchSavedWords();
  }, [user]);

  if (!user) {
    return (
      <PageContainer>
        <p>Please log in to view your dictionary.</p>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <p>Loading your words...</p>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">My Dictionary</h1>
          <p className="text-gray-600 mt-2">
            Your saved vocabulary words
          </p>
        </header>

        {words.length === 0 ? (
          <p className="text-gray-600">
            You haven’t saved any words yet.
          </p>
        ) : (
          <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {words.map((word) => (
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
                    setWords((prev) => prev.filter((savedWord) => savedWord.word_id !== word.word_id));
                  }
}}
              />
            ))}
          </section>
        )}

        <Button
          className="mt-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
          onClick={() => navigate("/vocabulary")}
        >
          ← Back to Vocabulary
        </Button>
      </PageContainer>
    </div>
  );
}