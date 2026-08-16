import type { ReactNode } from "react";
import Button, { type ButtonVariant } from "./Button";

type PageStatusKind = "loading" | "error" | "empty";

type PageStatusAction = {
  label: string;
  onClick: () => void;
  variant?: Extract<ButtonVariant, "primary" | "secondary" | "gold">;
};

type PageStatusProps = {
  kind: PageStatusKind;
  title: string;
  message: ReactNode;
  actions?: PageStatusAction[];
  className?: string;
};

export default function PageStatus({
  kind,
  title,
  message,
  actions = [],
  className = "",
}: PageStatusProps) {
  const role =
    kind === "loading" ? "status" : kind === "error" ? "alert" : undefined;

  return (
    <section
      role={role}
      aria-busy={kind === "loading" || undefined}
      className={`py-10 text-center ${className}`}
    >
      {kind === "loading" && (
        <span
          aria-hidden="true"
          className="mx-auto mb-4 block size-8 animate-spin rounded-full border-4 border-[var(--color-border-soft)] border-t-[var(--color-brand-navy)]"
        />
      )}

      <h2
        className={`text-xl font-bold ${
          kind === "error" ? "text-red-700" : "text-[var(--color-brand-navy)]"
        }`}
      >
        {title}
      </h2>

      <div className="mx-auto mt-2 max-w-xl text-[var(--color-text-secondary)]">
        {message}
      </div>

      {actions.length > 0 && (
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          {actions.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant={action.variant ?? "secondary"}
              size="md"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
