import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReducedMotion, useReveal } from "@/components/motion/hooks";

describe("useReducedMotion", () => {
  it("returns false when no reduced-motion preference", () => {
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when prefers-reduced-motion: reduce", () => {
    window.matchMedia = ((q: string) => ({
      matches: q.includes("reduce"),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});

describe("useReveal", () => {
  it("returns initial/animate variants with default offsets", () => {
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useReveal());
    expect(result.current.initial).toEqual({ opacity: 0, y: 24 });
    expect(result.current.whileInView).toEqual({ opacity: 1, y: 0 });
    expect(result.current.viewport).toEqual({ once: true, margin: "-10%" });
  });

  it("disables y offset when reduced motion is preferred", () => {
    window.matchMedia = ((q: string) => ({
      matches: q.includes("reduce"),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useReveal());
    expect(result.current.initial).toEqual({ opacity: 0, y: 0 });
  });
});
