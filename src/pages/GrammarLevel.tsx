import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import LevelCard from "../components/LevelCard";
import { GRAMMAR_LEVELS } from "../data/grammarData";

export default function GrammarLevel() {
  const { levelId } = useParams<{ levelId: string }>();

  const level = GRAMMAR_LEVELS.find((lvl) => lvl.id === levelId);

  if (!level) {
    return (
      <PageShell centered>
        <p className="text-red-600 font-semibold">
          Oops, this grammar level doesn&apos;t exist.
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Link to="/grammar" className="inline-block mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm font-medium transition">
          <span aria-hidden="true">←</span>
          <span>Back to Grammar</span>
        </span>
      </Link>

      <PageHeader
        eyebrow={`${level.title} Grammar`}
        title="Choose a topic"
        description={`Explore key grammar topics for the ${level.title.toLowerCase()} level.`}
        className="mb-6 sm:mb-8"
      />

      <section className="grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-2">
        {level.topics?.map((topic) => (
          <LevelCard
            key={topic.id}
            title={topic.title}
            description={topic.summary}
            to={`/grammar/${level.id}/${topic.id}`}
          />
        ))}
      </section>
    </PageShell>
  );
}
