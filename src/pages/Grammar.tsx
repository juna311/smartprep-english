import LevelCard from "../components/LevelCard";
import PageContainer from "../components/PageContainer";
import { GRAMMAR_LEVELS } from "../data/grammarData";

export default function Grammar() {
  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-navy)] py-6 sm:py-10 md:py-16">
      <PageContainer
        className="
          bg-white
          rounded-none sm:rounded-2xl md:rounded-3xl
          shadow-none sm:shadow-xl
          p-6 sm:p-8 md:p-10 lg:p-12
          sm:min-h-[70vh]
        "
      >
        <header className="mb-6 sm:mb-8 md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
            Grammar
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            Choose your level
          </h1>
          <p className="text-gray-700 max-w-2xl text-sm md:text-base">
            Start with the level that matches your current skills. You can always switch later.
          </p>
        </header>

        <section className="grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-3">
          {GRAMMAR_LEVELS.map(level => (
            <LevelCard
              key={level.id}
              title={level.title}
              description={level.description}
              to={`/grammar/${level.id}`}
            />
          ))}
        </section>
      </PageContainer>
    </div>
  );
}