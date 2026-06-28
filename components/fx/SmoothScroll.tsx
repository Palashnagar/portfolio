"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices scroll natively: a smooth-scroll library adds an extra RAF
    // and noticeable jank on mobile for no benefit. Desktop (fine pointer) keeps it.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const lenis = new Lenis();
    setLenis(lenis); // expose so the back-to-top button can drive it
    let raf = 0;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return <>{children}</>;
}
