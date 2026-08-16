import { useCallback, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import QuizProgress from "../components/QuizProgress";
import QuizResultCard from "../components/QuizResultCard";
import FillAnswerInput from "../components/quiz/FillAnswerInput";
import MultipleChoiceAnswers from "../components/quiz/MultipleChoiceAnswers";
import QuizActions from "../components/quiz/QuizActions";
import QuizFeedback from "../components/quiz/QuizFeedback";
import QuizQuestionCard from "../components/quiz/QuizQuestionCard";
import { getVocabularyPracticeQuestions } from "../data/practice/vocabulary";
import { useQuizSession } from "../hooks/useQuizSession";
import { createQuestionSet, normalizeAnswer } from "../utils/quiz";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function VocabularyPracticeSession() {
  const { topicId, level } = useParams();
  const navigate = useNavigate();
  const questionPromptId = useId();
  const feedbackId = useId();

  const formatTopic = (text: string = "") =>
    text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const allQuestions = getVocabularyPracticeQuestions(topicId, level);

  const [questions, setQuestions] = useState(() => {
    if (!allQuestions) return [];

    return createQuestionSet(allQuestions, 3);
  });

  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const resetAnswerState = useCallback(() => {
    setSelected(null);
    setInput("");
  }, []);

  const {
    checked,
    checkAnswer,
    currentQuestion: current,
    goNext,
    index,
    isFinished,
    progressPercent,
    reset,
    score,
    total,
  } = useQuizSession(questions, {
    onQuestionReset: resetAnswerState,
  });

  const startNewSet = () => {
    if (!allQuestions) return;

    setQuestions(createQuestionSet(allQuestions, 3));
    reset();
  };

  if (!topicId || !level) {
    return (
      <PageShell>
        <p className="text-red-600 font-semibold">
          Practice session not found.
        </p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate("/practice/vocabulary")}
        >
          ← Back to Vocabulary Practice
        </Button>
      </PageShell>
    );
  }

  if (!allQuestions) {
    return (
      <PageShell>
        <p className="text-red-600 font-semibold">
          No practice questions found for this topic and level.
        </p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate(`/practice/vocabulary/${topicId}`)}
        >
          ← Back to {formatTopic(topicId)}
        </Button>
      </PageShell>
    );
  }

  if (isFinished) {
    return (
      <PageShell centered>
        <div className="w-full max-w-xl">
          <PageHeader
            eyebrow="Vocabulary Practice"
            title={`Results: ${formatTopic(topicId)} • ${LEVEL_LABELS[level] ?? level}`}
            align="center"
            className="mb-8"
          />

          <QuizResultCard
            score={score}
            total={total}
            message={
              score === total
                ? "Perfect score."
                : score >= Math.ceil(total * 0.67)
                  ? "Nice job."
                  : "Keep practicing to improve your score."
            }
            actions={[
              {
                label: "Try again",
                onClick: reset,
                variant: "primary",
              },
              {
                label: "Try a new set",
                onClick: startNewSet,
              },
              {
                label: "Back to levels",
                onClick: () => navigate(`/practice/vocabulary/${topicId}`),
              },
            ]}
          />
        </div>
      </PageShell>
    );
  }

  if (!current) return null;

  const isCorrect =
    current.type === "mcq" || current.type === "usage"
      ? selected === current.choices[current.correct]
      : normalizeAnswer(input) === normalizeAnswer(current.answer);

  const canCheck =
    current.type === "mcq" || current.type === "usage"
      ? selected !== null
      : input.trim().length > 0;

  const correctAnswer =
    current.type === "mcq" || current.type === "usage"
      ? current.choices[current.correct]
      : current.answer;

  const handleCheckAnswer = () => {
    checkAnswer(isCorrect, canCheck);
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Vocabulary Practice"
        title={`${formatTopic(topicId)} • ${LEVEL_LABELS[level] ?? level}`}
        className="mb-6"
      >
        <QuizProgress
          index={index}
          total={total}
          score={score}
          progressPercent={progressPercent}
        />
      </PageHeader>

      <QuizQuestionCard
        promptId={questionPromptId}
        prompt={current.prompt}
        promptClassName="mb-2"
        hint={current.type === "fill" ? current.clue : undefined}
        feedback={
          <QuizFeedback
            feedbackId={feedbackId}
            checked={checked}
            isCorrect={isCorrect}
            correctAnswer={correctAnswer}
            explanation={current.explanation}
          />
        }
        actions={
          <QuizActions
            checked={checked}
            canCheck={canCheck}
            onCheck={handleCheckAnswer}
            onNext={goNext}
            onBack={() => navigate("/practice/vocabulary")}
            backLabel="← Back to Vocabulary Practice"
          />
        }
      >
        {(current.type === "mcq" || current.type === "usage") && (
          <MultipleChoiceAnswers
            choices={current.choices}
            correctIndex={current.correct}
            selected={selected}
            checked={checked}
            questionPromptId={questionPromptId}
            onSelect={setSelected}
          />
        )}

        {current.type === "fill" && (
          <FillAnswerInput
            value={input}
            checked={checked}
            questionPromptId={questionPromptId}
            feedbackId={feedbackId}
            onChange={setInput}
            onSubmit={handleCheckAnswer}
          />
        )}
      </QuizQuestionCard>
    </PageShell>
  );
}
