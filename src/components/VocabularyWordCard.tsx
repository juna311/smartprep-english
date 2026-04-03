import { useState } from "react";
import Button from "./Button";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";

interface VocabularyWordProps {
  id: string;
  word: string;
  translation: string;
  example: string;
  topicId: string;
  level: string;
  image?: string;
  association?: string;
}

export default function VocabularyWordCard({
  id,
  word,
  translation,
  example,
  topicId,
  level,
  image,
  association,
}: VocabularyWordProps) {
  const { user } = useAuth();

  const [showTranslation, setShowTranslation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleSaveWord = async () => {
    if (!user) {
      alert("Please log in to save words.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.from("saved_words").insert({
      user_id: user.id,
      word_id: id,
      word,
      translation,
      example,
      image: image ?? null,
      association: association ?? null,
      topic_id: topicId,
      level,
    });

    setIsSaving(false);

    if (error) {
      if (error.code === "23505") {
        setIsSaved(true);
        return;
      }

      alert(error.message);
      return;
    }

    setIsSaved(true);
  };

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 transition hover:-translate-y-0.5 hover:shadow-md">
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
            onClick={handleSaveWord}
            disabled={isSaving || isSaved}
            className="text-lg disabled:opacity-50"
            aria-label="Add to dictionary"
          >
            {isSaved ? "⭐" : "☆"}
          </Button>
        </div>
      </header>

      <Button
        onClick={() => setShowTranslation((prev) => !prev)}
        className="text-[var(--color-brand-blue)] hover:underline text-left"
      >
        {showTranslation ? "Hide translation" : "Show translation"}
      </Button>

      {showTranslation && (
        <p className="text-gray-700 font-medium">{translation}</p>
      )}

      <p className="text-gray-700 italic">{example}</p>

      {association && (
        <p className="text-sm text-gray-500">💡 {association}</p>
      )}
    </article>
  );
}