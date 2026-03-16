import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import LevelCard from "../components/LevelCard";
import Button from "../components/Button";
import { VOCABULARY_TOPICS } from "../data/vocabulary";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function VocabularyTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const topic = VOCABULARY_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
        <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
          <p className="text-red-600 font-semibold">Topic not found.</p>
          <Button
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => navigate("/vocabulary")}
          >
            ← Back to Vocabulary
          </Button>
        </PageContainer>
      </div>
    );
  }

  const levelEntries = Object.entries(topic.levels);

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-6 sm:mb-8 md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-blue)]">
            Vocabulary
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            {topic.title}
          </h1>
          <p className="text-gray-700 max-w-2xl text-sm md:text-base">
            Choose your level for this vocabulary topic.
          </p>
        </header>

        <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {levelEntries.map(([levelKey, words]) => (
            <LevelCard
              key={levelKey}
              title={LEVEL_LABELS[levelKey] ?? levelKey}
              description={`${words.length} words to learn`}
              to={`/vocabulary/${topic.id}/${levelKey}`}
            />
          ))}
        </section>
      </PageContainer>
    </div>
  );
}