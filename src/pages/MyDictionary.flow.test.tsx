import { fireEvent, render, screen } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../context/useAuth";
import type { SavedWord } from "../types/database.types";
import MyDictionary from "./MyDictionary";

const savedWordsMocks = vi.hoisted(() => ({
  addSavedWord: vi.fn(),
  getSavedWords: vi.fn(),
  removeSavedWord: vi.fn(),
}));

vi.mock("../services/savedWords", () => ({
  ...savedWordsMocks,
  isDuplicateSavedWordError: vi.fn(() => false),
}));

const user = { id: "user-1", email: "learner@example.com" } as User;

const savedWords: SavedWord[] = [
  {
    association: null,
    created_at: "2026-01-02T00:00:00.000Z",
    example: "I eat an apple every morning.",
    id: "saved-apple",
    image: null,
    level: "beginner",
    topic_id: "food",
    translation: "りんご",
    user_id: user.id,
    word: "apple",
    word_id: "food-b-apple",
  },
  {
    association: "a journey",
    created_at: "2026-01-01T00:00:00.000Z",
    example: "We booked a flight to Tokyo.",
    id: "saved-flight",
    image: null,
    level: "intermediate",
    topic_id: "travel",
    translation: "フライト",
    user_id: user.id,
    word: "flight",
    word_id: "travel-i-flight",
  },
];

function CurrentLocation() {
  const location = useLocation();
  return <p>{`${location.pathname}${location.search}`}</p>;
}

function renderDictionary() {
  return render(
    <AuthContext.Provider value={{ user, isAuthLoading: false }}>
      <MemoryRouter initialEntries={["/my-dictionary"]}>
        <Routes>
          <Route path="/my-dictionary" element={<MyDictionary />} />
          <Route
            path="/my-dictionary/review"
            element={
              <>
                <p>Review destination</p>
                <CurrentLocation />
              </>
            }
          />
          <Route path="/vocabulary" element={<p>Vocabulary destination</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("My Dictionary user flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads words, explains an empty filter result, and clears the filters", async () => {
    savedWordsMocks.getSavedWords.mockResolvedValue(savedWords);

    renderDictionary();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading your saved vocabulary",
    );
    expect(await screen.findByRole("heading", { name: "apple" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "flight" })).toBeVisible();

    fireEvent.change(screen.getByLabelText("Topic"), {
      target: { value: "food" },
    });
    fireEvent.change(screen.getByLabelText("Level"), {
      target: { value: "advanced" },
    });

    expect(
      screen.getByRole("heading", { name: "No words match these filters" }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(screen.getByRole("heading", { name: "apple" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "flight" })).toBeVisible();
  });

  it("retries a failed request and then opens a filtered review", async () => {
    savedWordsMocks.getSavedWords
      .mockRejectedValueOnce(new Error("Database unavailable"))
      .mockResolvedValueOnce(savedWords);

    renderDictionary();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Your dictionary could not be loaded",
    );

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: "apple" })).toBeVisible();
    expect(savedWordsMocks.getSavedWords).toHaveBeenCalledTimes(2);

    fireEvent.change(screen.getByLabelText("Topic"), {
      target: { value: "travel" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Review filtered words" }),
    );

    expect(screen.getByText("Review destination")).toBeVisible();
    expect(
      screen.getByText("/my-dictionary/review?topic=travel"),
    ).toBeVisible();
  });

  it("guides a new user from an empty dictionary to vocabulary lessons", async () => {
    savedWordsMocks.getSavedWords.mockResolvedValue([]);

    renderDictionary();

    expect(
      await screen.findByRole("heading", { name: "No saved words yet" }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Browse Vocabulary" }));

    expect(screen.getByText("Vocabulary destination")).toBeVisible();
  });
});
