import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";
import QuizProgress from "../components/QuizProgress";
import QuizResultCard from "../components/QuizResultCard";
import FillAnswerInput from "../components/quiz/FillAnswerInput";
import MultipleChoiceAnswers from "../components/quiz/MultipleChoiceAnswers";
import QuizActions from "../components/quiz/QuizActions";
import QuizFeedback from "../components/quiz/QuizFeedback";
import QuizQuestionCard from "../components/quiz/QuizQuestionCard";
import { useAuth } from "../context/useAuth";
import { VOCABULARY_TOPICS } from "../data/vocabulary";
import { useQuizSession } from "../hooks/useQuizSession";
import { addReviewSession } from "../services/reviewSessions";
import { getSavedWords } from "../services/savedWords";
import type { SavedWord } from "../types/database.types";
import { normalizeAnswer, shuffleArray } from "../utils/quiz";

type VocabularyChoiceWord = {
  id: string;
  word: string;
};

type PracticeType = "typing" | "mcq";

const formatLabel = (text: string) =>
  text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function MyDictionaryReview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const answerPromptId = useId();
  const feedbackId = useId();

  const topicParam = searchParams.get("topic");
  const levelParam = searchParams.get("level");

  const reviewLabel =
    topicParam && levelParam
      ? `${formatLabel(topicParam)} • ${formatLabel(levelParam)}`
      : topicParam
        ? formatLabel(topicParam)
        : levelParam
          ? formatLabel(levelParam)
          : "All saved words";

  const [allWords, setAllWords] = useState<SavedWord[]>([]);
  const [sessionWords, setSessionWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>([]);
  const [practiceType, setPracticeType] = useState<PracticeType>("mcq");
  const [selected, setSelected] = useState<string | null>(null);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const saveStartedRef = useRef(false);

  const resetAnswerState = useCallback(() => {
    setInput("");
    setSelected(null);
  }, []);

  const {
    checked,
    checkAnswer,
    currentQuestion: current,
    goNext,
    index,
    isFinished,
    progressPercent,
    reset,
    score,
    total,
  } = useQuizSession(sessionWords, {
    onQuestionReset: resetAnswerState,
  });

  const allVocabularyChoices = useMemo<VocabularyChoiceWord[]>(() => {
    const flattened = VOCABULARY_TOPICS.flatMap((topic) =>
      Object.values(topic.levels).flatMap((levelWords) =>
        levelWords.map((word) => ({
          id: word.id,
          word: word.word,
        })),
      ),
    );

    const uniqueById = new Map(flattened.map((word) => [word.id, word]));
    return Array.from(uniqueById.values());
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchSavedWords = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(null);

      try {
        let words = await getSavedWords(user.id);

        if (topicParam) {
          words = words.filter((word) => word.topic_id === topicParam);
        }

        if (levelParam) {
          words = words.filter((word) => word.level === levelParam);
        }

        if (!ignore) {
          setAllWords(words);
          setSessionWords(shuffleArray(words));
        }
      } catch (error) {
        console.error("Failed to fetch saved words:", error);

        if (!ignore) {
          setLoadError(
            "We could not load your review words. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchSavedWords();

    return () => {
      ignore = true;
    };
  }, [user, topicParam, levelParam]);

  const generateChoices = useCallback(
    (current: SavedWord) => {
      const shuffledOthers = shuffleArray(
        allVocabularyChoices.filter((w) => w.id !== current.word_id),
      );

      const uniqueChoices = [current.word];

      for (const candidate of shuffledOthers) {
        if (!uniqueChoices.includes(candidate.word)) {
          uniqueChoices.push(candidate.word);
        }

        if (uniqueChoices.length === 4) break;
      }

      return shuffleArray(uniqueChoices);
    },
    [allVocabularyChoices],
  );

  const isCorrect = current
    ? practiceType === "mcq"
      ? selected === current.word
      : normalizeAnswer(input) === normalizeAnswer(current.word)
    : false;

  const canCheck =
    practiceType === "mcq" ? selected !== null : input.trim().length > 0;

  const reviewWords = useMemo(() => {
    return allWords.filter((word) => needsReviewIds.includes(word.word_id));
  }, [allWords, needsReviewIds]);

  const startReviewSession = (words: SavedWord[]) => {
    setSessionWords(shuffleArray(words));
    setNeedsReviewIds([]);
    setHasSavedSession(false);
    saveStartedRef.current = false;
    reset();
  };

  const handlePracticeTypeChange = (nextPracticeType: PracticeType) => {
    if (checked) return;

    setPracticeType(nextPracticeType);
    resetAnswerState();
  };

  const handleCheckAnswer = () => {
    if (!current || checked || !canCheck) return;

    if (!isCorrect) {
      setNeedsReviewIds((prev) =>
        prev.includes(current.word_id) ? prev : [...prev, current.word_id],
      );
    }

    checkAnswer(isCorrect, canCheck);
  };

  const handleRetryDifficultWords = () => {
    if (reviewWords.length === 0) return;

    startReviewSession(reviewWords);
  };

  const handleTryAgainAll = () => {
    startReviewSession(allWords);
  };

  useEffect(() => {
    const saveReviewSession = async () => {
      if (
        !user ||
        !isFinished ||
        hasSavedSession ||
        saveStartedRef.current ||
        total === 0
      ) {
        return;
      }

      saveStartedRef.current = true;

      try {
        await addReviewSession({
          user_id: user.id,
          mode: practiceType,
          review_label: reviewLabel,
          total_questions: total,
          correct_answers: score,
          needs_review_count: needsReviewIds.length,
        });

        setHasSavedSession(true);
      } catch (error) {
        saveStartedRef.current = false;
        console.error("Failed to save review session:", error);
      }
    };

    void saveReviewSession();
  }, [
    user,
    isFinished,
    hasSavedSession,
    total,
    practiceType,
    reviewLabel,
    score,
    needsReviewIds.length,
  ]);

  const choices = useMemo(() => {
    if (!current || practiceType !== "mcq") return [];
    return generateChoices(current);
  }, [current, practiceType, generateChoices]);

  const correctChoiceIndex = current ? choices.indexOf(current.word) : -1;

  const practiceTitle =
    practiceType === "mcq"
      ? "Japanese → English (Multiple Choice)"
      : "Japanese → English (Typing)";

  if (!user) {
    return (
      <PageShell>
        <p className="text-red-600 font-semibold">
          Please log in to review your saved words.
        </p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <p className="text-gray-700">Loading your review session...</p>
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell>
        <p role="alert" className="text-red-700">
          {loadError}
        </p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate("/my-dictionary")}
        >
          ← Back to My Dictionary
        </Button>
      </PageShell>
    );
  }

  if (allWords.length === 0) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="My Dictionary Review"
          title="Review saved words"
          description="You have no saved words yet. Save words first to start reviewing."
          className="mb-6"
        />
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate("/my-dictionary")}
        >
          ← Back to My Dictionary
        </Button>
      </PageShell>
    );
  }

  if (isFinished) {
    return (
      <PageShell centered>
        <div className="w-full max-w-xl">
          <PageHeader
            eyebrow="My Dictionary Review"
            title={`${reviewLabel} • Complete`}
            align="center"
            className="mb-8"
          />

          <QuizResultCard
            score={score}
            total={total}
            message={
              <>
                Needs review: <strong>{needsReviewIds.length}</strong>
              </>
            }
            actions={[
              {
                label: "Review all again",
                onClick: handleTryAgainAll,
                variant: "primary",
              },
              {
                label: "Review difficult words",
                onClick: handleRetryDifficultWords,
                disabled: reviewWords.length === 0,
              },
              {
                label: "← Back to My Dictionary",
                onClick: () => navigate("/my-dictionary"),
              },
            ]}
          />
        </div>
      </PageShell>
    );
  }

  if (!current) {
    return (
      <PageShell centered>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No review words found</h1>
          <p className="text-gray-700">
            There are no words available for this review.
          </p>

          <Button
            variant="secondary"
            size="md"
            className="mt-4"
            onClick={() => navigate("/my-dictionary")}
          >
            ← Back to My Dictionary
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="My Dictionary Review"
        title={practiceTitle}
        className="mb-6"
      >
        <QuizProgress
          index={index}
          total={total}
          score={score}
          progressPercent={progressPercent}
          label={reviewLabel}
          barClassName="bg-[var(--color-brand-navy)]"
        />
      </PageHeader>

      <QuizQuestionCard
        promptId={answerPromptId}
        eyebrow="Translation"
        prompt={current.translation}
        promptClassName="text-2xl mb-4"
        feedback={
          <QuizFeedback
            feedbackId={feedbackId}
            checked={checked}
            isCorrect={isCorrect}
            correctAnswer={current.word}
            explanation={<span className="italic">{current.example}</span>}
          />
        }
        actions={
          <QuizActions
            checked={checked}
            canCheck={canCheck}
            onCheck={handleCheckAnswer}
            onNext={goNext}
            onBack={() => navigate("/my-dictionary")}
            backLabel="← Back to My Dictionary"
          />
        }
      >
        {current.association && (
          <p className="text-sm text-gray-500 mb-4">{current.association}</p>
        )}

        <div className="flex gap-2 mb-4">
          <Button
            disabled={checked}
            onClick={() => handlePracticeTypeChange("mcq")}
            aria-pressed={practiceType === "mcq"}
            variant={practiceType === "mcq" ? "primary" : "secondary"}
            size="sm"
          >
            Multiple Choice
          </Button>

          <Button
            disabled={checked}
            onClick={() => handlePracticeTypeChange("typing")}
            aria-pressed={practiceType === "typing"}
            variant={practiceType === "typing" ? "primary" : "secondary"}
            size="sm"
          >
            Typing
          </Button>
        </div>

        {practiceType === "mcq" ? (
          <MultipleChoiceAnswers
            choices={choices}
            correctIndex={correctChoiceIndex}
            selected={selected}
            checked={checked}
            questionPromptId={answerPromptId}
            onSelect={setSelected}
          />
        ) : (
          <FillAnswerInput
            value={input}
            checked={checked}
            questionPromptId={answerPromptId}
            feedbackId={feedbackId}
            placeholder="Type the English word..."
            onChange={setInput}
            onSubmit={handleCheckAnswer}
          />
        )}
      </QuizQuestionCard>
    </PageShell>
  );
}
