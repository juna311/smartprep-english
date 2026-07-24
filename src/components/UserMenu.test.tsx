import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../context/useAuth";
import UserMenu from "./UserMenu";

vi.mock("../supabase/client", () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

function renderUserMenu() {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, isAuthLoading: false }}>
        <UserMenu />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("UserMenu", () => {
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
});
