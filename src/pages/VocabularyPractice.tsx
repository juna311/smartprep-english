import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import LevelCard from "../components/LevelCard";
import { VOCABULARY_TOPICS } from "../data/vocabulary";
import { hasVocabularyPracticeTopic } from "../data/practice/vocabulary";

export default function VocabularyPractice() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Practice"
        title="Vocabulary practice"
        description="Choose a vocabulary topic to start practicing."
        className="mb-6 sm:mb-8 md:mb-10"
      />

      <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {VOCABULARY_TOPICS.map((topic) => (
          <LevelCard
            key={topic.id}
            title={topic.title}
            description={
              hasVocabularyPracticeTopic(topic.id)
                ? `Practice ${topic.title.toLowerCase()} vocabulary.`
                : "Practice content is being prepared."
            }
            to={`/practice/vocabulary/${topic.id}`}
            disabled={!hasVocabularyPracticeTopic(topic.id)}
          />
        ))}
      </section>
    </PageShell>
  );
}
