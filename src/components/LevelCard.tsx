import { Link } from "react-router-dom";

interface LevelCardProps {
  title: string;
  description: string;
  to: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  statusLabel?: string;
}

const cardClasses = `block rounded-xl border
  border-[var(--color-brand-navy)] sm:border-gray-300
  bg-white
  p-5 sm:p-6
  shadow-sm`;

export default function LevelCard({
  title,
  description,
  to,
  className,
  onClick,
  disabled = false,
  statusLabel = "Coming soon",
}: LevelCardProps) {
  if (disabled) {
    return (
      <article
        aria-disabled="true"
        className={`${cardClasses} border-gray-200 bg-gray-50 opacity-70 ${className || ""}`}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <span className="shrink-0 rounded-md bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
            {statusLabel}
          </span>
        </div>
        <p className="text-gray-600">{description}</p>
      </article>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${cardClasses}
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--color-brand-navy)] hover:bg-[var(--color-brand-navy)]/3
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-navy)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className || ""}`}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </Link>
  );
}
