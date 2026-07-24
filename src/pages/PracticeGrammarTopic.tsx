import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useId, useMemo, useState } from "react";
import { PRACTICE_GRAMMAR } from "../data/practice/grammar";
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
import ReorderAnswer, {
  type ReorderToken,
} from "../components/quiz/ReorderAnswer";
import { useQuizSession } from "../hooks/useQuizSession";
import {
  createQuestionSet,
  normalizeAnswer,
  shuffleArray,
} from "../utils/quiz";

export default function PracticeGrammarTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const questionPromptId = useId();
  const feedbackId = useId();

  const allQuestions = topicId
    ? PRACTICE_GRAMMAR[topicId as keyof typeof PRACTICE_GRAMMAR]
    : undefined;

  const [questions, setQuestions] = useState(() => {
    if (!allQuestions) return [];

    return createQuestionSet(allQuestions, 3);
  });

  const [selected, setSelected] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<ReorderToken[]>([]);
  const [input, setInput] = useState("");

  const resetAnswerState = useCallback(() => {
    setSelected(null);
    setSelectedTokens([]);
    setInput("");
  }, []);

  const topicTitle = questions[0]?.title ?? "Grammar topic";
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

  const shuffledTokens = useMemo(() => {
    if (!current || current.type !== "reorder") return [];

    return shuffleArray(
      current.tokens.map((value, tokenIndex) => ({
        id: `${current.id}-${tokenIndex}`,
        value,
      })),
    );
  }, [current]);

  if (!topicId) {
    return (
      <PageShell>
        <p className="text-red-600 font-semibold">Topic not found.</p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate("/practice")}
        >
          ← Back to Practice
        </Button>
      </PageShell>
    );
  }

  if (!allQuestions) {
    return (
      <PageShell>
        <h1 className="text-3xl font-bold mb-2">Practice</h1>
        <p className="text-gray-700">
          No practice questions have been added for this topic yet.
        </p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate(`/practice/grammar`)}
        >
          ← Back to Practice Grammar
        </Button>
      </PageShell>
    );
  }

  if (questions.length === 0) {
    return (
      <PageShell>
        <h1 className="text-3xl font-bold mb-2">Practice</h1>
        <p className="text-gray-700">
          This topic doesn't have any questions yet.
        </p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate(`/practice/grammar`)}
        >
          ← Back to Practice Grammar
        </Button>
      </PageShell>
    );
  }

  if (isFinished) {
    return (
      <PageShell centered>
        <div className="w-full max-w-xl">
          <PageHeader
            eyebrow="Grammar Practice"
            title={`${topicTitle} • Results`}
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
                  : "Good start. Try again to improve your score."
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
                label: "Back to Practice Grammar",
                onClick: () => navigate("/practice/grammar"),
              },
            ]}
          />
        </div>
      </PageShell>
    );
  }
  if (!current) return null;

  const isCorrect =
    current.type === "mcq"
      ? selected === current.choices[current.correct]
      : current.type === "fill"
        ? normalizeAnswer(input) === normalizeAnswer(current.answer)
        : normalizeAnswer(
            selectedTokens.map((token) => token.value).join(" "),
          ) === normalizeAnswer(current.answer);

  const canCheck =
    current.type === "mcq"
      ? selected !== null
      : current.type === "fill"
        ? input.trim().length > 0
        : selectedTokens.length === shuffledTokens.length;

  const correctAnswer =
    current.type === "mcq" ? current.choices[current.correct] : current.answer;

  const handleCheckAnswer = () => {
    checkAnswer(isCorrect, canCheck);
  };

  const toggleToken = (token: ReorderToken) => {
    if (checked) return;

    setSelectedTokens((previousTokens) => {
      const isSelected = previousTokens.some(
        (selectedToken) => selectedToken.id === token.id,
      );

      if (isSelected) {
        return previousTokens.filter(
          (selectedToken) => selectedToken.id !== token.id,
        );
      }

      return [...previousTokens, token];
    });
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Grammar Practice"
        title={`${current.title} • Grammar`}
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
            onBack={() => navigate("/practice")}
            backLabel="← Back to Practice"
          />
        }
      >
        {current.type === "mcq" && (
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

        {current.type === "reorder" && (
          <ReorderAnswer
            tokens={shuffledTokens}
            selectedTokens={selectedTokens}
            checked={checked}
            onToggleToken={toggleToken}
            onReset={() => setSelectedTokens([])}
          />
        )}
      </QuizQuestionCard>
    </PageShell>
  );
}
