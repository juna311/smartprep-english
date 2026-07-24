type MultipleChoiceAnswersProps = {
  choices: readonly string[];
  correctIndex: number;
  selected: string | null;
  checked: boolean;
  questionPromptId: string;
  onSelect: (choice: string) => void;
};

export default function MultipleChoiceAnswers({
  choices,
  correctIndex,
  selected,
  checked,
  questionPromptId,
  onSelect,
}: MultipleChoiceAnswersProps) {
  return (
    <div
      role="group"
      aria-labelledby={questionPromptId}
      className="flex flex-col gap-3"
    >
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          onClick={() => onSelect(choice)}
          disabled={checked}
          aria-pressed={selected === choice}
          className={`border rounded-md px-4 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-100 ${
            checked
              ? choice === choices[correctIndex]
                ? "border-green-600 bg-green-50 text-green-700"
                : selected === choice
                  ? "border-red-600 bg-red-50 text-red-700"
                  : "border-gray-300 bg-white text-gray-700"
              : selected === choice
                ? "border-[var(--color-brand-navy)] bg-[var(--color-brand-navy)]/10"
                : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
