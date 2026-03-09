import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { PRACTICE_GRAMMAR } from "../data/practice/grammar";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";

export default function PracticeGrammarTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  if (!topicId) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <p className="text-red-600 font-semibold">Topic not found.</p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate("/practice")}
          >
            ← Back to Practice
          </Button>
        </PageContainer>
      </div>
    );
  }

  const allQuestions =
    PRACTICE_GRAMMAR[topicId as keyof typeof PRACTICE_GRAMMAR];

  const questions = useMemo(() => {
    if (!allQuestions) return [];
    
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, 3);
    }, [allQuestions]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  if (!allQuestions) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <h1 className="text-3xl font-bold mb-2">Practice</h1>
          <p className="text-gray-700">
            No practice questions have been added for this topic yet.
          </p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate(`/practice/grammar`)}
          >
            ← Back to Practice Grammar
          </Button>
        </PageContainer>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <h1 className="text-3xl font-bold mb-2">Practice</h1>
          <p className="text-gray-700">
            This topic doesn't have any questions yet. 
          </p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate(`/practice/grammar`)}
          >
            ← Back to Practice Grammar
          </Button>
        </PageContainer>
      </div>
    );
  }

  const topicTitle = questions[0]?.title ?? "Grammar topic";
  const total = questions.length;
  const isFinished = showResults || index >= total;
  const current = questions[index];

  const shuffledTokens = useMemo(() => {
    if (!current || current.type !== "reorder") return [];
  
    return [...current.tokens].sort(() => Math.random() - 0.5);
  }, [current?.id]);


  if (isFinished) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <header className="mb-6">
            <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
              Grammar Practice
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              Results: {topicTitle}
            </h1>
          </header>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-lg">
              Score: <strong>{score}</strong> / {total}
            </p>
            <p className="text-gray-700 mt-2">
              {score === total
                ? "Perfect score! 🎉"
                : score >= Math.ceil(total * 0.67)
                ? "Nice job! 👍"
                : "Good start — try again to improve 💪"}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-md hover:opacity-90"
                onClick={() => {
                  setScore(0);
                  setIndex(0);
                  setChecked(false);
                  setSelected(null);
                  setInput("");
                  setShowResults(false);
                  setSelectedTokens([]);
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
                onClick={() =>
                  navigate('/practice/grammar')
                }
              >
                Back to Practice Grammar
              </Button>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }
  if (!current) return null;

  const normalize = (text: string) =>
    text.trim().toLowerCase().replace(/[.?!]/g, "");

  const isCorrect =
    current.type === "mcq"
      ? selected === current.choices[current.correct]
      : current.type === 'fill'
      ? input.trim().toLowerCase() === current.answer.toLowerCase()
      : normalize(selectedTokens.join(" ")) === normalize(current.answer);

  const canCheck =
    current.type === "mcq" 
      ? selected !== null
      : current.type === "fill"
      ? input.trim().length > 0
      : selectedTokens.length === shuffledTokens.length;

  const checkAnswer = () => {
    if (!canCheck || checked) return;
    if (isCorrect) setScore((s) => s + 1);
    setChecked(true);
  };

  const goNext = () => {
    const isLast = index === total - 1;

    if (isLast) {
      setShowResults(true);
      return;
    }

    setIndex((i) => i + 1);
    setChecked(false);
    setSelected(null);
    setInput("");
    setSelectedTokens([]);
  };

  const currentStep = index + 1;
  const progress = (currentStep / total) * 100; 

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
            Grammar Practice
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">
            Practice: {current.title}
          </h1>
          <p className="text-gray-700 mt-2">
            Question <strong>{index + 1}</strong> of <strong>{total}</strong>
            <span className="ml-3 text-sm text-gray-600">
              Score: <strong>{score}</strong>
            </span>
          </p>
          <div className="mt-3">
            <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--color-brand-pink)] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="font-semibold text-lg mb-4">{current.prompt}</p>

          {current.type === "mcq" && (
            <div className="flex flex-col gap-3">
              {current.choices.map((opt: string) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelected(opt)}
                  className={`border rounded-md px-4 py-2 text-left transition
                    ${
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
              placeholder="Type your answer…"
            />
          )}
          {current.type === "reorder" && (
            <div className="flex flex-col gap-4">

              <div className="min-h-[48px] border rounded-md p-3 bg-gray-50">
                {selectedTokens.length === 0
                  ? "Click words below to build the sentence"
                  : selectedTokens.join(" ")}
              </div>

              {/* token buttons */}
              <div className="flex flex-wrap gap-2">
                {shuffledTokens.map((token: string, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setSelectedTokens((prev) => [...prev, token])
                    }
                    className="border rounded-md px-3 py-1 hover:bg-gray-50"
                  >
                    {token}
                  </button>
                ))}
              </div>

              {/* reset button */}
              <Button
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md w-fit"
                onClick={() => setSelectedTokens([])}
              >
                Reset
              </Button>
            </div>
          )}

          {checked && (
            <div className="mt-4">
              <p
                className={`font-medium ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCorrect ? "Correct ✅" : "Not quite ❌"}
              </p>
              <p className="text-gray-700 mt-2">{current.explanation}</p>
            </div>
          )}

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
              onClick={() => navigate("/practice")}
            >
              ← Back to Practice
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}