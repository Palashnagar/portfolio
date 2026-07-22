"use client";

import { useEffect, useRef, useState } from "react";
import { nextCursor, type CursorState } from "@/lib/cursor";

// Single accent dot that rides mix-blend-mode:difference, so it inverts whatever is
// under it, and grows + labels on hover (states in lib/cursor). It tracks the
// pointer EXACTLY (no easing/trail) and is positioned with a GPU transform written
// straight from pointermove, so there is no per-frame layout and no idle work.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);

  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const cursorName = useRef("default");

  useEffect(() => {
    // SSR guard + touch guard
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const outer = outerRef.current;
    if (!outer) return;

    // Start at viewport center until the first move.
    outer.style.transform = `translate(${window.innerWidth / 2}px, ${window.innerHeight / 2}px) translate(-50%, -50%)`;

    document.body.classList.add("cursor-active");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Exact positioning: write the transform straight from the event. No lerp, no
    // trail, no RAF loop idling when the pointer is still.
    function onPointerMove(e: PointerEvent) {
      outer!.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
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

    // The case-study loupe asks the global cursor to step aside while it acts as
    // the cursor (visibility hidden, not removed).
    function hideCursor() {
      outer!.style.visibility = "hidden";
    }
    function showCursor() {
      outer!.style.visibility = "visible";
    }

    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerover", onPointerOver);
    window.addEventListener("customCursor:hide", hideCursor);
    window.addEventListener("customCursor:show", showCursor);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("customCursor:hide", hideCursor);
      window.removeEventListener("customCursor:show", showCursor);
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
        left: 0,
        top: 0,
        pointerEvents: "none",
        zIndex: 200,
        mixBlendMode: "difference",
        transform: "translate(-50%, -50%)",
        willChange: "transform",
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
