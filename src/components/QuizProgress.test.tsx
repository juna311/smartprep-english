import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import QuizProgress from "./QuizProgress";

describe("QuizProgress", () => {
  it("exposes the current progress to assistive technology", () => {
    render(<QuizProgress index={1} total={4} score={1} progressPercent={50} />);

    const progressBar = screen.getByRole("progressbar", {
      name: "Quiz progress",
    });

    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "100");
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");
    expect(progressBar).toHaveAttribute("aria-valuetext", "Question 2 of 4");
  });
});
