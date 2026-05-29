"use client";

// Konami-code easter egg. ↑ ↑ ↓ ↓ ← → ← → b a toggles "thermal mode": the whole
// canvas takes on a slow heat-map gradient (a nod to Palash's thermal-illusion
// research) and a warm glow trails the pointer. The toggle persists for the
// session. Honors prefers-reduced-motion: gradient only, no animation, no trail.

import { useEffect, useRef, useState } from "react";
import { konamiStep, isKonamiComplete, KONAMI } from "@/lib/konami";

const STORAGE_KEY = "thermal-mode";

export function ThermalMode() {
  const [on, setOn] = useState(false);
  const [showTrail, setShowTrail] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  // Restore the toggle from the current session.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "on") setOn(true);
    } catch {
      /* sessionStorage unavailable — ignore */
    }
  }, []);

  // Listen for the code. Typing in a field never triggers it.
  useEffect(() => {
    let buffer: string[] = [];
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)
      ) {
        buffer = [];
        return;
      }
      buffer = konamiStep(buffer, e.key);
      if (isKonamiComplete(buffer)) {
        buffer = [];
        setOn((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sync the body class, persist, and decide whether the animated trail runs.
  useEffect(() => {
    document.body.classList.toggle("thermal", on);
    try {
      sessionStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      /* ignore */
    }
    const motionOk =
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
    setShowTrail(on && motionOk && finePointer);

    return () => {
      // Clean up if this component ever unmounts.
      document.body.classList.remove("thermal");
    };
  }, [on]);

  // Warm glow that lags behind the pointer (motion + fine-pointer only).
  useEffect(() => {
    if (!showTrail) return;
    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;

    function move(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
    }
    function loop() {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      const g = glowRef.current;
      if (g) {
        g.style.left = `${gx}px`;
        g.style.top = `${gy}px`;
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, [showTrail]);

  if (!showTrail) return null;
  return <div ref={glowRef} aria-hidden="true" className="thermal-trail" />;
}

// Re-export for any callers that want to display the hint.
export { KONAMI };
