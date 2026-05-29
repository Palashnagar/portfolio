"use client";

import { useEffect, useRef, useState } from "react";
import { nextCursor, type CursorState } from "@/lib/cursor";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);

  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // RAF / state refs (no re-renders)
  const rafRef = useRef<number>(0);
  const mx = useRef(0);
  const my = useRef(0);
  const cx = useRef(0);
  const cy = useRef(0);
  const cursorName = useRef("default");

  useEffect(() => {
    // SSR guard + touch guard
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Init position at viewport center
    cx.current = window.innerWidth / 2;
    cy.current = window.innerHeight / 2;
    mx.current = cx.current;
    my.current = cy.current;

    // Hide native cursor
    document.body.classList.add("cursor-active");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const LERP = reducedMotion ? 1 : 0.22;

    // pointermove: track target
    function onPointerMove(e: PointerEvent) {
      mx.current = e.clientX;
      my.current = e.clientY;
    }

    // pointerover: state delegation via data-cursor attribute
    function onPointerOver(e: PointerEvent) {
      const t = (e.target as HTMLElement).closest?.("[data-cursor]");
      const kind = t?.getAttribute("data-cursor") ?? "reset";
      const validKinds = ["link", "card", "drag", "reset"] as const;
      const trigger = validKinds.includes(kind as any)
        ? { kind: kind as "link" | "card" | "drag" | "reset" }
        : { kind: "reset" as const };

      const state: CursorState = nextCursor(cursorName.current, trigger);
      cursorName.current = state.name;
      applyState(state, reducedMotion);
    }

    function applyState(state: CursorState, skipTransition: boolean) {
      const dot = dotRef.current;
      const label = labelRef.current;
      if (!dot || !label) return;

      const scale = state.size / 10;
      dot.style.transition = skipTransition
        ? "none"
        : "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)";
      dot.style.transform = `scale(${scale})`;

      if (state.label) {
        label.textContent = state.label;
        label.style.opacity = "1";
      } else {
        label.style.opacity = "0";
      }
    }

    // RAF loop
    function loop() {
      cx.current += (mx.current - cx.current) * LERP;
      cy.current += (my.current - cy.current) * LERP;

      const outer = outerRef.current;
      if (outer) {
        outer.style.left = `${cx.current}px`;
        outer.style.top = `${cy.current}px`;
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerover", onPointerOver);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.body.classList.remove("cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={outerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 200,
        transform: "translate(-50%, -50%)",
        mixBlendMode: "difference",
        left: "50%",
        top: "50%",
      }}
    >
      {/* Inner dot: handles scaling only */}
      <div
        ref={dotRef}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "var(--accent)",
          transform: "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      />
      {/* Label: absolutely centered inside the dot */}
      <span
        ref={labelRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          color: "var(--bg)",
          fontSize: 9,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          opacity: 0,
          transition: "opacity 0.2s 0.1s",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      />
    </div>
  );
}
