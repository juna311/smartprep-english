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
      <PageContainer>
        <p className="text-red-600 font-semibold">Topic not found.</p>
        <Button
          className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
          onClick={() => navigate("/practice")}
        >
          ← Back to Practice
        </Button>
      </PageContainer>
    );
  }

  const allQuestions =
    PRACTICE_GRAMMAR[topicId as keyof typeof PRACTICE_GRAMMAR];

  
  const questions = useMemo(() => {
    if (!allQuestions) return [];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [allQuestions]);

  // 4) Only use the question types we support right now (mcq + fill)
  const supportedQuestions = useMemo(() => {
    return questions.filter((q) => q.type === "mcq" || q.type === "fill");
  }, [questions]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null); 
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false); 

  if (!allQuestions) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] py-8 md:py-12">
        <PageContainer>
          <h1 className="text-3xl font-bold mb-2">Practice: {topicId}</h1>
          <p className="text-gray-700">
            No practice questions have been added for this topic yet.
          </p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate(`/grammar`)}
          >
            ← Back to Grammar
          </Button>
        </PageContainer>
      </div>
    );
  }

  if (supportedQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] py-8 md:py-12">
        <PageContainer>
          <h1 className="text-3xl font-bold mb-2">Practice: {topicId}</h1>
          <p className="text-gray-700">
            This topic has questions, but none of the supported types (MCQ/fill)
            yet.
          </p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate(`/grammar`)}
          >
            ← Back to Grammar
          </Button>
        </PageContainer>
      </div>
    );
  }

  const current = supportedQuestions[index];

  if (!current) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] py-8 md:py-12">
        <PageContainer>
          <h1 className="text-3xl font-bold mb-2">Done!</h1>
          <p className="text-gray-700 mb-6">
            You finished this practice set for <strong>{topicId}</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-md hover:opacity-90"
              onClick={() => {
                // reshuffle by forcing a "new session": simplest is reload for now
                // (later we’ll do this without reload)
                window.location.reload();
              }}
            >
              Try a new set
            </Button>

            <Button
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
              onClick={() => navigate(`/grammar/${topicId.split("-").slice(-1)[0]}`)}
            >
              Back
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  // 9) Correctness logic (after user checks)
  const isCorrect =
    current.type === "mcq"
      ? selected === current.choices[current.correct]
      : input.trim().toLowerCase() === current.answer.toLowerCase();

  // 10) Helpers for button states
  const canCheck =
    current.type === "mcq" ? selected !== null : input.trim().length > 0;

  const goNext = () => {
    setIndex((i) => i + 1);
    setChecked(false);
    setSelected(null);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] py-8 md:py-12">
      <PageContainer>
        <header className="mb-6">
          <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
            Grammar Practice
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">Practice: {topicId}</h1>
          <p className="text-gray-700 mt-2">
            Question <strong>{index + 1}</strong> of{" "}
            <strong>{supportedQuestions.length}</strong>
          </p>
        </header>

        {/* ✅ Replace the placeholder card with the real UI */}
        <div className="bg-white rounded-xl shadow p-6">
          {/* Prompt */}
          <p className="font-semibold text-lg mb-4">{current.prompt}</p>

          {/* MCQ UI */}
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

          {/* Fill UI */}
          {current.type === "fill" && (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Type your answer…"
            />
          )}

          {/* Feedback */}
          {checked && (
            <div className="mt-4">
              <p className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "Correct ✅" : "Not quite ❌"}
              </p>
              <p className="text-gray-700 mt-2">{current.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {!checked ? (
              <Button
                className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
                onClick={() => setChecked(true)}
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