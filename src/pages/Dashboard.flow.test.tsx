import { fireEvent, render, screen } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../context/useAuth";
import Dashboard from "./Dashboard";

const dashboardMocks = vi.hoisted(() => ({
  getReviewSessions: vi.fn(),
  getSavedWordsCount: vi.fn(),
}));

vi.mock("../services/reviewSessions", () => ({
  getReviewSessions: dashboardMocks.getReviewSessions,
}));

vi.mock("../services/savedWords", () => ({
  getSavedWordsCount: dashboardMocks.getSavedWordsCount,
}));

const user = { id: "user-1", email: "learner@example.com" } as User;

function renderDashboard() {
  return render(
    <AuthContext.Provider value={{ user, isAuthLoading: false }}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vocabulary" element={<p>Vocabulary destination</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("Dashboard user flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dashboardMocks.getReviewSessions.mockResolvedValue([]);
  });

  it("retries a failed request and guides a new user to vocabulary", async () => {
    dashboardMocks.getSavedWordsCount
      .mockRejectedValueOnce(new Error("Database unavailable"))
      .mockResolvedValueOnce(0);

    renderDashboard();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading your progress",
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Your progress could not be loaded",
    );

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("heading", { name: "No review history yet" }),
    ).toBeVisible();
    expect(dashboardMocks.getSavedWordsCount).toHaveBeenCalledTimes(2);
    expect(dashboardMocks.getReviewSessions).toHaveBeenCalledTimes(2);

    fireEvent.click(
      screen.getByRole("button", { name: "Build My Dictionary" }),
    );

    expect(screen.getByText("Vocabulary destination")).toBeVisible();
  });
});
