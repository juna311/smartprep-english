import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addSavedWord,
  getSavedWordIds,
  getSavedWords,
  getSavedWordsCount,
  isDuplicateSavedWordError,
  removeSavedWord,
} from "./savedWords";
import type { NewSavedWord, SavedWord } from "../types/database.types";

const databaseMocks = vi.hoisted(() => ({
  delete: vi.fn(),
  eq: vi.fn(),
  from: vi.fn(),
  insert: vi.fn(),
  order: vi.fn(),
  select: vi.fn(),
}));

vi.mock("../supabase/client", () => ({
  supabase: {
    from: databaseMocks.from,
  },
}));

const savedWord: SavedWord = {
  association: null,
  created_at: "2026-07-05T08:00:00.000Z",
  example: "I booked a flight.",
  id: "saved-1",
  image: null,
  level: "beginner",
  topic_id: "travel",
  translation: "フライト",
  user_id: "user-1",
  word: "flight",
  word_id: "travel-flight",
};

const newSavedWord: NewSavedWord = {
  association: null,
  example: savedWord.example,
  image: null,
  level: savedWord.level,
  topic_id: savedWord.topic_id,
  translation: savedWord.translation,
  user_id: savedWord.user_id,
  word: savedWord.word,
  word_id: savedWord.word_id,
};

describe("saved-word data functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns saved words in the order supplied by Supabase", async () => {
    databaseMocks.from.mockReturnValue({ select: databaseMocks.select });
    databaseMocks.select.mockReturnValue({ eq: databaseMocks.eq });
    databaseMocks.eq.mockReturnValue({ order: databaseMocks.order });
    databaseMocks.order.mockResolvedValue({
      data: [savedWord],
      error: null,
    });

    await expect(getSavedWords("user-1")).resolves.toEqual([savedWord]);

    expect(databaseMocks.from).toHaveBeenCalledWith("saved_words");
    expect(databaseMocks.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(databaseMocks.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
  });

  it("turns saved-word rows into an array of word IDs", async () => {
    databaseMocks.from.mockReturnValue({ select: databaseMocks.select });
    databaseMocks.select.mockReturnValue({ eq: databaseMocks.eq });
    databaseMocks.eq.mockResolvedValue({
      data: [{ word_id: "word-1" }, { word_id: "word-2" }],
      error: null,
    });

    await expect(getSavedWordIds("user-1")).resolves.toEqual([
      "word-1",
      "word-2",
    ]);
  });

  it("returns zero when a count response has no count value", async () => {
    databaseMocks.from.mockReturnValue({ select: databaseMocks.select });
    databaseMocks.select.mockReturnValue({ eq: databaseMocks.eq });
    databaseMocks.eq.mockResolvedValue({ count: null, error: null });

    await expect(getSavedWordsCount("user-1")).resolves.toBe(0);
  });

  it("inserts a new saved word", async () => {
    databaseMocks.from.mockReturnValue({ insert: databaseMocks.insert });
    databaseMocks.insert.mockResolvedValue({ error: null });

    await addSavedWord(newSavedWord);

    expect(databaseMocks.insert).toHaveBeenCalledWith(newSavedWord);
  });

  it("deletes only the selected word belonging to the current user", async () => {
    const wordIdEq = vi.fn().mockResolvedValue({ error: null });
    databaseMocks.from.mockReturnValue({ delete: databaseMocks.delete });
    databaseMocks.delete.mockReturnValue({ eq: databaseMocks.eq });
    databaseMocks.eq.mockReturnValue({ eq: wordIdEq });

    await removeSavedWord("user-1", "word-1");

    expect(databaseMocks.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(wordIdEq).toHaveBeenCalledWith("word_id", "word-1");
  });

  it("throws the database error so the caller can decide how to display it", async () => {
    const databaseError = { code: "500", message: "Database unavailable" };
    databaseMocks.from.mockReturnValue({ select: databaseMocks.select });
    databaseMocks.select.mockReturnValue({ eq: databaseMocks.eq });
    databaseMocks.eq.mockReturnValue({ order: databaseMocks.order });
    databaseMocks.order.mockResolvedValue({
      data: null,
      error: databaseError,
    });

    await expect(getSavedWords("user-1")).rejects.toBe(databaseError);
  });

  it("recognizes PostgreSQL's unique-constraint error code", () => {
    expect(isDuplicateSavedWordError({ code: "23505" })).toBe(true);
    expect(isDuplicateSavedWordError({ code: "500" })).toBe(false);
    expect(isDuplicateSavedWordError(null)).toBe(false);
  });
});
