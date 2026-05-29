import { describe, it, expect } from "vitest";
import { konamiStep, KONAMI, isKonamiComplete } from "@/lib/konami";

describe("KONAMI sequence", () => {
  it("is the classic 10-key code ending in b, a", () => {
    expect(KONAMI).toEqual([
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ]);
  });
});

describe("konamiStep", () => {
  it("accumulates the full sequence when fed in order", () => {
    let buf: string[] = [];
    for (const key of KONAMI) buf = konamiStep(buf, key);
    expect(buf).toEqual(KONAMI);
    expect(isKonamiComplete(buf)).toBe(true);
  });

  it("treats an empty buffer as not complete", () => {
    expect(isKonamiComplete([])).toBe(false);
    expect(isKonamiComplete(KONAMI.slice(0, 9))).toBe(false);
  });

  it("resets to empty on a wrong key", () => {
    let buf = konamiStep([], "ArrowUp");
    buf = konamiStep(buf, "ArrowUp");
    expect(buf).toEqual(["ArrowUp", "ArrowUp"]);
    buf = konamiStep(buf, "x");
    expect(buf).toEqual([]);
  });

  it("restarts (rather than fully resets) when the wrong key is itself the first key", () => {
    // [Up, Up] then another Up — index 2 expects ArrowDown, so this is 'wrong',
    // but ArrowUp is the first key of the code, so the buffer restarts at [Up].
    let buf = konamiStep([], "ArrowUp");
    buf = konamiStep(buf, "ArrowUp");
    buf = konamiStep(buf, "ArrowUp");
    expect(buf).toEqual(["ArrowUp"]);
  });

  it("is case-insensitive for the letter keys", () => {
    const upToLetters = KONAMI.slice(0, 8); // ...left, right, left, right
    let buf = [...upToLetters];
    buf = konamiStep(buf, "B"); // uppercase
    buf = konamiStep(buf, "A"); // uppercase
    expect(buf).toEqual(KONAMI);
    expect(isKonamiComplete(buf)).toBe(true);
  });
});
