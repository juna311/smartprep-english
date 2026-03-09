import { useState } from "react";
import Button from "./Button";

interface VocabularyWordProps {
  id: string;
  word: string;
  translation: string;
  example: string;
  image?: string;
  association?: string;
}

export default function VocabularyWordCard({
  id,
  word,
  translation,
  example,
  image,
  association
}: VocabularyWordProps) {

  const [showTranslation, setShowTranslation] = useState(false);

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">

        {image && (
            <img
            src={image}
            alt={word}
            className="w-full h-40 object-cover rounded-md"
            />
      )}

        <header className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{word}</h2>

            <div className="flex gap-2">
            <Button
                onClick={() => speak(word)}
                className="text-lg"
                aria-label="Play pronunciation"
            >
                🔊
            </Button>

            <Button
                className="text-lg"
                aria-label="Add to dictionary"
            >
                ⭐
            </Button>
            </div>
        </header>

        <Button
            onClick={() => setShowTranslation(!showTranslation)}
            className="text-[var(--color-brand-blue)] hover:underline text-left"
            >
            {showTranslation ? "Hide translation" : "Show translation"}
        </Button>

            {showTranslation && (
            <p className="text-gray-700 font-medium">
                {translation}
            </p>
            )}

        <p className="text-gray-700 italic">
            {example}
        </p>

        {association && (
            <p className="text-sm text-gray-500">
            💡 {association}
            </p>
        )}

    </article>
  );
}