import { supabase } from "../supabase/client";
import type { NewSavedWord, SavedWord } from "../types/database.types";

const SAVED_WORD_COLUMNS =
  "id, user_id, word_id, word, translation, example, topic_id, level, image, association, created_at";

export async function getSavedWords(userId: string): Promise<SavedWord[]> {
  const { data, error } = await supabase
    .from("saved_words")
    .select(SAVED_WORD_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getSavedWordIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("saved_words")
    .select("word_id")
    .eq("user_id", userId);

  if (error) throw error;

  return data.map((row) => row.word_id);
}

export async function getSavedWordsCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("saved_words")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;

  return count ?? 0;
}

export async function addSavedWord(word: NewSavedWord): Promise<void> {
  const { error } = await supabase.from("saved_words").insert(word);

  if (error) throw error;
}

export async function removeSavedWord(
  userId: string,
  wordId: string,
): Promise<void> {
  const { error } = await supabase
    .from("saved_words")
    .delete()
    .eq("user_id", userId)
    .eq("word_id", wordId);

  if (error) throw error;
}

export function isDuplicateSavedWordError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}
