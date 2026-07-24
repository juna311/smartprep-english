import { afterEach, describe, expect, it, vi } from "vitest";
import { createQuestionSet, normalizeAnswer, shuffleArray } from "./quiz";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("normalizeAnswer", () => {
  it("ignores capitalization and surrounding spaces", () => {
    expect(normalizeAnswer("  Hello WORLD  ")).toBe("hello world");
  });

  it("removes supported punctuation", () => {
    expect(normalizeAnswer("Is this correct?!")).toBe("is this correct");
  });

  it("turns repeated spaces into one space", () => {
    expect(normalizeAnswer("present     perfect")).toBe("present perfect");
  });
});

describe("shuffleArray", () => {
  it("returns the same items in a new array", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const original = ["first", "second", "third"];

    const shuffled = shuffleArray(original);

    expect(shuffled).not.toBe(original);
    expect([...shuffled].sort()).toEqual([...original].sort());
    expect(original).toEqual(["first", "second", "third"]);
  });

  it("also accepts a readonly array", () => {
    const items = ["grammar", "vocabulary"] as const;

    expect(shuffleArray(items)).toHaveLength(2);
  });
});

describe("createQuestionSet", () => {
  it("returns the requested number of shuffled questions", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const allQuestions = ["one", "two", "three", "four"];

    const questionSet = createQuestionSet(allQuestions, 3);

    expect(questionSet).toHaveLength(3);
    expect(
      questionSet.every((question) => allQuestions.includes(question)),
    ).toBe(true);
  });

  it("creates a new array without changing the source questions", () => {
    const allQuestions = ["one", "two", "three"];

    const questionSet = createQuestionSet(allQuestions, 3);

    expect(questionSet).not.toBe(allQuestions);
    expect(allQuestions).toEqual(["one", "two", "three"]);
  });
});
