import type { ReactNode } from "react";

type QuizProgressProps = {
  index: number;
  total: number;
  score: number;
  progressPercent: number;
  label?: ReactNode;
  barClassName?: string;
  className?: string;
};

export default function QuizProgress({
  index,
  total,
  score,
  progressPercent,
  label,
  barClassName = "bg-[var(--color-brand-gold)]",
  className = "",
}: QuizProgressProps) {
  return (
    <div className={className}>
      <p className="text-[var(--color-text-secondary)] mt-2">
        {label && <>{label} · </>}
        Question <strong>{index + 1}</strong> of <strong>{total}</strong>
        <span className="ml-3 text-sm text-gray-600">
          Score: <strong>{score}</strong>
        </span>
      </p>

      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        aria-valuetext={`Question ${index + 1} of ${total}`}
        className="mt-4 h-3 w-full rounded-full bg-gray-200 overflow-hidden"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${barClassName}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
