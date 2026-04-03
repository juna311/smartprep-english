import PageContainer from "../components/PageContainer";
import LevelCard from "../components/LevelCard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-blue)]">
            Dashboard
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome{user?.email ? `, ${user.email}` : ""}
          </h1>

          <p className="text-gray-700 max-w-2xl">
            Continue learning, track your progress, and practice your English.
          </p>
        </header>

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
            description="Your dictionary."
            to="/my-dictionary"
          />
        </section>
      </PageContainer>
    </div>
  );
}