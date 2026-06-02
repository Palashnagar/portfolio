import type Lenis from "lenis";

// Shared handle to the single Lenis instance created in <SmoothScroll/>, so UI
// like the back-to-top button can drive smooth scrolling without prop-drilling
// or a context. Set on mount, cleared on unmount.
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

/** Smoothly scroll to the top of the page. Drives Lenis when it's active;
 *  falls back to an instant jump otherwise — which is also the correct behavior
 *  under prefers-reduced-motion, where Lenis is never created. */
export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0);
  } else if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}
