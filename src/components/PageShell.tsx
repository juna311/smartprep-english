import PageContainer from "./PageContainer";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
};

export default function PageShell({
  children,
  className = "",
  centered = false,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] sm:bg-[var(--color-brand-navy)] py-6 sm:py-10 md:py-16">
      <PageContainer
        className={`
          bg-[var(--color-bg-card)]
          rounded-none sm:rounded-2xl md:rounded-3xl
          shadow-none sm:shadow-xl
          p-6 sm:p-8 md:p-10 lg:p-12
          sm:min-h-[70vh]
          ${centered ? "flex items-center justify-center" : ""}
          ${className}
        `}
      >
        {children}
      </PageContainer>
    </div>
  );
}
