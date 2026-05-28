"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isTouch, setIsTouch] = useState(true);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const cx = useSpring(x, { damping: 30, stiffness: 400 });
  const cy = useSpring(y, { damping: 30, stiffness: 400 });

  useEffect(() => {
    setIsTouch(
      typeof window !== "undefined" &&
        (matchMedia("(pointer: coarse)").matches || "ontouchstart" in window),
    );

    if (matchMedia("(pointer: coarse)").matches) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      const cur = target.closest("[data-cursor]") as HTMLElement | null;
      setLabel(cur?.dataset.cursor ?? null);
    };

    window.addEventListener("pointermove", move);
    document.body.style.cursor = "none";
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.style.cursor = "";
    };
  }, [x, y]);

  if (isTouch) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center rounded-full font-medium uppercase tracking-wider text-[var(--bg)]"
      style={{
        x: cx,
        y: cy,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: label ? 64 : 12,
        height: label ? 64 : 12,
        backgroundColor: label ? "var(--accent)" : "var(--ink)",
        fontSize: label ? 10 : 0,
      }}
      transition={{ type: "spring", damping: 22, stiffness: 320 }}
    >
      {label}
    </motion.div>
  );
}
