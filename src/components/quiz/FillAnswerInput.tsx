import type { KeyboardEvent } from "react";

type FillAnswerInputProps = {
  value: string;
  checked: boolean;
  questionPromptId: string;
  feedbackId: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function FillAnswerInput({
  value,
  checked,
  questionPromptId,
  feedbackId,
  placeholder = "Type your answer...",
  onChange,
  onSubmit,
}: FillAnswerInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={handleKeyDown}
      aria-labelledby={questionPromptId}
      aria-describedby={feedbackId}
      autoComplete="off"
      className="border rounded-md px-3 py-2 w-full"
      placeholder={placeholder}
      disabled={checked}
    />
  );
}
