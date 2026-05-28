"use client";

import { useEffect, useState, useRef } from "react";
import type { Transition } from "framer-motion";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export interface RevealConfig {
  yOffset?: number;
  delay?: number;
  duration?: number;
}

export function useReveal(config: RevealConfig = {}) {
  const reduced = useReducedMotion();
  const { yOffset = 24, delay = 0, duration = 0.7 } = config;

  return {
    initial: { opacity: 0, y: reduced ? 0 : yOffset },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: {
      duration: reduced ? 0.01 : duration,
      delay: reduced ? 0 : delay,
      ease: [0.25, 1, 0.5, 1] as const,
    } as Transition,
  };
}

export interface MagneticState {
  ref: React.RefObject<HTMLElement | null>;
  x: number;
  y: number;
}

export function useMagnetic(strength = 0.3): MagneticState {
  const ref = useRef<HTMLElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setPos({ x: (e.clientX - cx) * strength, y: (e.clientY - cy) * strength });
    };
    const onLeave = () => setPos({ x: 0, y: 0 });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength, reduced]);

  return { ref, x: pos.x, y: pos.y };
}
