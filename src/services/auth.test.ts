import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginWithPassword, logout, signUpWithPassword } from "./auth";

const authMocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("../supabase/client", () => ({
  supabase: {
    auth: authMocks,
  },
}));

describe("auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs in with email and password", async () => {
    authMocks.signInWithPassword.mockResolvedValue({ error: null });

    await loginWithPassword("learner@example.com", "secret-password");

    expect(authMocks.signInWithPassword).toHaveBeenCalledWith({
      email: "learner@example.com",
      password: "secret-password",
    });
  });

  it("throws login errors so the caller can show a message", async () => {
    const authError = { message: "Invalid credentials" };
    authMocks.signInWithPassword.mockResolvedValue({ error: authError });

    await expect(
      loginWithPassword("learner@example.com", "wrong-password"),
    ).rejects.toBe(authError);
  });

  it("signs up with email and password", async () => {
    authMocks.signUp.mockResolvedValue({
      data: { session: { access_token: "token" } },
      error: null,
    });

    await expect(
      signUpWithPassword("learner@example.com", "secret-password"),
    ).resolves.toEqual({ requiresEmailConfirmation: false });

    expect(authMocks.signUp).toHaveBeenCalledWith({
      email: "learner@example.com",
      password: "secret-password",
    });
  });

  it("reports when signup requires email confirmation", async () => {
    authMocks.signUp.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    await expect(
      signUpWithPassword("learner@example.com", "secret-password"),
    ).resolves.toEqual({ requiresEmailConfirmation: true });
  });

  it("throws sign-up errors so the caller can show a message", async () => {
    const authError = { message: "Email already registered" };
    authMocks.signUp.mockResolvedValue({ error: authError });

    await expect(
      signUpWithPassword("learner@example.com", "secret-password"),
    ).rejects.toBe(authError);
  });

  it("logs out the current user", async () => {
    authMocks.signOut.mockResolvedValue({ error: null });

    await logout();

    expect(authMocks.signOut).toHaveBeenCalledOnce();
  });
});
