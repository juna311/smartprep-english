import PageContainer from "../components/PageContainer";
import { GRAMMAR_LEVELS } from "../data/grammarData";
import LevelCard from "../components/LevelCard";

export default function PracticeGrammar() {
  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-navy)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-navy)]">
            Practice
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">Grammar practice</h1>
          <p className="text-gray-700 mt-2 max-w-2xl">
            Choose a level, then pick a topic to practice.
          </p>
        </header>
        <div className="flex flex-col gap-4">
            {GRAMMAR_LEVELS.map((level) => (
                <details
                key={level.id}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm"
                >
                    <summary className="cursor-pointer list-none px-5 py-4 font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <span className="transition-transform duration-300 ease-out group-open:rotate-90 text-gray-500">▸</span>
                            {level.title}
                        </span>
                        <span className="text-gray-500 text-sm">{level.topics.length} topics</span>
                    </summary>

                    <div className="px-5 pb-5 pt-2 grid gap-3">
                        {level.topics.map((topic) => (
                        <LevelCard
                            key={topic.id}
                            title={topic.title}
                            description={topic.summary}
                            to={`/practice/grammar/${topic.id}`}
                        />
                        ))}
                    </div>
                </details>
            ))}
        </div>
      </PageContainer>
    </div>
  );
}