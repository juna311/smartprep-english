import type { ReactNode } from "react";

type QuizQuestionCardProps = {
  promptId: string;
  prompt: ReactNode;
  children: ReactNode;
  feedback: ReactNode;
  actions: ReactNode;
  eyebrow?: ReactNode;
  hint?: ReactNode;
  promptClassName?: string;
};

export default function QuizQuestionCard({
  promptId,
  prompt,
  eyebrow,
  hint,
  children,
  feedback,
  actions,
  promptClassName = "mb-4",
}: QuizQuestionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      {eyebrow && (
        <p className="text-sm uppercase tracking-wide font-semibold text-[var(--color-brand-navy)] mb-2">
          {eyebrow}
        </p>
      )}

      <p id={promptId} className={`font-semibold text-lg ${promptClassName}`}>
        {prompt}
      </p>

      {hint && <p className="text-sm text-gray-500 mb-4">Hint: {hint}</p>}

      {children}
      {feedback}
      {actions}
    </div>
  );
}
