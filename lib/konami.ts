// Pure logic for the Konami-code easter egg (thermal mode). No DOM access —
// the client component (components/fx/ThermalMode.tsx) feeds keydown values in
// and toggles the theme when isKonamiComplete() returns true. Kept pure so the
// matching behaviour is unit-testable without a browser.

export const KONAMI = [
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
] as const;

// Normalise a KeyboardEvent.key: single characters (letters) are lower-cased so
// "B"/"b" both match; named keys like "ArrowUp" are left as-is.
function normalize(key: string): string {
  return key.length === 1 ? key.toLowerCase() : key;
}

/**
 * Advance the match buffer by one key.
 * - Correct next key  → append and keep going.
 * - Wrong key that is the sequence's first key → restart at that key.
 * - Any other wrong key → reset to empty.
 */
export function konamiStep(buffer: string[], key: string): string[] {
  const k = normalize(key);
  if (k === KONAMI[buffer.length]) return [...buffer, k];
  if (k === KONAMI[0]) return [k];
  return [];
}

export function isKonamiComplete(buffer: string[]): boolean {
  return buffer.length === KONAMI.length;
}
