"use client";

// MyCourses-only progressive enhancement: one Figma one-pager button that
// travels across the page as a pure function of scroll, 
//   phase 1: inline in the hero (tracks the hero anchor)
//   phase 1→2: glides to a left-edge rail, vertically centered
//   phase 2: pinned on the rail through the body
//   phase 2→3: travels to screen-center and "diffuses" (blur dip + fade) to
//              resolve as the centered closing-CTA button.
// The static hero + closing <a>s are real links (work with no JS) and double as
// the measured rest anchors in motion mode (hidden, aria-hidden). Reduced-motion
// and <768px get the static buttons only, no fixed element, no choreography.

import { useEffect, useRef } from "react";
import styles from "./FigmaOnePager.module.css";

export const FIGMA_URL =
  "https://www.figma.com/proto/xN9evTe9VsBLSXjRUnuuHm/MyCourses-Design?page-id=1018%3A1859&node-id=1209-14782&viewport=-1120%2C386%2C0.52&t=LbgoYCdB4owtbtON-1&scaling=min-zoom&content-scaling=fixed";

// Static hero instance, rendered into the Hero's children slot for MyCourses.
export function FigmaHeroButton() {
  return (
    <div className={styles.heroBtnRow}>
      <a
        className={styles.figmaBtn}
        data-figma="hero"
        href={FIGMA_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Figma one-pager ↗
      </a>
    </div>
  );
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function FigmaOnePager() {
  const travelerRef = useRef<HTMLAnchorElement>(null);
  const closingBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const traveler = travelerRef.current;
    const closingBtn = closingBtnRef.current;
    const heroBtn = document.querySelector<HTMLElement>('[data-figma="hero"]');
    const heroHeader = heroBtn?.closest("header") ?? null;
    if (!traveler || !closingBtn || !heroBtn || !heroHeader) return;

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 767px)");

    let raf = 0;
    let active = false;
    let lastY = -1;
    let diffuseMode: boolean | null = null; // which easing the transform is using
    // document-relative geometry, cached; recomputed on resize / font-load only
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
      if (!force && sy === lastY) return; // early-out when not scrolling
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

      // Phase-aware easing: keep the quick settle on the hero→rail leg (the
      // bounce we want), but ease the rail→closing diffuse slowly + smoothly so
      // it glides into the closing CTA instead of snapping to center.
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
        x = heroXVP; // phase 1: ride along with the hero
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
      update(true); // position before reveal so there's no flash
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

    // Re-read anchor geometry whenever layout shifts, crucial on this page
    // because lazy-loaded images + the video grow the document AFTER mount,
    // pushing the closing CTA down. Without this the button would settle on a
    // stale position (e.g. over the video) instead of the closing section.
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
      <section className={styles.closing} aria-labelledby="figma-closing-h">
        <div className={styles.closingInner}>
          <h2 id="figma-closing-h" className={styles.closingH}>
            Want the <em>complete</em> walkthrough?
          </h2>
          <p className={styles.closingSub}>
            Every screen, flow, and decision lives in the full Figma one-pager.
          </p>
          <span className={styles.closingSlot}>
            <a
              ref={closingBtnRef}
              className={styles.figmaBtn}
              data-figma="closing"
              href={FIGMA_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the Figma one-pager ↗
            </a>
          </span>
        </div>
      </section>

      {/* The single traveling instance, desktop + motion only. Hidden on SSR /
          no-JS / reduced-motion / mobile; the controller reveals + drives it. */}
      <a
        ref={travelerRef}
        className={`${styles.traveler} ${styles.figmaBtn}`}
        href={FIGMA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Figma one-pager"
        style={{ display: "none" }}
      >
        View Figma one-pager ↗
      </a>
    </>
  );
}
