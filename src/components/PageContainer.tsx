interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function PageContainer({
  children,
  className,
  noPadding,
}: PageContainerProps) {
  return (
    <div
      className={`
        max-w-5xl mx-auto 
        ${noPadding ? "" : "px-4 md:px-6 py-10 md:py-14"}
        ${className || ""}
      `}
    >
      {children}
    </div>
  );
}