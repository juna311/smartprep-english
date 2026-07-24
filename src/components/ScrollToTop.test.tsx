import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ScrollToTop from "./ScrollToTop";

function NavigationTestPage({ destination }: { destination: string | number }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (typeof destination === "number") {
      navigate(destination);
      return;
    }

    navigate(destination);
  };

  return (
    <>
      <ScrollToTop />
      <p>{`${location.pathname}${location.search}${location.hash}`}</p>
      <button type="button" onClick={handleNavigate}>
        Navigate
      </button>
    </>
  );
}

const scrollToMock = vi.fn();

describe("ScrollToTop", () => {
  beforeEach(() => {
    scrollToMock.mockReset();
    vi.spyOn(window, "scrollTo").mockImplementation(scrollToMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scrolls to the top when navigating to a different page", () => {
    render(
      <MemoryRouter initialEntries={["/grammar"]}>
        <NavigationTestPage destination="/vocabulary" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Navigate" }));

    expect(screen.getByText("/vocabulary")).toBeInTheDocument();
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });

  it("does not scroll for a query-only change on the same page", () => {
    render(
      <MemoryRouter initialEntries={["/search?q=grammar"]}>
        <NavigationTestPage destination="/search?q=vocabulary" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Navigate" }));

    expect(screen.getByText("/search?q=vocabulary")).toBeInTheDocument();
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it("does not override hash-link scrolling", () => {
    render(
      <MemoryRouter initialEntries={["/grammar"]}>
        <NavigationTestPage destination="/grammar#examples" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Navigate" }));

    expect(screen.getByText("/grammar#examples")).toBeInTheDocument();
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it("does not override scroll restoration when navigating back", () => {
    render(
      <MemoryRouter
        initialEntries={["/grammar", "/vocabulary"]}
        initialIndex={1}
      >
        <NavigationTestPage destination={-1} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Navigate" }));

    expect(screen.getByText("/grammar")).toBeInTheDocument();
    expect(scrollToMock).not.toHaveBeenCalled();
  });
});
