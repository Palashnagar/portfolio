"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { portraits } from "@/data/portraits";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useReducedMotion } from "./hooks";

export function PortraitsFilm() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Translate the strip horizontally based on scroll progress
  const x = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-50%"]);

  // Doubled list so it loops visually
  const doubled = [...portraits, ...portraits];

  if (reduced) {
    return (
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {portraits.map((p, i) => (
          <Frame key={i} label={p.label} caption={p.caption} image={p.image} />
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        className="flex gap-6 will-change-transform"
        style={{ x, width: "200%" }}
      >
        {doubled.map((p, i) => (
          <Frame key={i} label={p.label} caption={p.caption} image={p.image} />
        ))}
      </motion.div>
    </div>
  );
}

function Frame({ label, caption, image }: { label: string; caption: string; image: string }) {
  return (
    <div className="flex-shrink-0 w-56 md:w-72">
      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[var(--bg-2)] mb-3">
        <PlaceholderImage slot="portrait" path={image} aspect="3/4" label={label} />
      </div>
      <div className="font-[family-name:var(--font-display)] italic text-[var(--accent)] text-lg">
        {label}
      </div>
      <p className="text-sm opacity-70 mt-1">{caption}</p>
    </div>
  );
}
