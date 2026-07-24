import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import { GRAMMAR_LEVELS } from "../data/grammarData";
import { LESSONS } from "../data/lessons";
import Button from "../components/Button";

export default function GrammarLesson() {
  const { levelId, topicId } = useParams();
  const navigate = useNavigate();

  const level = GRAMMAR_LEVELS.find((item) => item.id === levelId);

  const lesson =
    topicId && topicId in LESSONS
      ? LESSONS[topicId as keyof typeof LESSONS]
      : null;

  if (!level || !lesson) {
    return (
      <PageShell>
        <p className="text-red-600 font-semibold">Lesson not found.</p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate("/grammar")}
        >
          ← Back to Grammar
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Button
        variant="soft"
        size="md"
        className="mb-6 text-sm flex items-center gap-2"
        onClick={() => navigate(`/grammar/${levelId}`)}
      >
        ← Back to {level.title}
      </Button>

      <PageHeader
        eyebrow={`${level.title} • Grammar Topic`}
        title={lesson.title}
        className="mb-8"
      />

      <div className="flex flex-col gap-8">
        {lesson.overview && (
          <section>
            <h2 className="text-xl font-bold mb-2">Overview</h2>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              {lesson.overview.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {lesson.formation && (
          <section>
            <h2 className="text-xl font-bold mb-2">Formation</h2>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              {lesson.formation.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {"spellingRules" in lesson && (
          <section>
            <h2 className="text-xl font-bold mb-2">Spelling Rules</h2>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              {(
                (lesson as { spellingRules?: string[] }).spellingRules || []
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {lesson.uses && (
          <section>
            <h2 className="text-xl font-bold mb-2">Uses</h2>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              {lesson.uses.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {lesson.examples && (
          <section>
            <h2 className="text-xl font-bold mb-2">Examples</h2>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              {lesson.examples.map((example, index) => (
                <li key={index} className="text-gray-800">
                  {example}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="mt-10">
        <Button
          variant="gold"
          className="text-sm px-6 py-3 rounded-lg font-medium hover:-translate-y-0.5 transition flex items-center gap-2"
          onClick={() => navigate(`/practice/grammar/${topicId}`)}
        >
          Practice this topic
        </Button>
      </div>
    </PageShell>
  );
}
