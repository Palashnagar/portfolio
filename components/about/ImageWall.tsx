"use client";

// "Things I love" full-bleed draggable wall (port of
// design-reference/about-wall-final.html), real photos, three cassette-tape
// SVGs, two book-cover SVGs, and one autoplaying video. Tiles in vertical pairs
// auto-scroll left; drag with momentum easing back to base; seamless wrap via a
// duplicated track. Always-on two-line captions. Keyboard-navigable (Tab/Arrows
// center the focused tile + pause the drift); reduced-motion drops the autoscroll
// AND video autoplay; touch gets a denser layout. The global cursor hides over
// the wall via the shared events; the video pauses when scrolled offscreen.

import { useEffect, useRef } from "react";
import styles from "./ImageWall.module.css";

interface WallItem {
  tag: string;
  caption: string; // may include <em> for the italic-orange accent
  image?: string; // photo (.jpg, has @1x/@2x variants) or illustration (.svg)
  type?: "video";
  video?: string;
  poster?: string;
  size?: "sm" | "md" | "lg" | "xl"; // tile width override (else the rhythm below)
  focus?: string; // object-position for cover-cropped photos, e.g. "50% 35%"
}

// Real content. Order intentionally mixes places / music / books / food / video
// so the wall feels varied as it drifts. SVGs are the hand-built cassette + book
// illustrations; .jpg items have @1x (480w) / @2x (720w) variants in /public/about.
const ITEMS: WallItem[] = [
  { tag: "NYC · ongoing", caption: "Lower Manhattan from the water. <em>Still manifesting</em> a life there.", image: "/about/nyc-skyline-night.jpg" },
  { tag: "Listening · always", caption: "MJ on loop. <em>Every era</em>, every mood.", image: "/about/mj.svg", size: "sm" },
  { tag: "Sri Lanka · 2024", caption: "First time on a board. <em>Mostly falling</em>, fully grinning.", image: "/about/sri-lanka-surf.jpg" },
  { tag: "Eating · NYC", caption: "Apollo Bagels. <em>Worth</em> the line every time.", image: "/about/apollo-bagels.jpg" },
  { tag: "Reading · the classic", caption: "Don Norman. <em>The book that ruined doors</em> for me.", image: "/about/don-norman.svg" },
  { tag: "Rochester · winter", caption: "Christmas market in ROC. <em>Cold hands</em>, warm spiced everything.", image: "/about/roc-winter-market.jpg", size: "sm", focus: "50% 58%" },
  { tag: "Lake Placid · spring break", caption: "A whole spring break in the Adirondacks. <em>I came back rearranged</em>.", image: "/about/lake-placid-chapel.jpg" },
  { tag: "Listening · current", caption: "Charlie Puth. <em>That ear for melody</em>, I keep going back.", image: "/about/charlie-puth.svg", size: "sm" },
  { tag: "Vern's · ROC", caption: "Vern's, again. <em>I can't pretend</em> I'm here for anything but the pizza.", image: "/about/verns.jpg" },
  { tag: "NYC · 2024", caption: "First time at Summit. The whole city, <em>all at once</em>.", image: "/about/summit.jpg" },
  { tag: "Lake Placid · still", caption: "The lake, frozen flat. <em>Making memories</em> with a camera between us.", image: "/about/lake-placid-frozen.jpg", size: "xl" },
  { tag: "Reading · currently", caption: "<em>The Black Swan.</em> Taleb is <em>ruining</em> my optimism in the best way.", image: "/about/black-swan.svg" },
  { tag: "Sri Lanka · with the boys", caption: "Three best friends, one beach. <em>I'll remember this one.</em>", image: "/about/sri-lanka-friends.jpg", size: "lg", focus: "50% 40%" },
  { tag: "NYC · Roosevelt tram", caption: "The East River from a window. <em>Always looking south.</em>", image: "/about/east-river.jpg" },
  { tag: "Listening · forever", caption: "Maroon 5 since forever. <em>The album I designed</em> my first website to.", image: "/about/maroon5.svg", size: "sm" },
  { tag: "NYC · November", caption: "Late November in midtown. <em>The city in soft holiday mode.</em>", image: "/about/empire-state-night.jpg" },
  { tag: "Climbing · regular thing", caption: "Indoor bouldering. <em>Falling productively</em>, on purpose.", image: "/about/bouldering.jpg", size: "sm", focus: "50% 32%" },
  { tag: "Ritual · every morning", caption: "A good bowl. <em>That's the whole start</em> of the day.", image: "/about/breakfast-bowl.jpg" },
  { tag: "Niagara · Maid of the Mist", caption: "A bird, a rainbow, and <em>one perfect frame</em>.", image: "/about/niagara-rainbow.jpg", size: "lg", focus: "50% 42%" },
  { tag: "Rochester · first time on ice", caption: "First time skating. <em>Smoother than I deserved.</em>", type: "video", video: "/about/ice-skating.mp4", poster: "/about/ice-skating-poster.jpg" },
];

// Default rhythm for items without an explicit `size`: no two adjacent tiles
// share a width. Items can override via `size` (e.g. landscapes → "xl",
// portraits → "sm" so the subject isn't cropped by a wide tile).
const SIZE = ["szM", "szS", "szL", "szS", "szM", "szL", "szM", "szL", "szS"] as const;

const SIZE_CLASS: Record<NonNullable<WallItem["size"]>, string> = {
  sm: styles.szS,
  md: styles.szM,
  lg: styles.szL,
  xl: styles.szXL,
};

const cleanCaption = (c: string) => c.replace(/<\/?em>/g, "");

function TileMedia({ item }: { item: WallItem }) {
  if (item.type === "video") {
    // No `autoplay` attr, play/pause is driven by the IntersectionObserver in
    // the effect (and stays paused → poster under reduced motion).
    return (
      <>
        <video
          muted
          loop
          playsInline
          preload="metadata"
          poster={item.poster}
          aria-hidden="true"
          draggable={false}
          data-wall-video
        >
          <source src={item.video} type="video/mp4" />
        </video>
        <span className={styles.playBadge} aria-hidden="true">
          ▶ Video
        </span>
      </>
    );
  }
  const src = item.image!;
  if (src.endsWith(".svg")) {
    // Illustrations scale natively, no srcset. draggable=false stops the browser
    // from starting a native image-drag when you grab the wall.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />;
  }
  const base = src.replace(/\.jpg$/, "");
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={`${base}@2x.jpg`}
      srcSet={`${base}@1x.jpg 480w, ${base}@2x.jpg 720w`}
      sizes="(max-width: 700px) 215px, 380px"
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      style={item.focus ? { objectPosition: item.focus } : undefined}
    />
  );
}

function Tile({ idx, copy }: { idx: number; copy: number }) {
  const item = ITEMS[idx];
  const dup = copy === 1; // second copy is decorative (for the seamless loop)
  const sizeClass = item.size ? SIZE_CLASS[item.size] : styles[SIZE[idx % SIZE.length]];
  return (
    // Non-clickable, but focusable for keyboard nav: an image labelled by its
    // caption (no fake button). The inner media is decorative (alt="").
    <div
      className={`${styles.item} ${sizeClass}`}
      data-tile={dup ? "dup" : "real"}
      role="img"
      aria-label={dup ? undefined : `${item.tag}, ${cleanCaption(item.caption)}`}
      tabIndex={dup ? -1 : 0}
      aria-hidden={dup || undefined}
    >
      <span className={styles.img}>
        <TileMedia item={item} />
      </span>
      <span className={styles.caption} aria-hidden="true">
        <span className={styles.tag}>{item.tag}</span>
        <span dangerouslySetInnerHTML={{ __html: item.caption }} />
      </span>
    </div>
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
      wall.querySelectorAll<HTMLElement>('[data-tile="real"]')
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
      // Only KEYBOARD focus pauses + centers; a mouse press that focuses the tile
      // shouldn't (focus-visible is false for that).
      let keyboard = true;
      try {
        keyboard = t.matches(":focus-visible");
      } catch {
        /* :focus-visible unsupported, treat as keyboard */
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
      const i = tiles.indexOf(document.activeElement as HTMLElement);
      if (i === -1) return;
      e.preventDefault();
      const ni = e.key === "ArrowRight" ? Math.min(tiles.length - 1, i + 1) : Math.max(0, i - 1);
      tiles[ni]?.focus();
    };
    wall.addEventListener("focusin", onFocusIn);
    wall.addEventListener("focusout", onFocusOut);
    wall.addEventListener("keydown", onKey);

    // Video: play only while on-screen; never autoplay under reduced motion.
    const videos = Array.from(
      wall.querySelectorAll<HTMLVideoElement>("video[data-wall-video]")
    );
    let io: IntersectionObserver | null = null;
    if (videos.length && !reduced) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const v = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) v.play().catch(() => {});
            else v.pause();
          });
        },
        { threshold: 0 }
      );
      videos.forEach((v) => io!.observe(v));
    }

    let raf = 0;
    const loop = () => {
      if (isDragging) {
        // Offset is driven directly by the pointer in onMove, highest priority,
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
      io?.disconnect();
      window.dispatchEvent(new Event("customCursor:show"));
    };
  }, []);

  // 10 vertical pairs from 20 items; the track renders two copies for the loop.
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
          <em style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>collecting moments</em>:{" "}
places that humbled me, songs I&apos;ve designed to, books I keep returning to, food
          I&apos;m trying to get right. Drag the wall, or just watch it drift.
        </p>
      </div>

      <div className={styles.wallWrap}>
        <div
          ref={wallRef}
          className={styles.wall}
          role="region"
          aria-label="Things I love, a draggable image wall"
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
