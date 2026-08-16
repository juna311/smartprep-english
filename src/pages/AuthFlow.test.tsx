import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "./Login";
import SignUp from "./SignUp";

const authMocks = vi.hoisted(() => ({
  loginWithPassword: vi.fn(),
  signUpWithPassword: vi.fn(),
}));

vi.mock("../services/auth", () => authMocks);

describe("authentication user flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the user to the protected page they originally requested", async () => {
    authMocks.loginWithPassword.mockResolvedValue(undefined);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/login",
            state: {
              from: {
                pathname: "/my-dictionary/review",
                search: "?topic=food",
                hash: "",
              },
            },
          },
        ]}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/my-dictionary/review"
            element={<p>Requested review page</p>}
          />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Requested review page")).toBeVisible();
  });

  it("explains when a new account needs email confirmation", async () => {
    authMocks.signUpWithPassword.mockResolvedValue({
      requiresEmailConfirmation: true,
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(
      await screen.findByRole("heading", { name: "Check your email" }),
    ).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("learner@example.com");
  });

  it("opens the dashboard when signup creates a session immediately", async () => {
    authMocks.signUpWithPassword.mockResolvedValue({
      requiresEmailConfirmation: false,
    });

    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<p>Dashboard destination</p>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Dashboard destination")).toBeVisible();
  });
});
