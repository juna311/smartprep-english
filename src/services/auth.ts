import { supabase } from "../supabase/client";

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

export async function signUpWithPassword(
  email: string,
  password: string,
): Promise<{ requiresEmailConfirmation: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  return {
    requiresEmailConfirmation: data.session === null,
  };
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
