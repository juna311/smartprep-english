import PageContainer from "../components/PageContainer";
import { GRAMMAR_LEVELS } from "../data/grammarData";
import LevelCard from "../components/LevelCard";

export default function PracticeGrammar() {
  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
            Practice
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">Grammar practice</h1>
          <p className="text-gray-700 mt-2 max-w-2xl">
            Choose a level, then pick a topic to practice.
          </p>
        </header>

        {/* next step goes here */}
      </PageContainer>
    </div>
  );
}