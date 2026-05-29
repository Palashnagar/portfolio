import { describe, it, expect } from "vitest";
import { activePanelIndex } from "@/lib/horizontal";

describe("activePanelIndex", () => {
  it("returns 0 at progress=0", () => {
    expect(activePanelIndex(0, 4)).toBe(0);
  });

  it("returns 0 at progress=0.24", () => {
    expect(activePanelIndex(0.24, 4)).toBe(0);
  });

  it("returns 1 at progress=0.25", () => {
    expect(activePanelIndex(0.25, 4)).toBe(1);
  });

  it("returns 2 at progress=0.5", () => {
    expect(activePanelIndex(0.5, 4)).toBe(2);
  });

  it("returns 2 at progress=0.74", () => {
    expect(activePanelIndex(0.74, 4)).toBe(2);
  });

  it("returns 3 at progress=0.75", () => {
    expect(activePanelIndex(0.75, 4)).toBe(3);
  });

  it("returns 3 at progress=0.99", () => {
    expect(activePanelIndex(0.99, 4)).toBe(3);
  });

  it("returns 3 at progress=1 (clamps to last panel)", () => {
    expect(activePanelIndex(1, 4)).toBe(3);
  });

  it("returns 0 when count=0 (guard: zero count)", () => {
    expect(activePanelIndex(0.5, 0)).toBe(0);
  });

  it("clamps to 0 when progress is negative", () => {
    expect(activePanelIndex(-0.2, 4)).toBe(0);
  });
});
