// Shared layout for the numbered spine sections (Problem, Research, Constraints,
// Solution, Outcome). Anatomy ported from the reference case-study wireframe:
// left rail = serif-italic accent number + uppercase small-caps label; right
// column = serif section title + body. Server component, no interactivity.

import type { ReactNode } from "react";

export function SectionFrame({
  number,
  label,
  title,
  children,
}: {
  number: string;
  label: string;
  title: ReactNode;
  children: ReactNode;
}) {
  const headingId = `cs-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

  return (
    <section
      aria-labelledby={headingId}
      className="border-t border-line"
      style={{ padding: "80px 6vw" }}
    >
      <div className="mx-auto grid max-w-[1100px] gap-8 md:grid-cols-[140px_1fr] md:gap-12">
        <div className="md:pt-2">
          <div
            aria-hidden
            className="leading-none text-accent"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(32px, 4vw, 44px)" }}
          >
            {number}
          </div>
          <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted">
            {label}
          </div>
        </div>

        <div>
          <h2
            id={headingId}
            className="text-ink"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h2>
          <div className="mt-7 max-w-[640px] space-y-5 text-[17px] leading-[1.6] text-ink">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
