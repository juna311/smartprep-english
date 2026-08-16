import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../context/useAuth";
import type { SavedWord } from "../types/database.types";
import MyDictionaryReview from "./MyDictionaryReview";

const serviceMocks = vi.hoisted(() => ({
  addReviewSession: vi.fn(),
  getSavedWords: vi.fn(),
}));

vi.mock("../services/reviewSessions", () => ({
  addReviewSession: serviceMocks.addReviewSession,
}));

vi.mock("../services/savedWords", () => ({
  getSavedWords: serviceMocks.getSavedWords,
}));

const user = { id: "user-1", email: "learner@example.com" } as User;

const savedApple: SavedWord = {
  association: null,
  created_at: "2026-01-01T00:00:00.000Z",
  example: "I eat an apple every morning.",
  id: "saved-apple",
  image: null,
  level: "beginner",
  topic_id: "food",
  translation: "りんご",
  user_id: user.id,
  word: "apple",
  word_id: "food-b-apple",
};

function renderReview() {
  return render(
    <AuthContext.Provider value={{ user, isAuthLoading: false }}>
      <MemoryRouter initialEntries={["/my-dictionary/review"]}>
        <Routes>
          <Route
            path="/my-dictionary/review"
            element={<MyDictionaryReview />}
          />
          <Route
            path="/my-dictionary"
            element={<p>Dictionary destination</p>}
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("My Dictionary review user flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    serviceMocks.addReviewSession.mockResolvedValue(undefined);
  });

  it("answers a question, shows the result, and saves the completed session", async () => {
    serviceMocks.getSavedWords.mockResolvedValue([savedApple]);

    renderReview();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Preparing your review session",
    );
    expect(await screen.findByText("りんご")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "apple" }));
    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));

    expect(screen.getByText("Correct.")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(
      screen.getByText((_, element) => element?.textContent === "Score: 1 / 1"),
    ).toBeVisible();

    await waitFor(() => {
      expect(serviceMocks.addReviewSession).toHaveBeenCalledWith({
        user_id: user.id,
        mode: "mcq",
        review_label: "All saved words",
        total_questions: 1,
        correct_answers: 1,
        needs_review_count: 0,
      });
    });
  });

  it("retries when the review words fail to load", async () => {
    serviceMocks.getSavedWords
      .mockRejectedValueOnce(new Error("Database unavailable"))
      .mockResolvedValueOnce([savedApple]);

    renderReview();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Your review could not be prepared",
    );

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("りんご")).toBeVisible();
    expect(serviceMocks.getSavedWords).toHaveBeenCalledTimes(2);
  });

  it("reports a failed result save and lets the user retry it", async () => {
    serviceMocks.getSavedWords.mockResolvedValue([savedApple]);
    serviceMocks.addReviewSession
      .mockRejectedValueOnce(new Error("Database unavailable"))
      .mockResolvedValueOnce(undefined);

    renderReview();

    expect(await screen.findByText("りんご")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "apple" }));
    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "could not be added to your dashboard",
    );

    fireEvent.click(screen.getByRole("button", { name: "Try saving again" }));

    expect(
      await screen.findByText("Result saved to your dashboard."),
    ).toBeVisible();
    expect(serviceMocks.addReviewSession).toHaveBeenCalledTimes(2);
  });
});
