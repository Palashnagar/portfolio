"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMagnetic } from "@/components/motion/hooks";
import clsx from "clsx";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ href, children, className }: MagneticButtonProps) {
  const { ref, x, y } = useMagnetic(0.25);

  return (
    <Link href={href}>
      <motion.span
        ref={ref as React.RefObject<HTMLSpanElement>}
        animate={{ x, y }}
        transition={{ type: "spring", damping: 18, stiffness: 220 }}
        className={clsx(
          "inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[var(--ink)] text-[var(--bg)] font-medium hover:shadow-lg transition-shadow",
          className,
        )}
        data-cursor="Open →"
      >
        {children}
      </motion.span>
    </Link>
  );
}
