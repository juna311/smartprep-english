import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import { GRAMMAR_LEVELS } from "../data/grammarData";
import LevelCard from "../components/LevelCard";

export default function PracticeGrammar() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Practice"
        title="Grammar practice"
        description="Choose a level, then pick a topic to practice."
        className="mb-8"
      />

      <div className="flex flex-col gap-4">
        {GRAMMAR_LEVELS.map((level) => (
          <details
            key={level.id}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="transition-transform duration-300 ease-out group-open:rotate-90 text-gray-500">
                  ▸
                </span>
                {level.title}
              </span>
              <span className="text-gray-500 text-sm">
                {level.topics.length} topics
              </span>
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
    </PageShell>
  );
}
