// Short researcher-meets-designer teaser on the homepage (spec §6). Editorial
// serif lead + a typographic portrait block + link to /about. Server component.
//
// No portrait photo asset exists yet, so the left panel is a typographic
// name-card (sanctioned by the plan: "real file or a clean typographic block if
// none"). TODO: when Palash provides a portrait, drop it at /me/portrait.jpg and
// render via next/image inside the bordered frame to replace the monogram.

import Link from "next/link";

export default function AboutTeaser() {
  return (
    <section className="px-[6vw] py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-[6vw] md:grid-cols-2">
        {/* Typographic portrait block */}
        <div className="flex aspect-[4/5] max-h-[60vh] flex-col justify-between border border-line p-8">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
            UX · HCI
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(72px, 12vw, 150px)",
              lineHeight: 0.9,
            }}
          >
            P<span style={{ color: "var(--accent)" }}>N</span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Rochester, NY
          </span>
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
            I&apos;m a UX designer and HCI researcher at RIT. My capstone turns{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
              thermal illusions
            </em>{" "}
            into wearables; my day-to-day turns messy problems into interfaces
            that feel calm and legible. I like the seam where research meets
            craft.
          </p>
          <Link
            href="/about"
            data-cursor="link"
            className="mt-8 inline-block text-[13px] uppercase tracking-[0.15em] text-accent"
            style={{ borderBottom: "1px solid var(--accent)", paddingBottom: "4px" }}
          >
            More about me →
          </Link>
        </div>
      </div>
    </section>
  );
}
