import { render, screen } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthContext, type AuthContextType } from "../context/useAuth";
import ProtectedRoute from "./ProtectedRoute";

function renderProtectedRoute(auth: AuthContextType) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <p>Private dashboard</p>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("ProtectedRoute", () => {
  it("waits while authentication is still loading", () => {
    renderProtectedRoute({
      user: null,
      isAuthLoading: true,
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "Checking your session...",
    );
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("redirects a signed-out visitor to the login page", () => {
    renderProtectedRoute({
      user: null,
      isAuthLoading: false,
    });

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("shows protected content to a signed-in user", () => {
    renderProtectedRoute({
      user: { id: "user-1" } as User,
      isAuthLoading: false,
    });

    expect(screen.getByText("Private dashboard")).toBeInTheDocument();
  });
});
