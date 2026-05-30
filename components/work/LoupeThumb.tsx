"use client";

// Case-study thumbnail with the B+C hover treatment (color awakening + cursor
// loupe). Port of design-reference/case-study-combined.html. Replaces the old
// displacement-filter thumbnail. Drop-in: pass the rendered thumbnail as children
// and a `loupeImage` URL to magnify. Color awakening / sweep / scale are CSS,
// driven by the .group card ancestor; the loupe is JS, pointer-only.
//
// Cursor coordination: on entering the thumb we dispatch `customCursor:hide` so
// the global custom cursor steps aside while the loupe is the visual cursor, and
// `customCursor:show` on leave. Event-based, never DOM-traversal.

import { useEffect, useRef } from "react";
import styles from "./LoupeThumb.module.css";

const HALF = 60; // half the 120px loupe, to center it on the cursor

export function LoupeThumb({
  loupeImage,
  label = "Look closer",
  className,
  children,
}: {
  loupeImage: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thumb = thumbRef.current;
    const loupe = loupeRef.current;
    const visual = visualRef.current;
    if (!thumb || !loupe || !visual) return;

    // Pointer-only and motion-gated; touch / reduced-motion get no loupe (and the
    // CSS hides it too).
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let raf = 0;
    let px = 0;
    let py = 0;
    let active = false;

    function place(w: number, h: number) {
      loupe!.style.transform = `translate3d(${px - HALF}px, ${py - HALF}px, 0)`;
      visual!.style.backgroundPosition = `${(px / w) * 100}% ${(py / h) * 100}%`;
    }

    function onEnter(e: MouseEvent) {
      const r = thumb!.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      place(r.width, r.height); // position before showing, so no top-left flash
      active = true;
      loupe!.classList.add(styles.active);
      window.dispatchEvent(new Event("customCursor:hide"));
    }

    function onLeave() {
      active = false;
      loupe!.classList.remove(styles.active);
      window.dispatchEvent(new Event("customCursor:show"));
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function onMove(e: MouseEvent) {
      const r = thumb!.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          place(r.width, r.height);
        });
      }
    }

    thumb.addEventListener("mouseenter", onEnter);
    thumb.addEventListener("mouseleave", onLeave);
    thumb.addEventListener("mousemove", onMove);

    return () => {
      thumb.removeEventListener("mouseenter", onEnter);
      thumb.removeEventListener("mouseleave", onLeave);
      thumb.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
      // If we unmount mid-hover, make sure the global cursor comes back.
      if (active) window.dispatchEvent(new Event("customCursor:show"));
    };
  }, []);

  return (
    <div ref={thumbRef} className={`${styles.thumb} ${className ?? ""}`}>
      <div className={styles.bg}>{children}</div>
      <span className={styles.sweep} aria-hidden="true" />
      <div ref={loupeRef} className={styles.loupe} aria-hidden="true">
        <div
          ref={visualRef}
          className={styles.loupeVisual}
          style={{ backgroundImage: `url("${loupeImage}")` }}
        >
          <span className={styles.loupeLabel}>{label}</span>
        </div>
      </div>
    </div>
  );
}
