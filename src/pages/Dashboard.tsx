import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import LevelCard from "../components/LevelCard";
import Button from "../components/Button";
import { useAuth } from "../context/useAuth";
import { getReviewSessions } from "../services/reviewSessions";
import { getSavedWordsCount } from "../services/savedWords";
import type { ReviewSession } from "../types/database.types";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedWordsCount, setSavedWordsCount] = useState(0);
  const [reviewSessions, setReviewSessions] = useState<ReviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(null);

      try {
        const [savedCount, sessions] = await Promise.all([
          getSavedWordsCount(user.id),
          getReviewSessions(user.id),
        ]);

        if (!ignore) {
          setSavedWordsCount(savedCount);
          setReviewSessions(sessions);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);

        if (!ignore) {
          setLoadError("We could not load your progress. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchDashboardData();

    return () => {
      ignore = true;
    };
  }, [user]);

  const totalReviewSessions = reviewSessions.length;
  const latestSession = reviewSessions[0];
  const totalQuestions = reviewSessions.reduce(
    (sum, session) => sum + session.total_questions,
    0,
  );
  const totalCorrect = reviewSessions.reduce(
    (sum, session) => sum + session.correct_answers,
    0,
  );
  const averageAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const latestAccuracy = latestSession
    ? Math.round(
        (latestSession.correct_answers / latestSession.total_questions) * 100,
      )
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
    <PageShell>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome${user?.email ? `, ${user.email}` : ""}`}
        description="Continue learning, track your progress, and practice your English."
        className="mb-8"
      />

      {loading ? (
        <p className="text-gray-600">Loading your progress...</p>
      ) : loadError ? (
        <p role="alert" className="text-red-700">
          {loadError}
        </p>
      ) : (
        <>
          <section className="mb-4">
            <h2 className="text-xl font-bold">Your progress</h2>
            <p className="mt-1 text-gray-600">
              A quick snapshot of your saved words and dictionary review
              activity.
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
                  variant="gold"
                  size="md"
                  disabled={savedWordsCount === 0}
                  onClick={() => navigate("/my-dictionary/review")}
                >
                  Review My Dictionary
                </Button>

                <Button
                  variant="secondary"
                  size="md"
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
                {latestSession.review_label ?? "Dictionary review"} •{" "}
                {formatReviewMode(latestSession.mode)}
              </p>
              <p className="mt-1 text-gray-700">
                Score: <strong>{latestSession.correct_answers}</strong> /{" "}
                {latestSession.total_questions}
                <span className="ml-3 text-sm text-gray-600">
                  Needs review:{" "}
                  <strong>{latestSession.needs_review_count}</strong>
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
    </PageShell>
  );
}
