import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../context/useAuth";
import UserMenu from "./UserMenu";

const authMocks = vi.hoisted(() => ({
  signOut: vi.fn(),
}));

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
}));

vi.mock("../supabase/client", () => ({
  supabase: {
    auth: authMocks,
  },
}));

vi.mock("react-hot-toast", () => ({
  default: toastMocks,
}));

function renderUserMenu(user: User | null = null) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, isAuthLoading: false }}>
        <UserMenu />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("UserMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens from the trigger and exposes menu semantics", () => {
    renderUserMenu();
    const trigger = screen.getByRole("button", { name: "Login / Sign Up" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Login" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Sign Up" })).toBeVisible();
  });

  it("closes with Escape and returns focus to the trigger", () => {
    renderUserMenu();
    const trigger = screen.getByRole("button", { name: "Login / Sign Up" });

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("opens with Arrow Down and focuses the first menu item", async () => {
    renderUserMenu();
    const trigger = screen.getByRole("button", { name: "Login / Sign Up" });

    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "Login" })).toHaveFocus();
    });
  });

  it("shows an error when logout fails", async () => {
    authMocks.signOut.mockResolvedValue({
      error: new Error("Network unavailable"),
    });
    renderUserMenu({ id: "user-1" } as User);

    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Logout" }));

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith("Network unavailable");
    });
  });
});
