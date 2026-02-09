import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import LevelCard from "../components/LevelCard";
import Button from "../components/Button";
import { GRAMMAR_LEVELS } from "../data/grammarData";

export default function GrammarLevel() {
  const { levelId } = useParams<{ levelId: string }>();

  const level = GRAMMAR_LEVELS.find((lvl) => lvl.id === levelId);

  if (!level) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16 flex items-center">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <p className="text-red-600 font-semibold">
            Oops, this grammar level doesn&apos;t exist.
          </p>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <div className="mb-6 sm:mb-8">
                <Link to="/grammar" className="inline-block mb-4">
                <Button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm font-medium transition">
                    <span aria-hidden="true">←</span>
                    <span>Back to Grammar</span>
                </Button>
                </Link>

                <header>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-blue)]">
                    {level.title.toUpperCase()} GRAMMAR
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
                    Choose a topic
                </h1>
                <p className="text-gray-700 max-w-2xl text-sm md:text-base">
                    Explore key grammar topics for the {level.title.toLowerCase()} level.
                </p>
                </header>
            </div>

        <section className="grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-2">
          {level.topics?.map((topic) => (
            <LevelCard
              key={topic.id}
              title={topic.title}
              description={topic.summary}
              to={`/grammar/${level.id}/${topic.id}`} // lesson route for later
            />
          ))}
        </section>
      </PageContainer>
    </div>
  );
}