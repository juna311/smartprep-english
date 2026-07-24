import LevelCard from "../components/LevelCard";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import { GRAMMAR_LEVELS } from "../data/grammarData";

export default function Grammar() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Grammar"
        title="Choose your level"
        description="Start with the level that matches your current skills. You can always switch later."
        className="mb-6 sm:mb-8 md:mb-10"
      />

      <section className="grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-3">
        {GRAMMAR_LEVELS.map((level) => (
          <LevelCard
            key={level.id}
            title={level.title}
            description={level.description}
            to={`/grammar/${level.id}`}
          />
        ))}
      </section>
    </PageShell>
  );
}
