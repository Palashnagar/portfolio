"use client";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <>
      {/* Cream curtain: covers, then fades away. pointer-events-none so it never blocks interaction. */}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[150] pointer-events-none"
        style={{ background: "var(--bg)" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      {/* Page content rises into place */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {children}
      </motion.div>
    </>
  );
}
