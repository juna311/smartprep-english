import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("applies variant and size classes", () => {
    render(
      <Button variant="primary" size="md">
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });

    expect(button).toHaveClass("bg-[var(--color-brand-navy)]");
    expect(button).toHaveClass("px-4");
    expect(button).toHaveClass("py-2");
  });

  it("keeps custom class names for one-off cases", () => {
    render(<Button className="text-lg">Play</Button>);

    expect(screen.getByRole("button", { name: "Play" })).toHaveClass("text-lg");
  });
});
