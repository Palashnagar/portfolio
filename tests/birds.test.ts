import { describe, it, expect } from "vitest";
import { birdTransform, Bird, type Viewport } from "@/lib/birds";

describe("birdTransform — the rotation rule that breaks most often", () => {
  it("mirrors with scaleX(-1) when flying left, scaleX(1) when flying right", () => {
    expect(birdTransform(0, 0, -1, 0)).toContain("scaleX(-1)");
    expect(birdTransform(0, 0, 1, 0)).toContain("scaleX(1)");
  });

  it("banks by atan2(vy, |vx|) in degrees", () => {
    // vx=1, vy=1 -> 45°
    expect(birdTransform(0, 0, 1, 1)).toContain("rotate(45deg)");
    // level flight -> 0°
    expect(birdTransform(0, 0, 1, 0)).toContain("rotate(0deg)");
  });

  it("never flips upside-down: |bank angle| stays within 90° even when flying left", () => {
    // A naive atan2(vy, vx) for leftward flight would give ~135°, flipping the
    // bird. Using |vx| keeps it a gentle downward bank instead.
    const t = birdTransform(0, 0, -1, 1); // left + descending
    const angle = Number(/rotate\(([-\d.]+)deg\)/.exec(t)?.[1]);
    expect(t).toContain("scaleX(-1)");
    expect(Math.abs(angle)).toBeLessThanOrEqual(90);
    expect(angle).toBeCloseTo(45, 5); // downward bank, not 135°
  });

  it("places the bird at its (x, y) via translate", () => {
    expect(birdTransform(120, 250, -1, 0)).toContain("translate(120px, 250px)");
  });
});

describe("Bird.update", () => {
  const vp: Viewport = { width: 1280, height: 800 };

  it("returns a transform string each tick", () => {
    const b = new Bird(0, vp);
    expect(b.update(vp, null)).toMatch(/^translate\(.*\) scaleX\(-?1\) rotate\(.*deg\)$/);
  });

  it("keeps the bird within vertical bounds [40, height*0.55] over many ticks", () => {
    const b = new Bird(0, vp);
    for (let i = 0; i < 2000; i++) b.update(vp, null);
    expect(b.y).toBeGreaterThanOrEqual(40);
    expect(b.y).toBeLessThanOrEqual(vp.height * 0.55);
  });

  it("keeps the bird within horizontal wrap bounds [-80, width+80] over many ticks", () => {
    const b = new Bird(0, vp);
    for (let i = 0; i < 2000; i++) b.update(vp, null);
    expect(b.x).toBeGreaterThanOrEqual(-80);
    expect(b.x).toBeLessThanOrEqual(vp.width + 80);
  });

  it("cruises leftward on average with no pointer (baseDir = -1)", () => {
    const b = new Bird(0, vp);
    // let it settle past the initial stagger, then sample velocity
    for (let i = 0; i < 200; i++) b.update(vp, null);
    expect(b.vx).toBeLessThan(0);
  });
});
