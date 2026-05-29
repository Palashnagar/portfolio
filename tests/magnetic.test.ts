import { magneticOffset } from "@/lib/magnetic";

test("returns 0 outside radius, pulls toward pointer inside", () => {
  const rect = { left: 0, top: 0, width: 100, height: 40 } as DOMRect;
  expect(magneticOffset({ x: 999, y: 999 }, rect, 80, 0.4)).toEqual({ x: 0, y: 0 });
  const o = magneticOffset({ x: 60, y: 20 }, rect, 80, 0.4);
  expect(o.x).toBeGreaterThan(0);
});
