"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { useReveal, useReducedMotion } from "@/components/motion/hooks";
import {
  HeroWave,
  Thinking,
  Pointing,
  Peeking,
  Celebrating,
} from "./variants";

export type CharacterVariant =
  | "hero-wave"
  | "thinking"
  | "pointing"
  | "peeking"
  | "celebrating";

interface PalashCharacterProps {
  variant: CharacterVariant;
  size?: number;
  decorative?: boolean;
  label?: string;
  className?: string;
}

const DEFAULT_SIZES: Record<CharacterVariant, number> = {
  "hero-wave": 360,
  thinking: 96,
  pointing: 96,
  peeking: 64,
  celebrating: 120,
};

const DEFAULT_LABELS: Record<CharacterVariant, string> = {
  "hero-wave": "Illustration of Palash waving hello",
  thinking: "Illustration of Palash thinking",
  pointing: "Illustration of Palash pointing",
  peeking: "Illustration of Palash peeking",
  celebrating: "Illustration of Palash celebrating",
};

export function PalashCharacter({
  variant,
  size,
  decorative = true,
  label,
  className,
}: PalashCharacterProps) {
  const reveal = useReveal();
  const reduced = useReducedMotion();
  const reactId = useId();
  const hatchId = `${reactId}-palash-hatch`;
  const displaySize = size ?? DEFAULT_SIZES[variant];
  const ariaLabel = label ?? DEFAULT_LABELS[variant];

  const Variant = (() => {
    switch (variant) {
      case "hero-wave":
        return <HeroWave animate={!reduced} hatchId={hatchId} />;
      case "thinking":
        return <Thinking hatchId={hatchId} />;
      case "pointing":
        return <Pointing hatchId={hatchId} />;
      case "peeking":
        return <Peeking hatchId={hatchId} />;
      case "celebrating":
        return <Celebrating hatchId={hatchId} />;
    }
  })();

  return (
    <motion.div
      {...reveal}
      className={className}
      style={{ width: displaySize, display: "inline-block" }}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : ariaLabel}
    >
      {Variant}
    </motion.div>
  );
}
