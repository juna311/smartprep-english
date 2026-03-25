import PageContainer from "../components/PageContainer";
import LevelCard from "../components/LevelCard";
import { VOCABULARY_TOPICS } from "../data/vocabulary";

export default function VocabularyPractice() {
  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer
        className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-6 sm:mb-8 md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-blue)]">
            Practice
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            Vocabulary practice
          </h1>
          <p className="text-gray-700 max-w-2xl text-sm md:text-base">
            Choose a vocabulary topic to start practicing.
          </p>
        </header>

        <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VOCABULARY_TOPICS.map((topic) => (
            <LevelCard
              key={topic.id}
              title={topic.title}
              description={`Practice ${topic.title.toLowerCase()} vocabulary.`}
              to={`/practice/vocabulary/${topic.id}`}
            />
          ))}
        </section>
      </PageContainer>
    </div>
  );
}