export interface Point { x: number; y: number; }
export interface RectLike { left: number; top: number; width: number; height: number; }

export function magneticOffset(
  pointer: Point,
  rect: RectLike,
  radius: number,
  strength: number
): Point {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = pointer.x - cx;
  const dy = pointer.y - cy;
  const dist = Math.hypot(dx, dy);
  if (dist > radius) return { x: 0, y: 0 };
  return { x: dx * strength, y: dy * strength };
}
