/**
 * Active panel index (0-based) for a scroll progress in [0,1] across `count`
 * panels. Mirrors the reference's Math.floor(progress * count + 0.001) with
 * clamping. Used to drive the progress-label text.
 */
export function activePanelIndex(progress: number, count: number): number {
  if (count <= 0) return 0;
  const idx = Math.floor(progress * count + 0.001);
  return Math.max(0, Math.min(count - 1, idx));
}
