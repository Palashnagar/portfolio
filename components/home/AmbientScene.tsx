"use client";

// Hero ambient scene — a faithful React port of design-reference/hero-F-final.html.
// Two absolutely-positioned, pointer-events:none layers that live INSIDE the hero
// section (so they scroll away with it): the inline ambient SVG (warm sun aura +
// glowing core OUTSIDE the right-dissolve mask; clouds, three parallax ridges with
// snow caps, foreground silhouette and two lone trees INSIDE the mask) and a layer
// of seven JS-steered birds. The site's global grain (z-100) and cursor (z-200)
// already sit above these, so no grain is added here.
//
// Motion is gated: prefers-reduced-motion renders a static scene with a single
// still bird and no RAF; touch devices cruise with no cursor avoidance or parallax;
// screens under 720px drop to three birds; the loops pause when the tab is hidden.

import { useEffect, useRef } from "react";
import styles from "./AmbientScene.module.css";
import { Bird, type Viewport, type Pointer } from "@/lib/birds";

// Seven birds — sizes, opacities, stroke widths, wing paths and flap timings are
// verbatim from the reference (.bird, .bird.b … .bird.g).
const BIRDS = [
  { w: 28, h: 16, sw: 1.6, op: 0.75, d: "M -11 0 q 5.5 -5.5 11 0 q 5.5 -5.5 11 0", dur: "0.55s", delay: "0s" },
  { w: 22, h: 13, sw: 1.4, op: 0.6, d: "M -9 0 q 4.5 -4.5 9 0 q 4.5 -4.5 9 0", dur: "0.62s", delay: "0.1s" },
  { w: 32, h: 18, sw: 1.8, op: 0.78, d: "M -12 0 q 6 -6 12 0 q 6 -6 12 0", dur: "0.48s", delay: "0.25s" },
  { w: 20, h: 12, sw: 1.3, op: 0.55, d: "M -10 0 q 5 -5 10 0 q 5 -5 10 0", dur: "0.58s", delay: "0.05s" },
  { w: 26, h: 15, sw: 1.5, op: 0.7, d: "M -11 0 q 5.5 -5 11 0 q 5.5 -5 11 0", dur: "0.51s", delay: "0.18s" },
  { w: 18, h: 11, sw: 1.2, op: 0.5, d: "M -9 0 q 4.5 -4 9 0 q 4.5 -4 9 0", dur: "0.66s", delay: "0.32s" },
  { w: 24, h: 14, sw: 1.5, op: 0.65, d: "M -10 0 q 5 -5 10 0 q 5 -5 10 0", dur: "0.45s", delay: "0.4s" },
];

export default function AmbientScene() {
  const ambientRef = useRef<HTMLDivElement>(null);
  const birdEls = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const ambientEl = ambientRef.current;
    if (!ambientEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches; // false on touch
    const mobile = window.innerWidth < 720;

    const allBirds = birdEls.current.filter(Boolean) as HTMLDivElement[];
    const layers = Array.from(ambientEl.querySelectorAll<SVGGElement>("[data-depth]"));

    // ── Reduced motion: static scene, one still bird, no loops ──────────────
    if (reduced) {
      allBirds.forEach((el, i) => {
        if (i === 0) {
          el.style.transform = `translate(${window.innerWidth * 0.66}px, ${
            window.innerHeight * 0.2
          }px) scaleX(-1)`;
        } else {
          el.style.display = "none";
        }
      });
      return;
    }

    // ── Animated scene ──────────────────────────────────────────────────────
    const activeCount = mobile ? 3 : allBirds.length; // 3 on mobile, else 7
    const active = allBirds.slice(0, activeCount);
    allBirds.slice(activeCount).forEach((el) => (el.style.display = "none"));

    const vp: Viewport = { width: window.innerWidth, height: window.innerHeight };
    const birds = active.map((_, i) => new Bird(i, vp));

    const useCursor = fine; // touch => cruise only (no avoidance, no parallax)
    let mx = -9999;
    let my = -9999;
    let pmx = 0;
    let pmy = 0;
    let pcx = 0;
    let pcy = 0;

    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      pmx = (e.clientX / window.innerWidth - 0.5) * 2;
      pmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    function onLeave() {
      mx = -9999;
      my = -9999;
    }
    function onResize() {
      vp.width = window.innerWidth;
      vp.height = window.innerHeight;
    }

    if (useCursor) {
      window.addEventListener("pointermove", onMove);
      window.addEventListener("mouseleave", onLeave);
    }
    window.addEventListener("resize", onResize);

    let rafId = 0;
    let running = false;

    function tick() {
      if (!running) return;

      const pointer: Pointer | null = useCursor ? { x: mx, y: my } : null;
      birds.forEach((b, i) => {
        active[i].style.transform = b.update(vp, pointer);
      });

      if (useCursor) {
        pcx += (pmx - pcx) * 0.045;
        pcy += (pmy - pcy) * 0.045;
        layers.forEach((l) => {
          const d = parseFloat(l.dataset.depth || "0");
          l.style.transform = `translate(${-pcx * 14 * d}px, ${-pcy * 7 * d}px)`;
        });
      }

      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }
    function onVisibility() {
      if (document.visibilityState === "visible") start();
      else stop();
    }
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      allBirds.forEach((el) => {
        el.style.display = "";
        el.style.transform = "";
      });
      layers.forEach((l) => (l.style.transform = ""));
    };
  }, []);

  return (
    <>
      {/* ── Ambient SVG (z-0) ── */}
      <div ref={ambientRef} className={styles.ambient} aria-hidden="true">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Right-side dissolve mask: white = visible, black = hidden */}
            <linearGradient id="haRightFadeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="black" />
              <stop offset="32%" stopColor="black" />
              <stop offset="48%" stopColor="#3a3a3a" />
              <stop offset="62%" stopColor="#888" />
              <stop offset="78%" stopColor="#d8d8d8" />
              <stop offset="92%" stopColor="white" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
            <mask id="haRightFadeMask">
              <rect width="1600" height="900" fill="url(#haRightFadeGrad)" />
            </mask>

            {/* Warm sun aura that fades into the cream bg */}
            <radialGradient id="haSunAura" cx="0.82" cy="0.32" r="0.55">
              <stop offset="0%" stopColor="#F4C9A8" stopOpacity="0.78" />
              <stop offset="35%" stopColor="#F0D4B8" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#F5F1EA" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#F5F1EA" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="haSunGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#E94E1B" stopOpacity="0.45" />
              <stop offset="55%" stopColor="#E94E1B" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#E94E1B" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="haRidgeFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A39E94" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8A867F" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="haRidgeMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C6862" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4A4641" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="haRidgeNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A2722" stopOpacity="1" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Warm sun aura (no mask — softly extends across, fades into cream) */}
          <rect width="1600" height="900" fill="url(#haSunAura)" />

          {/* Sun glow + core (outside mask so they stay crisp on the right) */}
          <circle cx="1280" cy="370" r="220" fill="url(#haSunGlow)" />
          <g className={styles.sunGroup}>
            <circle cx="1280" cy="370" r="68" fill="#E94E1B" opacity="0.96" />
          </g>

          {/* Everything below dissolves from right to left */}
          <g mask="url(#haRightFadeMask)">
            {/* Cloud wisps */}
            <g className={styles.cloud} opacity="0.7">
              <ellipse cx="600" cy="200" rx="110" ry="5" fill="#F5F1EA" />
              <ellipse cx="630" cy="194" rx="70" ry="3" fill="#F5F1EA" opacity="0.65" />
            </g>
            <g className={styles.cloudB}>
              <ellipse cx="500" cy="155" rx="90" ry="4" fill="#F5F1EA" />
            </g>

            {/* FAR ridges */}
            <g className={styles.parallax} data-depth="0.25">
              <path
                d="M 400 620 L 520 555 L 620 590 L 730 530 L 840 575 L 960 520 L 1080 565 L 1200 510 L 1320 560 L 1450 525 L 1560 555 L 1650 540 L 1650 900 L 400 900 Z"
                fill="url(#haRidgeFar)"
              />
            </g>

            {/* MID ridges + snow caps */}
            <g className={styles.parallax} data-depth="0.55">
              <path
                d="M 380 700 L 500 615 L 620 660 L 740 590 L 860 645 L 980 580 L 1100 635 L 1230 590 L 1360 640 L 1490 615 L 1600 645 L 1650 635 L 1650 900 L 380 900 Z"
                fill="url(#haRidgeMid)"
              />
              <path d="M 740 590 L 750 583 L 762 591 L 756 600 L 760 610 L 744 606 Z" fill="#F5F1EA" opacity="0.85" />
              <path d="M 1100 635 L 1110 628 L 1120 636 L 1116 643 Z" fill="#F5F1EA" opacity="0.75" />
              <path d="M 980 580 L 992 572 L 1006 582 L 998 592 L 1003 603 L 986 598 Z" fill="#F5F1EA" opacity="0.8" />
            </g>

            {/* NEAR ridges — darkest, in front */}
            <g className={styles.parallax} data-depth="1">
              <path
                d="M 320 800 L 460 720 L 580 760 L 710 690 L 840 745 L 970 685 L 1100 735 L 1230 695 L 1360 740 L 1490 715 L 1620 745 L 1650 740 L 1650 900 L 320 900 Z"
                fill="url(#haRidgeNear)"
              />
            </g>

            {/* FOREGROUND silhouette + lone trees */}
            <g className={styles.parallax} data-depth="1.3">
              <path d="M 320 855 Q 700 838 1100 845 T 1650 850 L 1650 900 L 320 900 Z" fill="#0A0A0A" />

              {/* Larger lone tree (mid-right) */}
              <g transform="translate(820 855)" className={styles.loneTree}>
                <rect x="-1.5" y="0" width="3" height="32" fill="#0A0A0A" />
                <path d="M 0 -5 L -11 14 L 11 14 Z" fill="#0A0A0A" />
                <path d="M 0 -14 L -9 6 L 9 6 Z" fill="#0A0A0A" />
                <path d="M 0 -23 L -7 -1 L 7 -1 Z" fill="#0A0A0A" />
              </g>

              {/* Smaller tree right of sun, dimmer */}
              <g transform="translate(1380 858)" className={styles.loneTree} style={{ animationDelay: "3s" }}>
                <rect x="-1" y="0" width="2" height="20" fill="#0A0A0A" />
                <path d="M 0 -3 L -7 9 L 7 9 Z" fill="#0A0A0A" />
                <path d="M 0 -10 L -5 4 L 5 4 Z" fill="#0A0A0A" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* ── Birds (z-2) ── */}
      <div className={styles.birds} aria-hidden="true">
        {BIRDS.map((b, i) => (
          <div
            key={i}
            ref={(el) => {
              birdEls.current[i] = el;
            }}
            className={styles.bird}
            style={{ width: b.w, height: b.h }}
          >
            <svg viewBox="-14 -8 28 16">
              <g className={styles.birdWings} style={{ animationDuration: b.dur, animationDelay: b.delay }}>
                <path
                  d={b.d}
                  fill="none"
                  stroke="#0A0A0A"
                  strokeWidth={b.sw}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={b.op}
                />
              </g>
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}
