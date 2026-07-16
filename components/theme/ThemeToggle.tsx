"use client";

// Manual light/dark toggle (sun in day, moon at night). Flips `data-theme` on
// <html>, persists to localStorage, and stamps [data-theme-anim] for the length of
// the switch so globals.css can cross-fade the whole page once, not on every paint.
// The AmbientScene reads the same `data-theme` in pure CSS to swap sun for moon.
// Initial state is set pre-paint by the inline script in layout.tsx (default light).

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Sync to whatever the no-flash script already put on <html>.
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      root.setAttribute("data-theme-anim", "");
      window.setTimeout(() => root.removeAttribute("data-theme-anim"), 800);
    }

    root.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode / storage disabled — theme still applies for the session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="link"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      className={styles.toggle}
    >
      <span className={styles.icons} data-dark={dark}>
        <svg className={styles.sun} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.4v2M12 19.6v2M2.4 12h2M19.6 12h2M5 5l1.4 1.4M17.6 17.6l1.4 1.4M5 19l1.4-1.4M17.6 6.4l1.4-1.4" />
        </svg>
        <svg className={styles.moon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4 6.5 6.5 0 1 0 20 14.5Z" />
        </svg>
      </span>
    </button>
  );
}
