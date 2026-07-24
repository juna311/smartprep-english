import { useState } from "react";
import { FaLightbulb, FaRegStar, FaStar, FaVolumeUp } from "react-icons/fa";
import toast from "react-hot-toast";
import Button from "./Button";
import { useAuth } from "../context/useAuth";
import {
  addSavedWord,
  isDuplicateSavedWordError,
  removeSavedWord,
} from "../services/savedWords";
import { getErrorMessage } from "../utils/errors";

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
  isSaved = false,
  onToggleSaved,
}: VocabularyWordProps) {
  const { user } = useAuth();

  const [showTranslation, setShowTranslation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleToggleSaved = async () => {
    if (!user) {
      toast("Please log in to save words.");
      return;
    }

    setIsSaving(true);

    try {
      if (isSaved) {
        await removeSavedWord(user.id, id);
        onToggleSaved(false);
        toast("Removed from My Dictionary");
        return;
      }

      await addSavedWord({
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

      onToggleSaved(true);
      toast.success("Saved to My Dictionary");
    } catch (error) {
      if (isDuplicateSavedWordError(error)) {
        onToggleSaved(true);
        toast("Already saved");
        return;
      }

      toast.error(getErrorMessage(error, "Could not update your dictionary."));
    } finally {
      setIsSaving(false);
    }
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
            <FaVolumeUp aria-hidden="true" />
          </Button>

          <Button
            onClick={handleToggleSaved}
            disabled={isSaving}
            className="text-lg disabled:opacity-50"
            aria-label={
              isSaved ? "Remove from dictionary" : "Add to dictionary"
            }
          >
            {isSaved ? (
              <FaStar aria-hidden="true" />
            ) : (
              <FaRegStar aria-hidden="true" />
            )}
          </Button>
        </div>
      </header>

      <Button
        onClick={() => setShowTranslation((prev) => !prev)}
        className="text-[var(--color-brand-navy)] hover:underline text-left"
      >
        {showTranslation ? "Hide translation" : "Show translation"}
      </Button>

      {showTranslation && (
        <p className="text-gray-700 font-medium">{translation}</p>
      )}

      <p className="text-gray-700 italic">{example}</p>

      {association && (
        <p className="flex items-start gap-2 text-sm text-gray-500">
          <FaLightbulb className="mt-0.5 flex-none" aria-hidden="true" />
          <span>{association}</span>
        </p>
      )}
    </article>
  );
}
