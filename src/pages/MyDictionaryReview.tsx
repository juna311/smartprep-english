import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import { VOCABULARY_TOPICS } from "../data/vocabulary";

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


type VocabularyChoiceWord = {
  id: string;
  word: string;
};

export default function MyDictionaryReview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const topicParam = searchParams.get("topic");
  const levelParam = searchParams.get("level");

  const formatLabel = (text: string) =>
    text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const reviewLabel =
    topicParam && levelParam
      ? `${formatLabel(topicParam)} • ${formatLabel(levelParam)}`
      : topicParam
      ? formatLabel(topicParam)
      : levelParam
      ? formatLabel(levelParam)
      : "All saved words";

  const [allWords, setAllWords] = useState<SavedWord[]>([]);
  const [sessionWords, setSessionWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>([]);
  const [practiceType, setPracticeType] = useState<"typing" | "mcq">("mcq");
  const [selected, setSelected] = useState<string | null>(null);

  const allVocabularyChoices = useMemo<VocabularyChoiceWord[]>(() => {
    const flattened = VOCABULARY_TOPICS.flatMap((topic) =>
      Object.values(topic.levels).flatMap((levelWords) =>
        levelWords.map((word) => ({
          id: word.id,
          word: word.word,
        }))
      )
    );

    const uniqueById = new Map(flattened.map((word) => [word.id, word]));
    return Array.from(uniqueById.values());
  }, []);

  useEffect(() => {
    const fetchSavedWords = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("saved_words")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch saved words:", error.message);
        setLoading(false);
        return;
      }

      let words = data || [];

      if (topicParam) {
        words = words.filter((word) => word.topic_id === topicParam);
      }

      if (levelParam) {
        words = words.filter((word) => word.level === levelParam);
      }

      setAllWords(words);

      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setSessionWords(shuffled);

      setLoading(false);
    };

    fetchSavedWords();
  }, [user, topicParam, levelParam]);

  const total = sessionWords.length;
  const isFinished = showResults || index >= total;
  const current = sessionWords[index];

  const normalize = (text: string) =>
    text.trim().toLowerCase().replace(/[.?!,]/g, "");

  const generateChoices = (current: SavedWord) => {
    const shuffledOthers = [...allVocabularyChoices]
      .filter((w) => w.id !== current.word_id)
      .sort(() => Math.random() - 0.5);

    const uniqueChoices = [current.word];

    for (const candidate of shuffledOthers) {
      if (!uniqueChoices.includes(candidate.word)) {
        uniqueChoices.push(candidate.word);
      }

      if (uniqueChoices.length === 4) break;
    }

    return uniqueChoices.sort(() => Math.random() - 0.5);
  };

  const isCorrect = current
    ? practiceType === "mcq"
      ? selected === current.word
      : normalize(input) === normalize(current.word)
    : false;

  const canCheck = practiceType === "mcq"
    ? selected !== null
    : input.trim().length > 0;

  const progressPercent =
    total > 0 ? Math.min(100, Math.round(((index + 1) / total) * 100)) : 0;

  const reviewWords = useMemo(() => {
    return allWords.filter((word) => needsReviewIds.includes(word.word_id));
  }, [allWords, needsReviewIds]);

  const handleCheckAnswer = () => {
    if (!current || checked || !canCheck) return;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setNeedsReviewIds((prev) =>
        prev.includes(current.word_id) ? prev : [...prev, current.word_id]
      );
    }

    setChecked(true);
  };

  const handleNext = () => {
    const isLast = index === total - 1;

    if (isLast) {
      setShowResults(true);
      return;
    }

    setIndex((prev) => prev + 1);
    setInput("");
    setSelected(null);
    setChecked(false);
  };

  const handleRetryDifficultWords = () => {
    if (reviewWords.length === 0) return;

    const shuffled = [...reviewWords].sort(() => Math.random() - 0.5);
    setSessionWords(shuffled);
    setIndex(0);
    setInput("");
    setSelected(null);
    setChecked(false);
    setScore(0);
    setShowResults(false);
    setNeedsReviewIds([]);
  };

  const handleTryAgainAll = () => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setSessionWords(shuffled);
    setIndex(0);
    setInput("");
    setSelected(null);
    setChecked(false);
    setScore(0);
    setShowResults(false);
    setNeedsReviewIds([]);
  };

  const choices = useMemo(() => {
    if (!current || practiceType !== "mcq") return [];
    return generateChoices(current);
  }, [current?.word_id, practiceType, allVocabularyChoices]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <p className="text-red-600 font-semibold">
            Please log in to review your saved words.
          </p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </PageContainer>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <p className="text-gray-700">Loading your review session...</p>
        </PageContainer>
      </div>
    );
  }

  if (allWords.length === 0) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <h1 className="text-3xl font-bold mb-2">Review saved words</h1>
          <p className="text-gray-700">
            You have no saved words yet. Save words first to start reviewing.
          </p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate("/my-dictionary")}
          >
            ← Back to My Dictionary
          </Button>
        </PageContainer>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh] flex items-center justify-center">
          
          <div className="w-full max-w-xl">
            <header className="mb-8 text-center">
              <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
                My Dictionary Review
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                {reviewLabel} • Complete 🎉
              </h1>
            </header>

            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-lg">
                Score: <strong>{score}</strong> / {total}
              </p>

              <p className="text-gray-700 mt-2">
                Needs review: <strong>{needsReviewIds.length}</strong>
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-md hover:opacity-90"
                  onClick={handleTryAgainAll}
                >
                  Review all again
                </Button>

                <Button
                  className="bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
                  onClick={handleRetryDifficultWords}
                  disabled={reviewWords.length === 0}
                >
                  Review difficult words
                </Button>

                <Button
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => navigate("/my-dictionary")}
                >
                  ← Back to My Dictionary
                </Button>
              </div>
            </div>
          </div>

        </PageContainer>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">No review words found</h1>
            <p className="text-gray-700">
              There are no words available for this review.
            </p>
  
            <Button
              className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
              onClick={() => navigate("/my-dictionary")}
            >
              ← Back to My Dictionary
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
            My Dictionary Review
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            {practiceType === "mcq" ? "Japanese → English (Multiple Choice)" : "Japanese → English (Typing)"}
          </h1>

          <p className="text-gray-700 mt-2">
            {reviewLabel} · Question <strong>{index + 1}</strong> of <strong>{total}</strong>
            <span className="ml-3 text-sm text-gray-600">
              Score: <strong>{score}</strong>
            </span>
          </p>

          <div className="mt-4 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-brand-blue)] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm uppercase tracking-wide font-semibold text-[var(--color-brand-blue)] mb-2">
            Translation
          </p>
          <p className="font-semibold text-2xl mb-4">{current.translation}</p>

          {current.association && (
            <p className="text-sm text-gray-500 mb-4">
              💡 {current.association}
            </p>
          )}

          <div className="flex gap-2 mb-4">
            <Button
              disabled={checked}
              onClick={() => {
                setPracticeType("mcq");
                setSelected(null);
                setInput("");
                setChecked(false);
              }}
              className={`px-3 py-1 rounded-md ${
                practiceType === "mcq"
                  ? "bg-[var(--color-brand-blue)] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Multiple Choice
            </Button>

            <Button
              disabled={checked}
              onClick={() => {
                setPracticeType("typing");
                setSelected(null);
                setInput("");
                setChecked(false);
              }}
              className={`px-3 py-1 rounded-md ${
                practiceType === "typing"
                  ? "bg-[var(--color-brand-blue)] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Typing
            </Button>
          </div>

          {practiceType === "mcq" ? (
            <div className="flex flex-col gap-3">
              {choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setSelected(choice)}
                  disabled={checked}
                  className={`border rounded-md px-4 py-2 text-left transition ${
                    checked
                      ? choice === current.word
                        ? "border-green-600 bg-green-50 text-green-700"
                        : selected === choice
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-gray-300 bg-white text-gray-700"
                      : selected === choice
                      ? "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/10"
                      : "border-gray-300 hover:bg-gray-50"
                  } ${checked ? "disabled:cursor-not-allowed disabled:opacity-100" : ""}`}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !checked) {
                  handleCheckAnswer();
                }
              }}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Type the English word..."
              disabled={checked}
            />
          )}

          <div className="mt-4 min-h-[72px] border-t border-gray-100 pt-3">
            {checked ? (
              <div className="space-y-1">
                <p
                  className={`font-medium ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? (
                    "Correct ✅"
                  ) : (
                    <>
                      Not quite ❌ <span className="text-gray-700">Correct: <strong>{current.word}</strong></span>
                    </>
                  )}
                </p>

                <p className="text-sm text-gray-600 italic leading-snug">{current.example}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Check your answer to see feedback.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {!checked ? (
              <Button
                className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
                onClick={handleCheckAnswer}
                disabled={!canCheck}
              >
                Check answer
              </Button>
            ) : (
              <Button
                className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-md hover:opacity-90"
                onClick={handleNext}
              >
                Next
              </Button>
            )}

            <Button
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
              onClick={() => navigate("/my-dictionary")}
            >
              ← Back to My Dictionary
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}