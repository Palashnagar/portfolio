import { letterTransform } from "@/lib/kinetic";

test("no transform beyond radius; pulls + scales + italicizes within", () => {
  expect(letterTransform({ x: 0, y: 0 }, { x: 500, y: 500 }, 240)).toEqual({ tx: 0, ty: 0, scale: 1, rot: 0, italic: false });
  const t = letterTransform({ x: 0, y: 0 }, { x: 30, y: 0 }, 240); // pointer close on +x
  expect(t.scale).toBeGreaterThan(1);
  expect(t.tx).toBeLessThan(0);
  expect(t.italic).toBe(true);
});
