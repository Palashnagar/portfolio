"use client";

import { motion } from "framer-motion";

export const CharacterDefs = ({ id }: { id: string }) => (
  <defs>
    <pattern
      id={id}
      patternUnits="userSpaceOnUse"
      width="3"
      height="3"
      patternTransform="rotate(45)"
    >
      <line
        x1="0"
        y1="0"
        x2="0"
        y2="3"
        stroke="#8b3d05"
        strokeWidth="0.5"
        opacity="0.3"
      />
    </pattern>
  </defs>
);

// Shared face fragment — used by every variant for consistency
const Face = ({ blink = false }: { blink?: boolean }) => (
  <>
    <ellipse cx="80" cy="68" rx="30" ry="32" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="1.5" />
    <path d="M53 56 Q56 32 78 30 Q104 30 109 56 Q104 50 96 49 Q92 56 84 54 Q78 58 72 52 Q66 56 60 50 Q55 54 53 56 Z" fill="var(--ink)" />
    <path d="M56 42 L60 32" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M64 38 L66 30" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M88 35 L86 28" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M98 40 L102 33" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
    <ellipse cx="68" cy="72" rx="7" ry="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    <ellipse cx="92" cy="72" rx="7" ry="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    <path d="M75 72 Q78 70 85 72" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
    {!blink && (
      <>
        <circle cx="68" cy="72" r="1.5" fill="var(--ink)" />
        <circle cx="92" cy="72" r="1.5" fill="var(--ink)" />
      </>
    )}
    {blink && (
      <>
        <line x1="64" y1="72" x2="72" y2="72" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="88" y1="72" x2="96" y2="72" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
      </>
    )}
    <path d="M62 65 Q68 63 74 65" stroke="var(--ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M86 65 Q92 63 98 65" stroke="var(--ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M70 85 Q80 92 90 84" stroke="var(--ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <ellipse cx="60" cy="82" rx="4" ry="3" fill="#d97757" opacity="0.4" />
    <ellipse cx="100" cy="82" rx="4" ry="3" fill="#d97757" opacity="0.4" />
  </>
);

const Body = ({ hatchId }: { hatchId: string }) => (
  <>
    <path
      d="M48 102 Q46 99 52 99 L107 100 Q113 100 113 104 L116 178 Q117 184 110 184 L50 183 Q44 184 45 178 Z"
      fill="var(--accent)"
      stroke="var(--ink)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M48 102 Q46 99 52 99 L107 100 Q113 100 113 104 L116 178 Q117 184 110 184 L50 183 Q44 184 45 178 Z"
      fill={`url(#${hatchId})`}
    />
    <path
      d="M72 92 L73 105 L87 105 L88 92"
      fill="var(--accent-2)"
      stroke="var(--ink)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </>
);

export function HeroWave({ animate, hatchId }: { animate: boolean; hatchId: string }) {
  return (
    <svg
      viewBox="0 0 160 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <CharacterDefs id={hatchId} />
      <Body hatchId={hatchId} />
      <path
        d="M48 108 Q42 130 45 158 Q46 162 51 162 L58 162 Q63 162 60 156 Q57 130 56 112"
        fill="var(--accent)"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <motion.g
        style={{ originX: "108px", originY: "108px", transformBox: "fill-box" }}
        animate={animate ? { rotate: [0, 18, -8, 18, 0] } : { rotate: 0 }}
        transition={animate ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <path
          d="M110 108 Q124 100 128 78 L132 58 Q136 53 138 58 Q140 64 134 72 L132 92 Q128 102 122 110"
          fill="var(--accent)"
          stroke="var(--ink)"
          strokeWidth="1.5"
        />
        <circle cx="135" cy="55" r="9" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1="135" y1="48" x2="135" y2="52" stroke="var(--ink)" strokeWidth="1" />
        <line x1="139" y1="50" x2="138" y2="54" stroke="var(--ink)" strokeWidth="1" />
      </motion.g>
      <Face />
      <path d="M50 190 Q80 188 110 191" stroke="var(--ink)" strokeWidth="1.2" fill="none" opacity="0.4" />
    </svg>
  );
}

export function Thinking({ hatchId }: { hatchId: string }) {
  return (
    <svg
      viewBox="0 0 160 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <CharacterDefs id={hatchId} />
      <Body hatchId={hatchId} />
      <path
        d="M48 108 Q42 130 45 158 Q46 162 51 162 L58 162 Q63 162 60 156 Q57 130 56 112"
        fill="var(--accent)"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <path
        d="M110 110 Q120 102 115 92 L100 88"
        fill="var(--accent)"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="95" cy="86" r="8" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <Face />
    </svg>
  );
}

export function Pointing({ hatchId }: { hatchId: string }) {
  return (
    <svg
      viewBox="0 0 160 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <CharacterDefs id={hatchId} />
      <Body hatchId={hatchId} />
      <path
        d="M48 108 Q42 130 45 158 Q46 162 51 162 L58 162 Q63 162 60 156 Q57 130 56 112"
        fill="var(--accent)"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <path
        d="M110 110 Q130 108 144 104 L148 100"
        fill="var(--accent)"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="148" cy="100" r="8" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="152" y1="100" x2="158" y2="98" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" />
      <Face />
    </svg>
  );
}

export function Peeking({ hatchId }: { hatchId: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <CharacterDefs id={hatchId} />
      <Face />
    </svg>
  );
}

export function Celebrating({ hatchId }: { hatchId: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <CharacterDefs id={hatchId} />
      <g transform="translate(20, 0)">
        <Body hatchId={hatchId} />
        <path
          d="M48 108 Q35 90 30 70 L26 50 Q22 45 20 50 Q18 56 22 64 L26 84 Q30 96 36 110"
          fill="var(--accent)"
          stroke="var(--ink)"
          strokeWidth="1.5"
        />
        <circle cx="22" cy="48" r="9" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="1.5" />
        <path
          d="M110 108 Q123 90 128 70 L132 50 Q136 45 138 50 Q140 56 136 64 L132 84 Q128 96 122 110"
          fill="var(--accent)"
          stroke="var(--ink)"
          strokeWidth="1.5"
        />
        <circle cx="135" cy="48" r="9" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="1.5" />
        <Face blink />
      </g>
      <path d="M30 5 L30 15 M0 8 L8 14 M50 8 L42 14" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M170 5 L170 15 M140 8 L148 14 M190 8 L182 14" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
