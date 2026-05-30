"use client";

// "Things I love" full-bleed draggable image wall (port of
// design-reference/about-wall-final.html). Tiles in vertical pairs auto-scroll
// left; drag with momentum that eases back to the base speed; seamless wrap via a
// duplicated track. Permanent two-line captions (tag + serif sentence with an
// italic-orange accent). Keyboard-navigable (Tab/Arrows center the focused tile
// and pause the drift); prefers-reduced-motion drops the autoscroll; touch gets
// a denser layout. Hides the global cursor over the wall via the shared events.

import { useEffect, useRef } from "react";
import styles from "./ImageWall.module.css";

// TODO: Palash replaces these with his real photos and voice captions.
// Each item may also take `image: "/about/<name>.jpg"`; until then a color-block
// placeholder is generated. The captions below are placeholder VOICE — rewrite
// before production.
const ITEMS: { tag: string; caption: string; image?: string }[] = [
  { tag: "Kyoto · 2024", caption: "The trip that made me <em>start journaling</em>." },
  { tag: "Listening", caption: "<em>Tame Impala</em> on every redesign." },
  { tag: "Reading", caption: "Murakami — I read <em>Norwegian Wood</em> twice." },
  { tag: "Iceland · 2023", caption: "Where I learned silence has <em>a texture</em>." },
  { tag: "Listening", caption: "Frank Ocean. Especially <em>Pyramids</em>." },
  { tag: "Hobby", caption: "Cooking dal until my mom <em>approves</em>." },
  { tag: "Mumbai · home", caption: "Where I figured out <em>what I want to make</em>." },
  { tag: "Watching", caption: "<em>The Bear</em> — the kitchen, the chaos, the love." },
  { tag: "Hobby", caption: "Film cameras. <em>One shot per moment</em>." },
  { tag: "Reading", caption: "Don Norman — <em>the book that ruined doors</em> for me." },
  { tag: "Watching", caption: "<em>Past Lives</em>. Still thinking about it." },
  { tag: "Lisbon · 2025", caption: "A whole city built around <em>azulejo tiles</em>." },
  { tag: "Listening", caption: "<em>Anderson .Paak</em> for any 2 a.m. crit night." },
  { tag: "Hobby", caption: "Long bike rides. <em>No destination</em>." },
  { tag: "Goa · 2024", caption: "Where I read <em>three books in four days</em>." },
  { tag: "Hobby", caption: "Pottery. Mostly <em>terrible</em>. Still going." },
  { tag: "Reading", caption: "Letterboxd more than <em>any social app</em>." },
  { tag: "Listening", caption: "Lo-fi for deep work. <em>Sorry, not sorry</em>." },
];

const COLORS = [
  "#E94E1B", "#1E3A5F", "#F5A623", "#2D5F3F", "#6B4530", "#8E5C8B",
  "#3A6B5C", "#C97852", "#3D4A5C", "#A56A45", "#5B7B8C", "#7A4A3A",
];

// No two adjacent tiles share a size, for visual rhythm.
const SIZE = ["szM", "szS", "szL", "szS", "szM", "szL", "szM", "szL", "szS"] as const;

// Color-block placeholder until a real photo is supplied. `copy` keeps gradient
// ids unique across the duplicated track.
function placeholderSvg(idx: number, copy: number): string {
  const c = COLORS[idx % COLORS.length];
  const v = idx % 4;
  let pattern: string;
  if (v === 0) {
    pattern = `<rect width='400' height='400' fill='${c}'/><circle cx='200' cy='200' r='95' fill='rgba(255,255,255,0.16)'/><circle cx='200' cy='200' r='52' fill='rgba(0,0,0,0.18)'/>`;
  } else if (v === 1) {
    pattern = `<rect width='400' height='400' fill='${c}'/><rect x='0' y='210' width='400' height='190' fill='rgba(0,0,0,0.22)'/><rect x='0' y='270' width='400' height='2' fill='rgba(255,255,255,0.3)'/>`;
  } else if (v === 2) {
    const id = `gx${copy}_${idx}`;
    pattern = `<defs><linearGradient id='${id}' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${c}'/><stop offset='100%' stop-color='#0A0A0A'/></linearGradient></defs><rect width='400' height='400' fill='url(%23${id})'/>`;
  } else {
    pattern = `<rect width='400' height='400' fill='${c}'/><polygon points='200,80 320,320 80,320' fill='rgba(255,255,255,0.16)'/>`;
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' preserveAspectRatio='xMidYMid slice'>${pattern}</svg>`;
}

function Tile({ idx, copy }: { idx: number; copy: number }) {
  const item = ITEMS[idx];
  const dup = copy === 1; // second copy is decorative (for the seamless loop)
  return (
    <button
      type="button"
      className={`${styles.item} ${styles[SIZE[idx % SIZE.length]]}`}
      data-tile={dup ? "dup" : "real"}
      tabIndex={dup ? -1 : 0}
      aria-hidden={dup || undefined}
    >
      <span className={styles.img}>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" loading="lazy" width={400} height={400} />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: placeholderSvg(idx, copy) }} />
        )}
      </span>
      <span className={styles.caption}>
        <span className={styles.tag}>{item.tag}</span>
        <span dangerouslySetInnerHTML={{ __html: item.caption }} />
      </span>
    </button>
  );
}

export function ImageWall() {
  const wallRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wall = wallRef.current;
    const track = trackRef.current;
    const hint = hintRef.current;
    const fill = fillRef.current;
    const label = labelRef.current;
    if (!wall || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    const BASE = reduced ? 0 : -0.5; // reduced-motion → no autoscroll

    if (touch && hint) hint.textContent = "Swipe to explore";

    let offset = 0;
    let velocity = BASE;
    let isDragging = false;
    let paused = false; // keyboard focus pauses the drift
    let target = 0;
    let hasTarget = false;
    let dragStart = 0;
    let dragStartOffset = 0;
    let lastX = 0;
    let lastT = 0;
    let half = 0;

    const measure = () => {
      half = track.scrollWidth / 2;
    };
    const mt = window.setTimeout(measure, 100);
    window.addEventListener("resize", measure);

    const hShow = window.setTimeout(() => hint?.classList.add(styles.show), 400);
    const hHide = window.setTimeout(() => hint?.classList.remove(styles.show), 3200);

    // Global cursor steps aside over the wall (grab/grabbing takes over).
    const onEnter = () => window.dispatchEvent(new Event("customCursor:hide"));
    const onLeave = () => {
      window.dispatchEvent(new Event("customCursor:show"));
      if (isDragging) {
        isDragging = false;
        wall.classList.remove(styles.dragging);
      }
    };
    wall.addEventListener("mouseenter", onEnter);
    wall.addEventListener("mouseleave", onLeave);

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      hasTarget = false;
      dragStart = e.clientX;
      dragStartOffset = offset;
      lastX = e.clientX;
      lastT = performance.now();
      wall.classList.add(styles.dragging);
      wall.setPointerCapture(e.pointerId);
      hint?.classList.remove(styles.show);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      offset = dragStartOffset + (e.clientX - dragStart);
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      velocity = ((e.clientX - lastX) / dt) * 16; // momentum at ~60fps
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      isDragging = false;
      wall.classList.remove(styles.dragging);
    };
    wall.addEventListener("pointerdown", onDown);
    wall.addEventListener("pointermove", onMove);
    wall.addEventListener("pointerup", onUp);

    // Keyboard: focusing a tile pauses the drift and centers it; arrows move focus.
    const tiles = Array.from(
      wall.querySelectorAll<HTMLButtonElement>('[data-tile="real"]')
    );
    const centerOn = (tile: HTMLElement) => {
      const wr = wall.getBoundingClientRect();
      const tr = tile.getBoundingClientRect();
      target = offset + (wr.left + wr.width / 2 - (tr.left + tr.width / 2));
      hasTarget = true;
    };
    const onFocusIn = (e: FocusEvent) => {
      if (isDragging) return; // a pointer drag isn't keyboard navigation
      const t = e.target as HTMLElement | null;
      if (!t?.matches?.('[data-tile="real"]')) return;
      // Only KEYBOARD focus pauses + centers. A mouse press also focuses the
      // button, but focus-visible is false for that — so clicks/drags don't pause.
      let keyboard = true;
      try {
        keyboard = t.matches(":focus-visible");
      } catch {
        /* :focus-visible unsupported — treat as keyboard */
      }
      if (!keyboard) return;
      paused = true;
      centerOn(t);
    };
    const onFocusOut = () => {
      window.setTimeout(() => {
        if (!wall.contains(document.activeElement)) {
          paused = false;
          hasTarget = false;
        }
      }, 0);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const i = tiles.indexOf(document.activeElement as HTMLButtonElement);
      if (i === -1) return;
      e.preventDefault();
      const ni = e.key === "ArrowRight" ? Math.min(tiles.length - 1, i + 1) : Math.max(0, i - 1);
      tiles[ni]?.focus();
    };
    wall.addEventListener("focusin", onFocusIn);
    wall.addEventListener("focusout", onFocusOut);
    wall.addEventListener("keydown", onKey);

    let raf = 0;
    const loop = () => {
      if (isDragging) {
        // Offset is driven directly by the pointer in onMove — highest priority,
        // so neither the keyboard-centering nor the autoscroll fights the drag.
      } else if (paused && hasTarget) {
        offset += (target - offset) * 0.12; // ease focused tile to center
      } else {
        velocity += (BASE - velocity) * 0.025; // momentum eases back to base
        offset += velocity;
      }
      if (half > 0) {
        if (offset <= -half) offset += half;
        if (offset > 0) offset -= half;
      }
      track.style.transform = `translate3d(${offset}px, 0, 0)`;

      if (half > 0 && fill) {
        const pct = Math.abs(offset / half);
        fill.style.transform = `translateX(${pct * 233}%)`;
        if (label) {
          const itemW = half / ITEMS.length;
          const centerOffset = Math.abs(offset) + window.innerWidth / 2;
          const idx = Math.floor(centerOffset / itemW) % ITEMS.length;
          const it = ITEMS[idx];
          if (it) label.textContent = it.tag.split(" · ")[0] || it.tag;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(mt);
      clearTimeout(hShow);
      clearTimeout(hHide);
      window.removeEventListener("resize", measure);
      wall.removeEventListener("mouseenter", onEnter);
      wall.removeEventListener("mouseleave", onLeave);
      wall.removeEventListener("pointerdown", onDown);
      wall.removeEventListener("pointermove", onMove);
      wall.removeEventListener("pointerup", onUp);
      wall.removeEventListener("focusin", onFocusIn);
      wall.removeEventListener("focusout", onFocusOut);
      wall.removeEventListener("keydown", onKey);
      window.dispatchEvent(new Event("customCursor:show"));
    };
  }, []);

  // 9 vertical pairs from 18 items; the track renders two copies for the loop.
  const pairs: number[][] = [];
  for (let i = 0; i < ITEMS.length; i += 2) pairs.push([i, i + 1]);

  return (
    <section className="border-t border-line" style={{ padding: "80px 6vw" }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-5 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-muted">
          <span className="dot-pulse inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
          About · the rest of me
        </div>
        <h2
          className="text-ink"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5.5vw, 76px)",
            lineHeight: 0.98,
            letterSpacing: "-0.025em",
          }}
        >
          Things I <em style={{ fontStyle: "italic", color: "var(--accent)" }}>love</em>, in no
          particular order.
        </h2>
        <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.55] text-ink">
          Outside of pixels and prototypes I&apos;m{" "}
          <em style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>collecting moments</em>{" "}
          — places that humbled me, songs I&apos;ve designed to, books I keep returning to, food
          I&apos;m trying to get right. Drag the wall, or just watch it drift.
        </p>
      </div>

      <div className={styles.wallWrap}>
        <div
          ref={wallRef}
          className={styles.wall}
          role="region"
          aria-label="Things I love — a draggable image wall"
        >
          <div ref={trackRef} className={styles.track}>
            {[0, 1].map((copy) =>
              pairs.map((pair, pi) => (
                <div className={styles.pair} key={`${copy}-${pi}`}>
                  {pair.map((idx) => (
                    <Tile key={`${copy}-${idx}`} idx={idx} copy={copy} />
                  ))}
                </div>
              ))
            )}
          </div>
          <div ref={hintRef} className={styles.hint} aria-hidden="true">
            Drag to explore
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px]">
        <div className={styles.progress}>
          <span>Now scrolling</span>
          <div className={styles.progressRail}>
            <div ref={fillRef} className={styles.progressFill} />
          </div>
          <span ref={labelRef}>{ITEMS[0].tag.split(" · ")[0]}</span>
        </div>
      </div>
    </section>
  );
}
