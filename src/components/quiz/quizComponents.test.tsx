import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FillAnswerInput from "./FillAnswerInput";
import MultipleChoiceAnswers from "./MultipleChoiceAnswers";
import QuizActions from "./QuizActions";
import QuizFeedback from "./QuizFeedback";
import ReorderAnswer, { type ReorderToken } from "./ReorderAnswer";

describe("quiz answer components", () => {
  it("selects a multiple choice answer", () => {
    const handleSelect = vi.fn();

    render(
      <>
        <p id="question">Choose one</p>
        <MultipleChoiceAnswers
          choices={["first", "second"]}
          correctIndex={1}
          selected={null}
          checked={false}
          questionPromptId="question"
          onSelect={handleSelect}
        />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "second" }));

    expect(handleSelect).toHaveBeenCalledWith("second");
  });

  it("prevents multiple choice changes after the answer is checked", () => {
    const handleSelect = vi.fn();

    render(
      <>
        <p id="question">Choose one</p>
        <MultipleChoiceAnswers
          choices={["first", "second"]}
          correctIndex={1}
          selected="first"
          checked
          questionPromptId="question"
          onSelect={handleSelect}
        />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "second" }));

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("submits a fill answer when Enter is pressed", () => {
    const handleChange = vi.fn();
    const handleSubmit = vi.fn();

    render(
      <>
        <p id="question">Type the missing word</p>
        <p id="feedback">Feedback</p>
        <FillAnswerInput
          value="who"
          checked={false}
          questionPromptId="question"
          feedbackId="feedback"
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </>,
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "that" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleChange).toHaveBeenCalledWith("that");
    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  it("shows feedback only after an answer has been checked", () => {
    const { rerender } = render(
      <QuizFeedback
        feedbackId="feedback"
        checked={false}
        isCorrect={false}
        correctAnswer="who"
        explanation="Use who for a person."
      />,
    );

    expect(
      screen.getByText("Check your answer to see feedback."),
    ).toBeVisible();

    rerender(
      <QuizFeedback
        feedbackId="feedback"
        checked
        isCorrect={false}
        correctAnswer="who"
        explanation="Use who for a person."
      />,
    );

    expect(screen.getByText("Not quite.")).toBeVisible();
    expect(screen.getByText("who")).toBeVisible();
    expect(screen.getByText("Use who for a person.")).toBeVisible();
  });

  it("toggles reorder tokens and shows the selected sentence", () => {
    const tokens: ReorderToken[] = [
      { id: "token-1", value: "It" },
      { id: "token-2", value: "was" },
    ];
    const handleToggleToken = vi.fn();

    render(
      <ReorderAnswer
        tokens={tokens}
        selectedTokens={[tokens[0]]}
        checked={false}
        onToggleToken={handleToggleToken}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Current sentence")).toHaveTextContent("It");

    fireEvent.click(screen.getByRole("button", { name: "was" }));

    expect(handleToggleToken).toHaveBeenCalledWith(tokens[1]);
  });

  it("switches quiz actions from checking to moving next", () => {
    const handleCheck = vi.fn();
    const handleNext = vi.fn();

    const { rerender } = render(
      <QuizActions
        checked={false}
        canCheck
        backLabel="Back"
        onCheck={handleCheck}
        onNext={handleNext}
        onBack={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
    expect(handleCheck).toHaveBeenCalledOnce();

    rerender(
      <QuizActions
        checked
        canCheck
        backLabel="Back"
        onCheck={handleCheck}
        onNext={handleNext}
        onBack={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(handleNext).toHaveBeenCalledOnce();
  });
});
