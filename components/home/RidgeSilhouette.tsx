// A calm, static mountain-ridge band that echoes the hero's ambient scene.
// Used to ground the otherwise-empty full-bleed "beat" sections (IntroSlate,
// ContactCta) so they don't read as dead cream. Presentational + decorative:
// no motion, aria-hidden, pointer-events:none, and it sits behind section text.
//
// Anchored to the bottom of its (relative) parent. Tune presence per use via the
// `className` (height) and `opacity` props.

export function RidgeSilhouette({
  className = "",
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 -z-10 ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1600 240"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        {/* Far range — soft and muted */}
        <path
          d="M0 150 L 180 112 L 360 142 L 560 96 L 760 138 L 980 92 L 1200 132 L 1420 102 L 1600 130 L 1600 240 L 0 240 Z"
          fill="var(--muted)"
          opacity="0.3"
        />
        {/* Near range — warm dark, matching the hero's near ridge */}
        <path
          d="M0 200 L 220 150 L 420 186 L 640 134 L 860 182 L 1080 140 L 1320 180 L 1520 150 L 1600 176 L 1600 240 L 0 240 Z"
          fill="#2A2722"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
