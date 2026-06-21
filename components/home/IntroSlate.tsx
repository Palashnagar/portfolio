// Calm full-viewport slate between the kinetic hero and the horizontal work
// section. Gives the eye a beat before scroll-jacking begins (spec §5). Pure
// presentational server component, the scroll-hint bounce is CSS-only and is
// neutralized by the global prefers-reduced-motion block in globals.css.

import { RidgeSilhouette } from "@/components/home/RidgeSilhouette";

export default function IntroSlate() {
  return (
    <section
      className="relative flex min-h-[72vh] flex-col justify-center overflow-hidden"
      style={{ padding: "0 6vw", isolation: "isolate" }}
    >
      {/* Faint ridge echo, quiet visual anchor for the transitional beat. */}
      <RidgeSilhouette className="h-[26%]" opacity={0.5} />

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "clamp(48px, 9vw, 140px)",
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
        }}
      >
        Selected work{" "}
        <span style={{ color: "var(--muted)" }}>·</span>{" "}
        <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
          04 projects
        </em>
      </h2>

      <div
        style={{
          marginTop: "60px",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        Scroll to begin
        <span
          aria-hidden
          className="scroll-arrow"
          style={{ display: "inline-block", marginLeft: "10px" }}
        >
          ↓
        </span>
      </div>
    </section>
  );
}
