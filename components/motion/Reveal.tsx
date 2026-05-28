"use client";

import { motion } from "framer-motion";
import { useReveal, type RevealConfig } from "./hooks";

interface RevealProps extends RevealConfig {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer";
}

export function Reveal({
  children,
  className,
  as = "div",
  ...config
}: RevealProps) {
  const props = useReveal(config);
  const MotionTag = motion[as];

  return (
    <MotionTag className={className} {...props}>
      {children}
    </MotionTag>
  );
}
