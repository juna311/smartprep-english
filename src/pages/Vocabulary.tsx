import LevelCard from "../components/LevelCard";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import { VOCABULARY_TOPICS } from "../data/vocabulary";

export default function Vocabulary() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Vocabulary"
        title="Choose your topic"
        description="Start with the topic that matches your current needs. You can always switch later."
        className="mb-6 sm:mb-8 md:mb-10"
      />

      <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {VOCABULARY_TOPICS.map((topic) => (
          <LevelCard
            key={topic.id}
            title={topic.title}
            description={`Explore ${topic.title.toLowerCase()} vocabulary.`}
            to={`/vocabulary/${topic.id}`}
          />
        ))}
      </section>
    </PageShell>
  );
}
