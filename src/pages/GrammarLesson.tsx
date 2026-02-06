import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { GRAMMAR_LEVELS } from "../data/grammarData";
import { LESSONS } from "../data/lessons";
import Button from "../components/Button";

export default function GrammarLesson() {
  const { levelId, topicId } = useParams();
  const navigate = useNavigate();

  const level = GRAMMAR_LEVELS.find(l => l.id === levelId);

  const lesson = topicId && topicId in LESSONS ? LESSONS[topicId as keyof typeof LESSONS] : null;

  if (!level || !lesson) {
    return (
      <PageContainer>
        <p className="text-red-600 font-semibold">Lesson not found.</p>
        <Button
          className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
          onClick={() => navigate("/grammar")}
        >
          ← Back to Grammar
        </Button>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-brand-blue)] py-10">
      <PageContainer className="bg-white rounded-xl shadow-xl p-8 md:p-12">
        
        <Button
          className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
          onClick={() => navigate(`/grammar/${levelId}`)}
        >
          ← Back to {level.title}
        </Button>

        <header className="mb-8">
          <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
            {level.title} • Grammar Topic
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{lesson.title}</h1>
        </header>

        <div className="flex flex-col gap-8">

          {lesson.overview && (
            <section>
              <h2 className="text-xl font-bold mb-2">Overview</h2>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {lesson.overview.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {lesson.formation && (
            <section>
              <h2 className="text-xl font-bold mb-2">Formation</h2>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {lesson.formation.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {"spellingRules" in lesson && (
            <section>
              <h2 className="text-xl font-bold mb-2">Spelling Rules</h2>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {((lesson as { spellingRules?: string[] }).spellingRules || []).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {lesson.uses && (
            <section>
              <h2 className="text-xl font-bold mb-2">Uses</h2>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {lesson.uses.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {lesson.examples && (
            <section>
              <h2 className="text-xl font-bold mb-2">Examples</h2>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {lesson.examples.map((example, i) => (
                  <li key={i} className="text-gray-800">{example}</li>
                ))}
              </ul>
            </section>
          )}

        </div>
        <div className="mt-10">
          <Button
            className="bg-[var(--color-brand-pink)] text-white text-sm px-6 py-3 rounded-lg font-medium hover:opacity-90 hover:-translate-y-0.5 transition  flex items-center gap-2"
            onClick={() => navigate(`/practice/grammar/${topicId}`)}
          >
            Practice this topic
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}