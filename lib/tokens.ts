export const colors = {
  bg: "#f6efe3",
  bg2: "#ede5d4",
  ink: "#2b1d12",
  ink2: "#5a3a22",
  accent: "#b45309",
  accent2: "#d4a373",
  accentSoft: "rgba(180, 83, 9, 0.12)",
  line: "rgba(43, 29, 18, 0.12)",
} as const;

export const motion = {
  easeOutQuart: [0.25, 1, 0.5, 1] as const,
  durationFast: 0.4,
  durationBase: 0.7,
  durationSlow: 1.2,
} as const;
