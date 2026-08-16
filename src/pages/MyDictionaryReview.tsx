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
import PageStatus from "../components/PageStatus";
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
type SaveStatus = "idle" | "saving" | "saved" | "error";

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
  const [loadAttempt, setLoadAttempt] = useState(0);

  const [input, setInput] = useState("");
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>([]);
  const [practiceType, setPracticeType] = useState<PracticeType>("mcq");
  const [selected, setSelected] = useState<string | null>(null);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
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
  }, [user, topicParam, levelParam, loadAttempt]);

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
    setSaveStatus("idle");
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

  const saveReviewSession = useCallback(async () => {
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
    setSaveStatus("saving");

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
      setSaveStatus("saved");
    } catch (error) {
      saveStartedRef.current = false;
      setSaveStatus("error");
      console.error("Failed to save review session:", error);
    }
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

  useEffect(() => {
    void saveReviewSession();
  }, [saveReviewSession]);

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
        <PageHeader
          eyebrow="My Dictionary Review"
          title="Review saved words"
          className="mb-6"
        />
        <PageStatus
          kind="empty"
          title="Sign in to start a review"
          message="Your review session is created from the words saved to your account."
          actions={[
            {
              label: "Go to Login",
              onClick: () => navigate("/login"),
              variant: "primary",
            },
          ]}
        />
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="My Dictionary Review"
          title="Review saved words"
          className="mb-6"
        />
        <PageStatus
          kind="loading"
          title="Preparing your review session"
          message="We are loading and shuffling your saved words."
        />
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="My Dictionary Review"
          title="Review saved words"
          className="mb-6"
        />
        <PageStatus
          kind="error"
          title="Your review could not be prepared"
          message={loadError}
          actions={[
            {
              label: "Try again",
              onClick: () => setLoadAttempt((previous) => previous + 1),
              variant: "primary",
            },
            {
              label: "← Back to My Dictionary",
              onClick: () => navigate("/my-dictionary"),
            },
          ]}
        />
      </PageShell>
    );
  }

  if (allWords.length === 0) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="My Dictionary Review"
          title="Review saved words"
          className="mb-6"
        />
        <PageStatus
          kind="empty"
          title={
            topicParam || levelParam
              ? "No words match this review"
              : "No saved words to review"
          }
          message={
            topicParam || levelParam
              ? "Return to My Dictionary and choose a different topic or level."
              : "Save vocabulary words first, then return here to practise them."
          }
          actions={[
            {
              label: "← Back to My Dictionary",
              onClick: () => navigate("/my-dictionary"),
              variant: "secondary",
            },
          ]}
        />
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
          >
            {saveStatus === "saving" && (
              <p
                role="status"
                className="mt-4 text-sm text-[var(--color-text-secondary)]"
              >
                Saving this result...
              </p>
            )}

            {saveStatus === "saved" && (
              <p
                role="status"
                className="mt-4 text-sm font-medium text-green-700"
              >
                Result saved to your dashboard.
              </p>
            )}

            {saveStatus === "error" && (
              <div className="mt-4 border-t border-[var(--color-border-soft)] pt-4">
                <p role="alert" className="text-sm text-red-700">
                  Your score is safe on this page, but it could not be added to
                  your dashboard.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => void saveReviewSession()}
                >
                  Try saving again
                </Button>
              </div>
            )}
          </QuizResultCard>
        </div>
      </PageShell>
    );
  }

  if (!current) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="My Dictionary Review"
          title="Review saved words"
          className="mb-6"
        />
        <PageStatus
          kind="empty"
          title="No review words found"
          message="There are no words available for this review."
          actions={[
            {
              label: "← Back to My Dictionary",
              onClick: () => navigate("/my-dictionary"),
            },
          ]}
        />
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
