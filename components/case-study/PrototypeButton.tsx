"use client";

// Generic scroll-choreographed prototype button — one pill that travels across
// the page as a pure function of scroll:
//   phase 1: inline in the hero (tracks the hero anchor)
//   phase 1→2: glides to a left-edge rail, vertically centered (quick settle)
//   phase 2: pinned on the rail through the body
//   phase 2→3: travels to screen-center and "diffuses" (blur dip + fade) to
//              resolve as the centered closing-CTA button (slow, smooth ease-out).
// It lands in the closing CTA and never enters the Next-Project section below it.
//
// This is a parameterized twin of FigmaOnePager (the MyCourses-only version),
// kept separate so that case study stays untouched; it uses its own data-proto
// hooks and reuses the shared button CSS. The static hero + closing <a>s are real
// links (work with no JS) and double as measured rest anchors in motion mode
// (hidden, aria-hidden). Reduced-motion and <768px get the static buttons only.

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./FigmaOnePager.module.css";

export type PrototypeConfig = {
  url: string;
  heroLabel: string; // hero/rail pill, e.g. "View prototype ↗"
  closeLabel: string; // closing-CTA pill, e.g. "Open the prototype ↗"
  ariaLabel: string; // accessible name for the traveling pill, e.g. "View prototype"
  closeHeading: ReactNode; // e.g. <>Want to <em>try it</em>?</>
  closeSub: string;
};

// Static hero instance — rendered into the Hero's children slot.
export function PrototypeHeroButton({ url, heroLabel }: { url: string; heroLabel: string }) {
  return (
    <div className={styles.heroBtnRow}>
      <a
        className={styles.figmaBtn}
        data-proto="hero"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {heroLabel}
      </a>
    </div>
  );
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function PrototypeButton({ url, heroLabel, closeLabel, ariaLabel, closeHeading, closeSub }: PrototypeConfig) {
  const travelerRef = useRef<HTMLAnchorElement>(null);
  const closingBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const traveler = travelerRef.current;
    const closingBtn = closingBtnRef.current;
    const heroBtn = document.querySelector<HTMLElement>('[data-proto="hero"]');
    const heroHeader = heroBtn?.closest("header") ?? null;
    if (!traveler || !closingBtn || !heroBtn || !heroHeader) return;

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 767px)");

    let raf = 0;
    let active = false;
    let lastY = -1;
    let diffuseMode: boolean | null = null; // which easing the transform is using
    let geo = { heroLeft: 0, heroTop: 0, closeLeft: 0, closeTop: 0, heroBottom: 0, btnH: 46 };

    function measure() {
      const sx = window.scrollX;
      const sy = window.scrollY;
      const hr = heroBtn!.getBoundingClientRect();
      const cr = closingBtn!.getBoundingClientRect();
      const hh = heroHeader!.getBoundingClientRect();
      geo = {
        heroLeft: hr.left + sx,
        heroTop: hr.top + sy,
        closeLeft: cr.left + sx,
        closeTop: cr.top + sy,
        heroBottom: hh.bottom + sy,
        btnH: hr.height || 46,
      };
    }

    function update(force: boolean) {
      if (!active) return;
      const sy = window.scrollY;
      if (!force && sy === lastY) return;
      lastY = sy;

      const vh = window.innerHeight;
      const sx = window.scrollX;
      const railX = clamp(window.innerWidth * 0.02, 16, 30);
      const railY = vh * 0.5 - geo.btnH / 2;

      const heroBottomVP = geo.heroBottom - sy;
      const heroXVP = geo.heroLeft - sx;
      const heroYVP = geo.heroTop - sy;
      const closeXVP = geo.closeLeft - sx;
      const closeYVP = geo.closeTop - sy;
      const closeCenterVP = closeYVP + geo.btnH / 2;

      // phase 1→2: hero bottom passes ~120px below the top, over ~240px of scroll
      const p1 = clamp((120 - heroBottomVP) / 240, 0, 1);
      // phase 2→3: closing center enters lower 70% (0.7vh) and resolves at center (0.5vh)
      const p2 = clamp((vh * 0.7 - closeCenterVP) / (vh * 0.2), 0, 1);

      // Quick settle on hero→rail; slow, smooth glide on rail→closing diffuse.
      const slow = p2 > 0;
      if (slow !== diffuseMode) {
        diffuseMode = slow;
        traveler!.style.transition = slow
          ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease, filter 0.5s ease, background 0.25s, border-color 0.25s"
          : "transform 0.25s ease, background 0.25s, border-color 0.25s";
      }

      let x: number;
      let y: number;
      let scale = 1;
      let blur = 0;
      let opacity = 1;

      if (p2 > 0) {
        const e = easeOutCubic(p2);
        x = lerp(railX, closeXVP, e);
        y = lerp(railY, closeYVP, e);
        scale = lerp(0.84, 1, e);
        const dip = Math.sin(Math.PI * p2); // 0 → 1 → 0, peaking at p2=0.5
        blur = 6 * dip;
        opacity = 1 - 0.6 * dip;
      } else if (p1 > 0) {
        const e = easeOutCubic(p1);
        x = lerp(heroXVP, railX, e);
        y = lerp(heroYVP, railY, e);
        scale = lerp(1, 0.84, e);
      } else {
        x = heroXVP;
        y = heroYVP;
      }

      traveler!.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      traveler!.style.filter = blur > 0.05 ? `blur(${blur}px)` : "none";
      traveler!.style.opacity = String(opacity);
    }

    function setAnchor(el: HTMLElement, on: boolean) {
      if (on) {
        el.style.visibility = "hidden";
        el.setAttribute("aria-hidden", "true");
        el.setAttribute("tabindex", "-1");
      } else {
        el.style.visibility = "";
        el.removeAttribute("aria-hidden");
        el.removeAttribute("tabindex");
      }
    }

    function activate() {
      if (active) return;
      active = true;
      setAnchor(heroBtn!, true);
      setAnchor(closingBtn!, true);
      measure();
      lastY = -1;
      update(true);
      traveler!.style.display = "inline-flex";
    }

    function deactivate() {
      if (!active) return;
      active = false;
      traveler!.style.display = "none";
      traveler!.style.transform = "";
      traveler!.style.filter = "";
      traveler!.style.opacity = "";
      traveler!.style.transition = "";
      diffuseMode = null;
      setAnchor(heroBtn!, false);
      setAnchor(closingBtn!, false);
    }

    function evaluateMode() {
      if (!mqReduce.matches && !mqMobile.matches) activate();
      else deactivate();
    }

    function onResize() {
      evaluateMode();
      if (active) {
        measure();
        update(true);
      }
    }

    function frame() {
      update(false);
      raf = requestAnimationFrame(frame);
    }

    // Re-read anchor geometry whenever layout shifts — lazy images grow the
    // document AFTER mount, pushing the closing CTA down. Without this the button
    // would settle on a stale position instead of the closing section.
    const reMeasure = () => {
      if (active) {
        measure();
        update(true);
      }
    };

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(reMeasure);
      ro.observe(document.body);
    }

    evaluateMode();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", reMeasure);
    mqReduce.addEventListener?.("change", evaluateMode);
    mqMobile.addEventListener?.("change", evaluateMode);
    if (document.fonts?.ready) {
      document.fonts.ready.then(reMeasure);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", reMeasure);
      mqReduce.removeEventListener?.("change", evaluateMode);
      mqMobile.removeEventListener?.("change", evaluateMode);
      ro?.disconnect();
      deactivate();
    };
  }, []);

  return (
    <>
      <section className={styles.closing} aria-labelledby="proto-closing-h">
        <div className={styles.closingInner}>
          <h2 id="proto-closing-h" className={styles.closingH}>
            {closeHeading}
          </h2>
          <p className={styles.closingSub}>{closeSub}</p>
          <span className={styles.closingSlot}>
            <a
              ref={closingBtnRef}
              className={styles.figmaBtn}
              data-proto="closing"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {closeLabel}
            </a>
          </span>
        </div>
      </section>

      {/* Single traveling instance — desktop + motion only. Hidden on SSR / no-JS /
          reduced-motion / mobile; the controller reveals + drives it. */}
      <a
        ref={travelerRef}
        className={`${styles.traveler} ${styles.figmaBtn}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        style={{ display: "none" }}
      >
        {heroLabel}
      </a>
    </>
  );
}
