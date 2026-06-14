// Case-study spine section 7 — Next project link (bottom of every study).
// Pulls the next project from data/projects.ts, wrapping around to the first.

import Link from "next/link";
import { projects } from "@/data/projects";

export function NextProject({ currentSlug }: { currentSlug: string }) {
  const idx = projects.findIndex((p) => p.slug === currentSlug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <section
      aria-labelledby="cs-next-project"
      className="border-t border-line"
      style={{ padding: "80px 6vw" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <Link
          href={`/work/${next.slug}`}
          data-cursor="card"
          className="group block no-underline"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-text">
            Next project →
          </p>
          <h2
            id="cs-next-project"
            className="mt-3 text-ink transition-colors group-hover:text-accent"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 7vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            {next.title} <em style={{ color: "var(--accent)" }}>{next.accent}</em>
          </h2>
          <p className="mt-3 max-w-[480px] text-[15px] leading-[1.45] text-muted">
            {next.desc}
          </p>
        </Link>
      </div>
    </section>
  );
}
