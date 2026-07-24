import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import LevelCard from "../components/LevelCard";

export default function Practice() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Practice"
        title="Choose what to practice"
        description="Strengthen grammar and vocabulary with focused exercises."
        className="mb-10"
      />

      <section className="grid gap-6 md:grid-cols-2">
        <LevelCard
          title="Grammar"
          description="Practice grammar rules with exercises."
          to="/practice/grammar"
        />

        <LevelCard
          title="Vocabulary"
          description="Practice vocabulary and word usage."
          to="/practice/vocabulary"
        />
      </section>
    </PageShell>
  );
}
