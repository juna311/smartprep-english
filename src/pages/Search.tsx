import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import { searchContent } from "../lib/search";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const results = searchContent(query);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Search"
        title={query.trim() ? `Results for "${query}"` : "Search EigoPath"}
        description="Find grammar lessons and vocabulary words by keyword, topic, or level."
        className="mb-6 sm:mb-8"
      />

      {!query.trim() ? (
        <p className="text-gray-600">Enter a search term from the header.</p>
      ) : results.length === 0 ? (
        <p className="text-gray-600">
          No results found. Try a word like apple, present, food, or beginner.
        </p>
      ) : (
        <section className="grid gap-4">
          {results.map((result) => (
            <Link
              key={result.id}
              to={result.to}
              className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-brand-navy)] hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
                {result.category}
              </p>
              <h2 className="mt-1 text-xl font-bold">{result.title}</h2>
              <p className="mt-2 text-gray-700">{result.description}</p>
            </Link>
          ))}
        </section>
      )}
    </PageShell>
  );
}
