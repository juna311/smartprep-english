import PageContainer from "../components/PageContainer";
import LevelCard from "../components/LevelCard";

export default function Practice() {
  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-10">
          <p className="text-xs uppercase font-semibold text-[var(--color-brand-blue)]">
            Practice
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">
            Choose what to practice
          </h1>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <LevelCard
            title="Grammar"
            description="Practice grammar rules with exercises."
            to="/practice/grammar"
          />

          <LevelCard
            title="Vocabulary"
            description="Practice vocabulary and word usage."
            to="/practice/vocabulary"
          />
        </section>
      </PageContainer>
    </div>
  );
}
