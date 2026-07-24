import type { ReactNode } from "react";
import Button, { type ButtonVariant } from "./Button";

type QuizResultAction = {
  label: string;
  onClick: () => void;
  variant?: Extract<ButtonVariant, "primary" | "secondary" | "gold">;
  disabled?: boolean;
};

type QuizResultCardProps = {
  score: number;
  total: number;
  message: ReactNode;
  actions: QuizResultAction[];
  children?: ReactNode;
};

export default function QuizResultCard({
  score,
  total,
  message,
  actions,
  children,
}: QuizResultCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
      <p className="text-lg">
        Score: <strong>{score}</strong> / <strong>{total}</strong>
      </p>

      <div className="text-gray-700 mt-2">{message}</div>

      {children}

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant ?? "secondary"}
            size="md"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
