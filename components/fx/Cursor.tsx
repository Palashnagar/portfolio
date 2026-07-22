"use client";

import { useEffect, useRef, useState } from "react";
import { nextCursor, type CursorState } from "@/lib/cursor";

// Two-part cursor: a small dot that pins EXACTLY to the pointer (feels instant)
// plus a ring that eases behind it (the smooth flourish, and the part that grows
// + labels on hover per lib/cursor). Both layers are positioned via GPU
// `transform` inside a single RAF loop — no per-frame layout — and use
// mix-blend-mode so the accent auto-inverts against whatever is beneath it.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const rafRef = useRef<number>(0);
  const mx = useRef(0); // pointer target
  const my = useRef(0);
  const rx = useRef(0); // ring (eased)
  const ry = useRef(0);
  const cursorName = useRef("default");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    mx.current = rx.current = window.innerWidth / 2;
    my.current = ry.current = window.innerHeight / 2;

    document.body.classList.add("cursor-active");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The dot is always exact; only the ring eases. Reduced motion pins the ring too.
    const RING_LERP = reduced ? 1 : 0.2;

    function onPointerMove(e: PointerEvent) {
      mx.current = e.clientX;
      my.current = e.clientY;
    }

    function onPointerOver(e: PointerEvent) {
      const t = (e.target as HTMLElement).closest?.("[data-cursor]");
      const kind = t?.getAttribute("data-cursor") ?? "reset";
      const validKinds = ["link", "card", "drag", "reset"] as const;
      const trigger = validKinds.includes(kind as any)
        ? { kind: kind as "link" | "card" | "drag" | "reset" }
        : { kind: "reset" as const };

      const state: CursorState = nextCursor(cursorName.current, trigger);
      cursorName.current = state.name;
      applyState(state, reduced);
    }

    function applyState(state: CursorState, skip: boolean) {
      const ring = ringRef.current;
      const dot = dotRef.current;
      const label = labelRef.current;
      if (!ring || !dot || !label) return;

      // Ring grows on hover; the small default ring hugs the dot.
      const ringSize = state.name === "default" ? 28 : state.size + 6;
      ring.style.transition = skip
        ? "none"
        : "width 0.3s cubic-bezier(0.2,0.8,0.2,1), height 0.3s cubic-bezier(0.2,0.8,0.2,1), opacity 0.3s";
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;

      if (state.label) {
        label.textContent = state.label;
        label.style.opacity = "1";
        dot.style.opacity = "0"; // hand off to the labeled ring so it stays clean
      } else {
        label.style.opacity = "0";
        dot.style.opacity = "1";
      }
    }

    function loop() {
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate(${mx.current}px, ${my.current}px) translate(-50%, -50%)`;
      }
      rx.current += (mx.current - rx.current) * RING_LERP;
      ry.current += (my.current - ry.current) * RING_LERP;
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate(${rx.current}px, ${ry.current}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    // Areas like the case-study loupe ask the global cursor to step aside.
    function hideCursor() {
      if (dotRef.current) dotRef.current.style.visibility = "hidden";
      if (ringRef.current) ringRef.current.style.visibility = "hidden";
    }
    function showCursor() {
      if (dotRef.current) dotRef.current.style.visibility = "visible";
      if (ringRef.current) ringRef.current.style.visibility = "visible";
    }

    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerover", onPointerOver);
    window.addEventListener("customCursor:hide", hideCursor);
    window.addEventListener("customCursor:show", showCursor);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("customCursor:hide", hideCursor);
      window.removeEventListener("customCursor:show", showCursor);
      document.body.classList.remove("cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Trailing ring (eased) — also grows + holds the hover label */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid var(--accent)",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 200,
          display: "grid",
          placeItems: "center",
          willChange: "transform",
        }}
      >
        <span
          ref={labelRef}
          style={{
            color: "var(--bg)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
            opacity: 0,
            transition: "opacity 0.2s 0.05s",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        />
      </div>

      {/* Precise dot (exact) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "var(--accent)",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 201,
          transition: "opacity 0.25s",
          willChange: "transform",
        }}
      />
    </>
  );
}
