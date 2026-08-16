import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PracticeGrammar from "./PracticeGrammar";
import VocabularyPracticeTopic from "./VocabularyPracticeTopic";

describe("practice availability", () => {
  it("links available grammar topics and disables topics without questions", () => {
    render(
      <MemoryRouter>
        <PracticeGrammar />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /Cleft Sentences/ }),
    ).toHaveAttribute("href", "/practice/grammar/cleft-a");
    expect(
      screen
        .getByRole("heading", { name: "Present Simple" })
        .closest("article"),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("only links vocabulary levels that have practice questions", () => {
    render(
      <MemoryRouter initialEntries={["/practice/vocabulary/food"]}>
        <Routes>
          <Route
            path="/practice/vocabulary/:topicId"
            element={<VocabularyPracticeTopic />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Beginner/ })).toHaveAttribute(
      "href",
      "/practice/vocabulary/food/beginner",
    );
    expect(screen.getByRole("link", { name: /Intermediate/ })).toHaveAttribute(
      "href",
      "/practice/vocabulary/food/intermediate",
    );
    expect(
      screen.getByRole("heading", { name: "Advanced" }).closest("article"),
    ).toHaveAttribute("aria-disabled", "true");
  });
});
