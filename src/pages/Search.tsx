import { Link, useSearchParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { searchContent } from "../lib/search";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const results = searchContent(query);

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-navy)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        <header className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
            Search
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            {query.trim() ? `Results for "${query}"` : "Search EigoPath"}
          </h1>
          <p className="text-gray-700 max-w-2xl text-sm md:text-base">
            Find grammar lessons and vocabulary words by keyword, topic, or level.
          </p>
        </header>

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
      </PageContainer>
    </div>
  );
}
