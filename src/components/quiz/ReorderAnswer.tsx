import Button from "../Button";

export type ReorderToken = {
  id: string;
  value: string;
};

type ReorderAnswerProps = {
  tokens: readonly ReorderToken[];
  selectedTokens: readonly ReorderToken[];
  checked: boolean;
  onToggleToken: (token: ReorderToken) => void;
  onReset: () => void;
};

export default function ReorderAnswer({
  tokens,
  selectedTokens,
  checked,
  onToggleToken,
  onReset,
}: ReorderAnswerProps) {
  return (
    <div className="flex flex-col gap-4">
      <div
        aria-live="polite"
        aria-label="Current sentence"
        className="min-h-[48px] border rounded-md p-3 bg-gray-50"
      >
        {selectedTokens.length === 0
          ? "Click words below to build the sentence"
          : selectedTokens.map((token) => token.value).join(" ")}
      </div>

      <div
        role="group"
        aria-label="Available words"
        className="flex flex-wrap gap-2"
      >
        {tokens.map((token) => {
          const isSelected = selectedTokens.some(
            (selectedToken) => selectedToken.id === token.id,
          );

          return (
            <button
              key={token.id}
              type="button"
              onClick={() => onToggleToken(token)}
              disabled={checked}
              aria-pressed={isSelected}
              className={`border rounded-md px-3 py-1 transition disabled:cursor-not-allowed ${
                isSelected
                  ? "border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)]"
                  : checked
                    ? "border-gray-300 bg-gray-50 text-gray-500 opacity-60"
                    : "border-gray-300 hover:border-[var(--color-brand-navy)] hover:bg-gray-50"
              }`}
            >
              {token.value}
            </button>
          );
        })}
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="w-fit"
        onClick={onReset}
        disabled={checked}
      >
        Reset
      </Button>
    </div>
  );
}
