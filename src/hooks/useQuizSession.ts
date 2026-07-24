import { useMemo, useRef, useState } from "react";

type UseQuizSessionOptions = {
  onQuestionReset?: () => void;
};

export function useQuizSession<TQuestion>(
  questions: TQuestion[],
  options: UseQuizSessionOptions = {},
) {
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const checkedRef = useRef(false);

  const total = questions.length;
  const currentQuestion = questions[index];
  const isFinished = showResults || index >= total;

  const progressPercent = useMemo(() => {
    if (total === 0) return 0;
    return Math.min(100, Math.round(((index + 1) / total) * 100));
  }, [index, total]);

  const checkAnswer = (isCorrect: boolean, canCheck = true) => {
    if (!canCheck || checkedRef.current) return;

    checkedRef.current = true;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setChecked(true);
  };

  const goNext = () => {
    const isLast = index === total - 1;

    if (isLast) {
      setShowResults(true);
      return;
    }

    setIndex((prev) => prev + 1);
    checkedRef.current = false;
    setChecked(false);
    options.onQuestionReset?.();
  };

  const reset = () => {
    setIndex(0);
    checkedRef.current = false;
    setChecked(false);
    setScore(0);
    setShowResults(false);
    options.onQuestionReset?.();
  };

  return {
    checked,
    currentQuestion,
    goNext,
    checkAnswer,
    index,
    isFinished,
    progressPercent,
    reset,
    score,
    total,
  };
}
