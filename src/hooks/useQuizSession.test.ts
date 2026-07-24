import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useQuizSession } from "./useQuizSession";

const questions = ["question one", "question two"];

describe("useQuizSession", () => {
  it("starts at the first unchecked question with a score of zero", () => {
    const { result } = renderHook(() => useQuizSession(questions));

    expect(result.current.currentQuestion).toBe("question one");
    expect(result.current.index).toBe(0);
    expect(result.current.checked).toBe(false);
    expect(result.current.score).toBe(0);
    expect(result.current.total).toBe(2);
  });

  it("counts a correct answer only once", () => {
    const { result } = renderHook(() => useQuizSession(questions));

    act(() => {
      result.current.checkAnswer(true);
      result.current.checkAnswer(true);
    });

    expect(result.current.checked).toBe(true);
    expect(result.current.score).toBe(1);
  });

  it("moves to the next question and clears page-specific answer state", () => {
    const onQuestionReset = vi.fn();
    const { result } = renderHook(() =>
      useQuizSession(questions, { onQuestionReset }),
    );

    act(() => {
      result.current.checkAnswer(false);
    });

    act(() => {
      result.current.goNext();
    });

    expect(result.current.currentQuestion).toBe("question two");
    expect(result.current.index).toBe(1);
    expect(result.current.checked).toBe(false);
    expect(onQuestionReset).toHaveBeenCalledOnce();
  });

  it("shows results after the last question and can reset the session", () => {
    const onQuestionReset = vi.fn();
    const { result } = renderHook(() =>
      useQuizSession(questions, { onQuestionReset }),
    );

    act(() => {
      result.current.goNext();
    });

    act(() => {
      result.current.goNext();
    });

    expect(result.current.isFinished).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.currentQuestion).toBe("question one");
    expect(result.current.index).toBe(0);
    expect(result.current.isFinished).toBe(false);
    expect(result.current.score).toBe(0);
    expect(onQuestionReset).toHaveBeenCalledTimes(2);
  });
});
