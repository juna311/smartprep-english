import { beforeEach, describe, expect, it, vi } from "vitest";
import { addReviewSession, getReviewSessions } from "./reviewSessions";
import type { NewReviewSession, ReviewSession } from "../types/database.types";

const databaseMocks = vi.hoisted(() => ({
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

const reviewSession: ReviewSession = {
  correct_answers: 3,
  created_at: "2026-07-05T08:00:00.000Z",
  id: "session-1",
  mode: "mcq",
  needs_review_count: 1,
  review_label: "Travel",
  total_questions: 4,
  user_id: "user-1",
};

const newReviewSession: NewReviewSession = {
  correct_answers: reviewSession.correct_answers,
  mode: reviewSession.mode,
  needs_review_count: reviewSession.needs_review_count,
  review_label: reviewSession.review_label,
  total_questions: reviewSession.total_questions,
  user_id: reviewSession.user_id,
};

describe("review-session data functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns review sessions from newest to oldest", async () => {
    databaseMocks.from.mockReturnValue({ select: databaseMocks.select });
    databaseMocks.select.mockReturnValue({ eq: databaseMocks.eq });
    databaseMocks.eq.mockReturnValue({ order: databaseMocks.order });
    databaseMocks.order.mockResolvedValue({
      data: [reviewSession],
      error: null,
    });

    await expect(getReviewSessions("user-1")).resolves.toEqual([reviewSession]);

    expect(databaseMocks.from).toHaveBeenCalledWith("review_sessions");
    expect(databaseMocks.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
  });

  it("inserts a completed review session", async () => {
    databaseMocks.from.mockReturnValue({ insert: databaseMocks.insert });
    databaseMocks.insert.mockResolvedValue({ error: null });

    await addReviewSession(newReviewSession);

    expect(databaseMocks.insert).toHaveBeenCalledWith(newReviewSession);
  });

  it("passes a Supabase insert error back to the caller", async () => {
    const databaseError = { code: "42501", message: "Permission denied" };
    databaseMocks.from.mockReturnValue({ insert: databaseMocks.insert });
    databaseMocks.insert.mockResolvedValue({ error: databaseError });

    await expect(addReviewSession(newReviewSession)).rejects.toBe(
      databaseError,
    );
  });
});
