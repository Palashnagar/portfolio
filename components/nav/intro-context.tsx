"use client";

// Coordinates the homepage intro sequence (see design-reference/intro-logo.html).
// One source of truth for: whether the intro plays this load (homepage + first
// visit this session + motion ok), the logo's current phase, and when the rest of
// the page (corner nav, footer chrome, hero) may reveal.
//
// Crucial timing detail: the homepage's FIRST paint must be the intro's *opening*
// state (centered name, hidden chrome), never the finished state, otherwise the
// browser paints the parked/revealed UI from SSR and the intro reverse-animates
// out of it, colliding with the hero reveal. We therefore seed the initial state
// from the route (usePathname is SSR-accurate) and keep transitions suppressed
// (`ready === false`) until the real state is settled in a layout effect, so the
// non-playing cases snap into place instead of animating.

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "palash-intro-played";

// useLayoutEffect on the client, useEffect during SSR (avoids the SSR warning).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type IntroPhase = "intro" | "transitioning" | "parked";

interface IntroValue {
  playIntro: boolean; // intro animation is active this load
  phase: IntroPhase; // logo phase
  roleVisible: boolean; // "Product · UX Designer" label under the centered name
  revealed: boolean; // corner nav / footer chrome / hero may be shown
  ready: boolean; // transitions enabled (suppressed during the initial settle)
  skip: () => void; // jump straight to parked + revealed
}

const IntroContext = createContext<IntroValue>({
  playIntro: false,
  phase: "parked",
  roleVisible: false,
  revealed: true,
  ready: true,
  skip: () => {},
});

export function useIntro(): IntroValue {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Seed from the route. The homepage opens in the intro's first frame (centered
  // name, chrome hidden); every other route opens parked + revealed.
  const [playIntro, setPlayIntro] = useState(isHome);
  const [phase, setPhase] = useState<IntroPhase>(isHome ? "intro" : "parked");
  const [roleVisible, setRoleVisible] = useState(false);
  const [revealed, setRevealed] = useState(!isHome);
  // Transitions stay off until the initial state is confirmed, so the cases that
  // shouldn't animate (repeat visit, reduced motion) snap rather than slide.
  const [ready, setReady] = useState(false);

  const timers = useRef<number[]>([]);
  const started = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  };

  const markPlayed = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* sessionStorage unavailable, ignore */
    }
  };

  const skip = () => {
    clearTimers();
    setPhase("parked");
    setRoleVisible(false);
    setRevealed(true);
    markPlayed();
  };

  useIsomorphicLayoutEffect(() => {
    if (started.current) return;
    started.current = true;

    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let played = false;
    try {
      played = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* ignore */
    }

    if (isHome && motionOk && !played) {
      // Already in the opening state, enable transitions and run the sequence.
      // Timings verbatim from intro-logo.html.
      setReady(true);
      const at = (fn: () => void, ms: number) => {
        timers.current.push(window.setTimeout(fn, ms));
      };
      at(() => setRoleVisible(true), 350);
      at(() => setPhase("transitioning"), 1700);
      at(() => {
        setPhase("parked");
        setRoleVisible(false);
      }, 1850);
      at(() => {
        setRevealed(true);
        markPlayed();
      }, 2200);
    } else {
      // No intro (repeat visit, reduced motion, or seeded as home but shouldn't
      // play): settle to parked + revealed WITHOUT animating, then enable
      // transitions next frame for hover/focus.
      setPlayIntro(false);
      setPhase("parked");
      setRoleVisible(false);
      setRevealed(true);
      requestAnimationFrame(() => setReady(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up any pending timers on unmount.
  useEffect(() => () => clearTimers(), []);

  return (
    <IntroContext.Provider
      value={{ playIntro, phase, roleVisible, revealed, ready, skip }}
    >
      {children}
    </IntroContext.Provider>
  );
}
