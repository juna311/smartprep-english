import Button from "../Button";

type QuizActionsProps = {
  checked: boolean;
  canCheck: boolean;
  backLabel: string;
  onCheck: () => void;
  onNext: () => void;
  onBack: () => void;
};

export default function QuizActions({
  checked,
  canCheck,
  backLabel,
  onCheck,
  onNext,
  onBack,
}: QuizActionsProps) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      {!checked ? (
        <Button
          variant="primary"
          size="md"
          onClick={onCheck}
          disabled={!canCheck}
        >
          Check answer
        </Button>
      ) : (
        <Button variant="primary" size="md" onClick={onNext}>
          Next
        </Button>
      )}

      <Button variant="secondary" size="md" onClick={onBack}>
        {backLabel}
      </Button>
    </div>
  );
}
