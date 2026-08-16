import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("explains the missing route and lets the user return home", () => {
    render(
      <MemoryRouter initialEntries={["/missing-page"]}>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<p>Home destination</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Go to Home" }));

    expect(screen.getByText("Home destination")).toBeVisible();
  });
});
