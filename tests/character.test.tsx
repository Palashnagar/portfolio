import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PalashCharacter } from "@/components/character/PalashCharacter";

describe("PalashCharacter", () => {
  it("renders all 5 variants without crashing", () => {
    const variants = [
      "hero-wave",
      "thinking",
      "pointing",
      "peeking",
      "celebrating",
    ] as const;
    variants.forEach((v) => {
      const { container } = render(<PalashCharacter variant={v} />);
      expect(container.querySelector("svg")).not.toBeNull();
    });
  });

  it("hero-wave has aria-label when not decorative", () => {
    render(<PalashCharacter variant="hero-wave" decorative={false} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      expect.stringMatching(/palash/i),
    );
  });

  it("is aria-hidden by default", () => {
    const { container } = render(<PalashCharacter variant="thinking" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
