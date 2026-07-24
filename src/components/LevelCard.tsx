import { Link } from "react-router-dom";

interface LevelCardProps {
  title: string;
  description: string;
  to: string;
  className?: string;
  onClick?: () => void;
}

export default function LevelCard({
  title,
  description,
  to,
  className,
  onClick,
}: LevelCardProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block rounded-xl border
                border-[var(--color-brand-navy)] sm:border-gray-300
                bg-white
                p-5 sm:p-6
                shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--color-brand-navy)] hover:bg-[var(--color-brand-navy)]/3
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-navy)] focus-visible:ring-offset-2 focus-visible:ring-offset-whit ${className || ""}`}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </Link>
  );
}
