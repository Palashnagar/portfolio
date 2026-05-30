import type { Metadata } from "next";
import { ExplorationsGrid } from "@/components/explorations/ExplorationsGrid";

export const metadata: Metadata = {
  title: "Explorations · Palash Nagar",
  description:
    "The work that doesn't fit a case study — UI explorations, micro-animations, research notes, mockups, and sketches.",
};

export default function ExplorationsPage() {
  return (
    <section style={{ padding: "140px 6vw 96px" }}>
      <div className="mx-auto max-w-content">
        <header className="mb-12 max-w-[880px]">
          <div className="mb-4 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-muted">
            <span
              className="dot-pulse inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
              aria-hidden
            />
            Explorations · ongoing
          </div>
          <h1
            className="text-ink"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 7vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
            }}
          >
            Things I&apos;ve been{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>making</em>, in between.
          </h1>
          <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.55] text-ink">
            The stuff that doesn&apos;t fit a case study — UI explorations, micro-animations,
            research notes, mockups, sketches.{" "}
            <em style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
              Less polished, more curious.
            </em>
          </p>
        </header>

        <ExplorationsGrid />
      </div>
    </section>
  );
}
