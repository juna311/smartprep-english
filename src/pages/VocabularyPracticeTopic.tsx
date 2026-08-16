import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import LevelCard from "../components/LevelCard";
import Button from "../components/Button";
import { VOCABULARY_TOPICS } from "../data/vocabulary";
import { getVocabularyPracticeQuestions } from "../data/practice/vocabulary";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function VocabularyPracticeTopic() {
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
          onClick={() => navigate("/practice/vocabulary")}
        >
          ← Back to Vocabulary Practice
        </Button>
      </PageShell>
    );
  }

  const levelEntries = Object.entries(topic.levels);

  return (
    <PageShell>
      <Button
        variant="soft"
        size="md"
        className="mb-4 text-sm"
        onClick={() => navigate("/practice/vocabulary")}
      >
        ← Back to Topics
      </Button>

      <PageHeader
        eyebrow="Vocabulary Practice"
        title={topic.title}
        description="Choose your level to start practicing."
        className="mb-6 sm:mb-8 md:mb-10"
      />

      <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {levelEntries.map(([levelKey]) => {
          const questions = getVocabularyPracticeQuestions(topic.id, levelKey);

          return (
            <LevelCard
              key={levelKey}
              title={LEVEL_LABELS[levelKey] ?? levelKey}
              description={
                questions
                  ? `${questions.length} practice questions`
                  : "Practice content is being prepared."
              }
              to={`/practice/vocabulary/${topic.id}/${levelKey}`}
              disabled={!questions}
            />
          );
        })}
      </section>
    </PageShell>
  );
}
