import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
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
      <PageShell>
        <p className="text-red-600 font-semibold">Topic not found.</p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate("/vocabulary")}
        >
          ← Back to Vocabulary
        </Button>
      </PageShell>
    );
  }

  const levelEntries = Object.entries(topic.levels);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Vocabulary"
        title={topic.title}
        description="Choose your level for this vocabulary topic."
        className="mb-6 sm:mb-8 md:mb-10"
      />

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
    </PageShell>
  );
}
