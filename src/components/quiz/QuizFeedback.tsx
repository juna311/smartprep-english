import type { ReactNode } from "react";

type QuizFeedbackProps = {
  feedbackId: string;
  checked: boolean;
  isCorrect: boolean;
  correctAnswer: ReactNode;
  explanation: ReactNode;
};

export default function QuizFeedback({
  feedbackId,
  checked,
  isCorrect,
  correctAnswer,
  explanation,
}: QuizFeedbackProps) {
  return (
    <div
      id={feedbackId}
      aria-live="polite"
      aria-atomic="true"
      className="mt-4 min-h-[72px] border-t border-gray-100 pt-3"
    >
      {checked ? (
        <div className="space-y-1">
          <p
            className={`font-medium ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? (
              "Correct."
            ) : (
              <>
                Not quite.{" "}
                <span className="text-gray-700">
                  Correct: <strong>{correctAnswer}</strong>
                </span>
              </>
            )}
          </p>
          <p className="text-sm text-gray-600 leading-snug">{explanation}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          Check your answer to see feedback.
        </p>
      )}
    </div>
  );
}
