type PageHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
  align = "left",
  className = "",
}: PageHeaderProps) {
  const isCentered = align === "center";

  return (
    <header className={`${isCentered ? "text-center" : ""} ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
        {eyebrow}
      </p>

      <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
        {title}
      </h1>

      {description && (
        <p
          className={`mt-2 text-[var(--color-text-secondary)] text-sm md:text-base ${
            isCentered ? "mx-auto" : ""
          } max-w-2xl`}
        >
          {description}
        </p>
      )}

      {children}
    </header>
  );
}
