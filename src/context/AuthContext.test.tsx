import { act, render, screen } from "@testing-library/react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./useAuth";

const authMocks = vi.hoisted(() => ({
  onAuthStateChange: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock("../supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: authMocks.onAuthStateChange,
    },
  },
}));

let sendAuthChange: (event: AuthChangeEvent, session: Session | null) => void;

function AuthStateProbe() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <p>Auth loading</p>;
  }

  return <p>{user?.email ?? "Signed out"}</p>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    authMocks.onAuthStateChange.mockReset();
    authMocks.unsubscribe.mockReset();

    authMocks.onAuthStateChange.mockImplementation(
      (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
        sendAuthChange = callback;

        return {
          data: {
            subscription: {
              unsubscribe: authMocks.unsubscribe,
            },
          },
        };
      },
    );
  });

  it("keeps authentication loading until Supabase sends its initial session", () => {
    const user = {
      id: "user-1",
      email: "learner@example.com",
    } as User;

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>,
    );

    expect(screen.getByText("Auth loading")).toBeInTheDocument();

    act(() => {
      sendAuthChange("INITIAL_SESSION", { user } as Session);
    });

    expect(screen.getByText("learner@example.com")).toBeInTheDocument();
  });

  it("becomes signed out when the initial session is empty", () => {
    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>,
    );

    act(() => {
      sendAuthChange("INITIAL_SESSION", null);
    });

    expect(screen.getByText("Signed out")).toBeInTheDocument();
  });

  it("unsubscribes from Supabase when the provider is removed", () => {
    const { unmount } = render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>,
    );

    unmount();

    expect(authMocks.unsubscribe).toHaveBeenCalledOnce();
  });
});
