import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import { PRACTICE_VOCABULARY } from "../data/practice/vocabulary";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function VocabularyPracticeSession() {
  const { topicId, level } = useParams();
  const navigate = useNavigate();

  const formatTopic = (text: string = "") =>
    text
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  if (!topicId || !level) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <p className="text-red-600 font-semibold">
            Practice session not found.
          </p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate("/practice/vocabulary")}
          >
            ← Back to Vocabulary Practice
          </Button>
        </PageContainer>
      </div>
    );
  }

  const practiceKey = `${topicId}-${level}`;
  const allQuestions =
    PRACTICE_VOCABULARY[
      practiceKey as keyof typeof PRACTICE_VOCABULARY
    ];

  const questions = useMemo(() => {
    if (!allQuestions) return [];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [allQuestions]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  if (!allQuestions) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <p className="text-red-600 font-semibold">
            No practice questions found for this topic and level.
          </p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate(`/practice/vocabulary/${topicId}`)}
          >
            ← Back to {formatTopic(topicId)}
          </Button>
        </PageContainer>
      </div>
    );
  }

  const total = questions.length;
  const isFinished = showResults || index >= total;
  const current = questions[index];

  const isCorrect =
  current.type === "mcq" || current.type === "usage"
    ? selected === current.choices[current.correct]
    : input.trim().toLowerCase() === current.answer.trim().toLowerCase();

  const checkAnswer = () => {
    if (!current || checked) return;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setChecked(true);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-xl">
            <header className="mb-8 text-center">
              <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
                Vocabulary Practice
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                Results: {formatTopic(topicId)} • {LEVEL_LABELS[level] ?? level} 🎉
              </h1>
            </header>

            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-lg">
                Score: <strong>{score}</strong> / {total}
              </p>

              <p className="text-gray-700 mt-2">
                {score === total
                  ? "Perfect score! 🎉"
                  : score >= Math.ceil(total * 0.67)
                  ? "Nice job! 👍"
                  : "Keep practicing — you’ll improve quickly 💪"}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-md hover:opacity-90"
                  onClick={() => {
                    setScore(0);
                    setIndex(0);
                    setSelected(null);
                    setInput("");
                    setChecked(false);
                    setShowResults(false);
                  }}
                >
                  Try again
                </Button>

                <Button
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => window.location.reload()}
                >
                  Try a new set
                </Button>

                <Button
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => navigate(`/practice/vocabulary/${topicId}`)}
                >
                  Back to levels
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!current) return null;

  const canCheck =
    current.type === "mcq" || current.type === "usage"
      ? selected !== null
      : input.trim().length > 0;

  const goNext = () => {
    const isLast = index === total - 1;

    if (isLast) {
      setShowResults(true);
      return;
    }

    setIndex((prev) => prev + 1);
    setSelected(null);
    setInput("");
    setChecked(false);
  };

  const progressPercent = Math.min(
    100,
    Math.round(((index + 1) / total) * 100)
  );

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
            Vocabulary Practice
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            {formatTopic(topicId)} • {LEVEL_LABELS[level] ?? level}
          </h1>

          <p className="text-gray-700 mt-2">
            Question <strong>{index + 1}</strong> of <strong>{total}</strong>
            <span className="ml-3 text-sm text-gray-600">
              Score: <strong>{score}</strong>
            </span>
          </p>

          <div className="mt-4 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-brand-pink)] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        <div className="bg-white rounded-xl shadow p-6">
        <p className="font-semibold text-lg mb-2">{current.prompt}</p>

            {current.type === "fill" && current.clue && (
            <p className="text-sm text-gray-500 mb-4">
                Hint: {current.clue}
            </p>
            )}

            {(current.type === "mcq" || current.type === "usage") && (
            <div className="flex flex-col gap-3">
                {current.choices.map((opt: string) => (
                    <button
                    key={opt}
                    type="button"
                    onClick={() => setSelected(opt)}
                    className={`border rounded-md px-4 py-2 text-left transition ${
                        selected === opt
                        ? "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/10"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    >
                    {opt}
                    </button>
                ))}
            </div>
            )}

            {current.type === "fill" && (
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    checkAnswer();
                    }
                }}
                className="border rounded-md px-3 py-2 w-full"
                placeholder="Type your answer..."
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
                        Not quite ❌{" "}
                        <span className="text-gray-700">
                          Correct: <strong>{current.type === "mcq" || current.type === "usage" ? current.choices[current.correct] : current.answer}</strong>
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 leading-snug">{current.explanation}</p>
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
                    onClick={checkAnswer}
                    disabled={!canCheck}
                >
                    Check answer
                </Button>
                ) : (
                <Button
                    className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-md hover:opacity-90"
                    onClick={goNext}
                >
                    Next
                </Button>
                )}

                <Button
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => navigate("/practice/vocabulary")}
                >
                ← Back to Vocabulary Practice
                </Button>
            </div>
        </div>
      </PageContainer>
    </div>
  );
}