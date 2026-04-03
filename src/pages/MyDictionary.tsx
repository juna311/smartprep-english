import PageContainer from "../components/PageContainer";

export default function MyDictionary() {

    const savedWords = [
        {
          id: "1",
          word: "recipe",
          translation: "レシピ",
          example: "This recipe is easy.",
        },
        {
          id: "2",
          word: "ingredient",
          translation: "材料",
          example: "Flour is an ingredient.",
        },
      ];

  return (
    <div className="min-h-screen bg-white sm:bg-[var(--color-brand-blue)] py-6 sm:py-10 md:py-16">
      <PageContainer className="bg-white rounded-none sm:rounded-2xl md:rounded-3xl shadow-none sm:shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 sm:min-h-[70vh]">
        
        <header className="mb-6">
          <p className="text-xs uppercase tracking-wide font-semibold text-[var(--color-brand-blue)]">
            My Dictionary
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            Saved Words
          </h1>

          <p className="text-gray-700 mt-2">
            Your personal vocabulary list.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedWords.map((word) => (
                <div key={word.id} className="border p-4 rounded-md">
                <h2 className="font-bold">{word.word}</h2>
                <p>{word.translation}</p>
                <p className="text-sm text-gray-600">{word.example}</p>
                </div>
            ))}
        </section>

      </PageContainer>
    </div>
  );
} 