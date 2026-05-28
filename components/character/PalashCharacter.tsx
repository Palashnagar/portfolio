"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/components/motion/hooks";
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

export function PalashCharacter({
  variant,
  size,
  decorative = true,
  label,
  className,
}: PalashCharacterProps) {
  const reveal = useReveal();
  const displaySize = size ?? DEFAULT_SIZES[variant];
  const ariaLabel =
    label ?? (variant === "hero-wave" ? "Illustration of Palash waving hello" : undefined);

  const Variant = (() => {
    const ariaHidden = decorative;
    switch (variant) {
      case "hero-wave":
        return <HeroWave animate={true} ariaHidden={ariaHidden} />;
      case "thinking":
        return <Thinking ariaHidden={ariaHidden} />;
      case "pointing":
        return <Pointing ariaHidden={ariaHidden} />;
      case "peeking":
        return <Peeking ariaHidden={ariaHidden} />;
      case "celebrating":
        return <Celebrating ariaHidden={ariaHidden} />;
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
