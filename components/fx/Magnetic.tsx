"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { magneticOffset } from "@/lib/magnetic";

export function Magnetic({
  children,
  radius = 80,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  radius?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabledRef = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  useEffect(() => {
    enabledRef.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <motion.span
      ref={ref}
      data-cursor="link"
      className={className}
      style={{ x: springX, y: springY, display: "inline-block" }}
      onPointerMove={(e) => {
        if (!enabledRef.current || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const o = magneticOffset(
          { x: e.clientX, y: e.clientY },
          rect,
          radius,
          strength
        );
        x.set(o.x);
        y.set(o.y);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
