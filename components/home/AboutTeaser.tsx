// Short researcher-meets-designer teaser on the homepage (spec §6). Editorial
// serif lead + a portrait photo + link to /about. Server component.
//
// The left panel is Palash at SUMMIT One Vanderbilt (/me/portrait.jpg), rendered
// via next/image in a bordered, slightly rounded 4/5 frame, with "UX · HCI" /
// "SUMMIT · NYC" kept as cream label overlays for editorial continuity.

import Image from "next/image";
import Link from "next/link";

export default function AboutTeaser() {
  return (
    <section className="px-[6vw] py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-[6vw] md:grid-cols-2">
        {/* Portrait, Palash at SUMMIT One Vanderbilt. The framing labels stay
            as cream overlays (over subtle scrims) for editorial continuity. */}
        <div className="relative aspect-[4/5] max-h-[60vh] overflow-hidden rounded-2xl border border-line">
          <Image
            src="/me/portrait.jpg"
            alt="Palash at SUMMIT One Vanderbilt, the Midtown Manhattan skyline behind him"
            fill
            sizes="(max-width: 768px) 90vw, 40vw"
            className="object-cover"
          />
          {/* top + bottom scrims keep the labels legible over any part of the photo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.5) 0%, transparent 24%, transparent 70%, rgba(10,10,10,0.6) 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <span
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ color: "var(--bg)", fontFamily: "var(--font-mono)" }}
            >
              UX · HCI
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ color: "var(--bg)", fontFamily: "var(--font-mono)" }}
            >
              SUMMIT · NYC
            </span>
          </div>
        </div>

        {/* Copy */}
        <div>
          <div className="mb-6 text-[13px] uppercase tracking-[0.15em] text-muted">
            About
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3vw, 36px)",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            A UX designer driven by curiosity and a pull toward real problems
            for real people, turning complex challenges into intuitive, minimal
            experiences that{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
              make life easier.
            </em>{" "}
            Lately I work where design meets AI: prototyping in Framer, prompting
            Claude, building in an afternoon what once took weeks. Always
            evolving, always designing.
          </p>
          <Link
            href="/about"
            data-cursor="link"
            className="mt-8 inline-block text-[13px] uppercase tracking-[0.15em] text-accent-text"
            style={{ borderBottom: "1px solid var(--accent-text)", paddingBottom: "4px" }}
          >
            More about me →
          </Link>
        </div>
      </div>
    </section>
  );
}
