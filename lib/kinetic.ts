export interface Point {
  x: number;
  y: number;
}

export interface LetterTransform {
  tx: number;
  ty: number;
  scale: number;
  rot: number;
  italic: boolean;
}

export function letterTransform(
  letterCenter: Point,
  pointer: Point,
  radius: number,
): LetterTransform {
  const dx = pointer.x - letterCenter.x;
  const dy = pointer.y - letterCenter.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= radius) return { tx: 0, ty: 0, scale: 1, rot: 0, italic: false };
  const f = 1 - dist / radius;
  return {
    tx: -dx * f * 0.18,
    ty: -dy * f * 0.18,
    scale: 1 + f * 0.22,
    rot: (dx / radius) * f * -8,
    italic: f > 0.5,
  };
}
