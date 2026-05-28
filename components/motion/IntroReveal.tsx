"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "./hooks";

const LETTERS = "PALASH".split("");
const STORAGE_KEY = "palash-intro-seen";

export function IntroReveal() {
  const [showIntro, setShowIntro] = useState(false);
  const [phase, setPhase] = useState<"letters" | "tagline" | "done">("letters");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setShowIntro(true);
    sessionStorage.setItem(STORAGE_KEY, "1");

    const t1 = setTimeout(() => setPhase("tagline"), 1500);
    const t2 = setTimeout(() => setPhase("done"), 3000);
    const t3 = setTimeout(() => setShowIntro(false), 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reduced]);

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg)]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(180,83,9,0.35) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: phase === "done" ? 0 : 0.6, scale: 1.1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        />
        <div className="font-[family-name:var(--font-display)] text-7xl md:text-9xl tracking-tight">
          {LETTERS.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.15,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              {ch}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
