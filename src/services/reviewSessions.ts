import { supabase } from "../supabase/client";
import type { NewReviewSession, ReviewSession } from "../types/database.types";

const REVIEW_SESSION_COLUMNS =
  "id, user_id, mode, review_label, total_questions, correct_answers, needs_review_count, created_at";

export async function getReviewSessions(
  userId: string,
): Promise<ReviewSession[]> {
  const { data, error } = await supabase
    .from("review_sessions")
    .select(REVIEW_SESSION_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addReviewSession(
  session: NewReviewSession,
): Promise<void> {
  const { error } = await supabase.from("review_sessions").insert(session);

  if (error) throw error;
}
