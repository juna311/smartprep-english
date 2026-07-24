import { useNavigate } from "react-router-dom";
import Button from "./Button";

const features = [
  {
    title: "Learn grammar",
    description:
      "Study grammar by level and topic, then reinforce it with focused practice.",
  },
  {
    title: "Build vocabulary",
    description:
      "Explore useful words by topic and level with examples and translations.",
  },
  {
    title: "Save words",
    description:
      "Add important words to My Dictionary so you can come back to them anytime.",
  },
  {
    title: "Review smarter",
    description:
      "Practice saved words with typing and multiple-choice review sessions.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose what to study",
    description:
      "Start with grammar, vocabulary, or practice depending on your goal for the day.",
  },
  {
    number: "02",
    title: "Save what matters",
    description:
      "Keep useful vocabulary in your personal dictionary for quick review later.",
  },
  {
    number: "03",
    title: "Review and track progress",
    description:
      "Use review sessions and dashboard stats to see how your learning is improving.",
  },
];

export default function HomeContent() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <section className="px-6 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
              What you can do
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Everything you need to keep moving forward
            </h2>
            <p className="mt-3 text-gray-700">
              EigoPath brings grammar, vocabulary, review, and progress tracking
              into one simple learning flow.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              A simple path from learning to remembering
            </h2>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200"
              >
                <p className="text-sm font-bold text-[var(--color-brand-gold)]">
                  {step.number}
                </p>
                <h3 className="mt-3 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-gray-600 leading-6">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 md:items-stretch">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
              Explore freely
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Study without an account
            </h2>
            <p className="mt-3 text-gray-700 leading-6">
              Browse grammar, vocabulary, and practice pages to see how EigoPath
              works.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-brand-navy)] bg-[var(--color-brand-navy)] p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
              Save your progress
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Create an account to unlock more
            </h2>
            <p className="mt-3 leading-6 text-white/90">
              Save words, build your dictionary, review filtered word sets, and
              see progress on your dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 sm:px-8 md:pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gray-50 p-8 text-center shadow-sm border border-gray-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
            Start your path
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Ready to continue learning?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-700">
            Go to your dashboard to review saved words, practice grammar, and
            keep building your English step by step.
          </p>

          <Button
            variant="gold"
            className="mt-6 px-5 py-2 rounded-md font-medium"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </section>
    </div>
  );
}
