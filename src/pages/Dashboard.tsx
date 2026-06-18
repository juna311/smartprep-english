import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import LevelCard from "../components/LevelCard";
import Button from "../components/Button";
import { useAuth } from "../context/useAuth";
import { supabase } from "../supabase/client";

type ReviewSession = {
  id: string;
  mode: string;
  review_label: string | null;
  total_questions: number;
  correct_answers: number;
  needs_review_count: number;
  created_at: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedWordsCount, setSavedWordsCount] = useState(0);
  const [reviewSessions, setReviewSessions] = useState<ReviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const [
        { count: savedCount, error: savedError },
        { data: sessions, error: sessionsError },
      ] = await Promise.all([
        supabase
          .from("saved_words")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("review_sessions")
          .select(
            "id, mode, review_label, total_questions, correct_answers, needs_review_count, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (savedError) {
        console.error("Failed to fetch saved words count:", savedError.message);
      }

      if (sessionsError) {
        console.error("Failed to fetch review sessions:", sessionsError.message);
      }

      setSavedWordsCount(savedCount ?? 0);
      setReviewSessions((sessions ?? []) as ReviewSession[]);
      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  const totalReviewSessions = reviewSessions.length;
  const latestSession = reviewSessions[0];
  const totalQuestions = reviewSessions.reduce(
    (sum, session) => sum + session.total_questions,
    0
  );
  const totalCorrect = reviewSessions.reduce(
    (sum, session) => sum + session.correct_answers,
    0
  );
  const averageAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const latestAccuracy = latestSession
    ? Math.round((latestSession.correct_answers / latestSession.total_questions) * 100)
    : 0;

  const formatReviewMode = (mode: string) => {
    switch (mode) {
      case "mcq":
        return "Multiple choice";
      case "typing":
        return "Typing";
      case "mixed":
        return "Mixed practice";
      default:
        return "Review practice";
    }
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-navy)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
            Dashboard
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome{user?.email ? `, ${user.email}` : ""}
          </h1>

          <p className="text-gray-700 max-w-2xl">
            Continue learning, track your progress, and practice your English.
          </p>
        </header>

        {loading ? (
          <p className="text-gray-600">Loading your progress...</p>
        ) : (
          <>
            <section className="mb-4">
              <h2 className="text-xl font-bold">Your progress</h2>
              <p className="mt-1 text-gray-600">
                A quick snapshot of your saved words and dictionary review activity.
              </p>
            </section>

            <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Saved words</p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-brand-navy)]">
                  {savedWordsCount}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Review sessions</p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-brand-navy)]">
                  {totalReviewSessions}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Average accuracy</p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-brand-navy)]">
                  {averageAccuracy}%
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Latest review</p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-brand-navy)]">
                  {latestSession ? `${latestAccuracy}%` : "—"}
                </p>
              </div>
            </section>

            <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Continue learning</h2>
                  <p className="mt-1 text-gray-600">
                    Review saved words or keep practicing grammar and vocabulary.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-4 py-2 rounded-md hover:bg-[var(--color-brand-gold-light)] disabled:opacity-50"
                    disabled={savedWordsCount === 0}
                    onClick={() => navigate("/my-dictionary/review")}
                  >
                    Review My Dictionary
                  </Button>

                  <Button
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                    onClick={() => navigate("/practice")}
                  >
                    Practice
                  </Button>
                </div>
              </div>
            </section>

            {latestSession && (
              <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold">Last review session</h2>
                <p className="mt-2 text-gray-700">
                  {latestSession.review_label ?? "Dictionary review"} • {formatReviewMode(latestSession.mode)}
                </p>
                <p className="mt-1 text-gray-700">
                  Score: <strong>{latestSession.correct_answers}</strong> / {latestSession.total_questions}
                  <span className="ml-3 text-sm text-gray-600">
                    Needs review: <strong>{latestSession.needs_review_count}</strong>
                  </span>
                </p>
              </section>
            )}

            <section className="grid gap-4 md:gap-6 sm:grid-cols-2">
              <LevelCard
                title="Grammar"
                description="Review grammar rules by level and topic."
                to="/grammar"
              />

              <LevelCard
                title="Vocabulary"
                description="Build and review your vocabulary."
                to="/vocabulary"
              />

              <LevelCard
                title="Practice"
                description="Test your knowledge with interactive exercises."
                to="/practice"
              />

              <LevelCard
                title="My Dictionary"
                description="Review and manage your saved words."
                to="/my-dictionary"
              />
            </section>
          </>
        )}
      </PageContainer>
    </div>
  );
}
