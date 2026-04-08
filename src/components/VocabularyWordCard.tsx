import { useEffect, useState } from "react";
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
  isSaved?: boolean;
  onToggleSaved: (nextSaved: boolean) => void;
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
  isSaved: isSavedProp = false,
  onToggleSaved,
}: VocabularyWordProps) {
  const { user } = useAuth();

  const [showTranslation, setShowTranslation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(isSavedProp);

  useEffect(() => {
    setIsSaved(isSavedProp);
  }, [isSavedProp]);

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleToggleSaved = async () => {
    if (!user) {
      alert("Please log in to save words.");
      return;
    }
  
    setIsSaving(true);
  
    if (isSaved) {
      const { error } = await supabase
        .from("saved_words")
        .delete()
        .eq("user_id", user.id)
        .eq("word_id", id);
  
      setIsSaving(false);
  
      if (error) {
        alert(error.message);
        return;
      }
  
      onToggleSaved(false);
      return;
    }
  
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
        onToggleSaved(true);
        return;
      }
  
      alert(error.message);
      return;
    }
  
    onToggleSaved(true);
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
            onClick={handleToggleSaved}
            disabled={isSaving}
            className="text-lg disabled:opacity-50"
            aria-label={isSaved ? "Remove from dictionary" : "Add to dictionary"}
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