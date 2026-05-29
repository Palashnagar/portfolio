// 2-column work index grid (anatomy from 04-hover-distortion.html): each card
// is a distortion thumbnail + meta row + serif title with accent + one-line
// desc. Hover distortion + title→accent are CSS (group-hover), so this stays a
// server component. Driven by data/projects.ts.

import Link from "next/link";
import { projects } from "@/data/projects";
import { DistortThumb } from "@/components/fx/Distortion";

export function WorkGrid() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {projects.map((p) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          data-cursor="card"
          className="group block no-underline"
        >
          {/* Thumbnail (branded color title-card, 4:3) */}
          <DistortThumb className="aspect-[4/3] w-full rounded-2xl">
            <svg
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid slice"
              style={{ display: "block", width: "100%", height: "100%" }}
            >
              <rect width="400" height="300" fill={p.color} />
              <text
                x="200"
                y="150"
                textAnchor="middle"
                fill={p.textColor}
                fontFamily="var(--font-display)"
                fontSize="40"
                fontStyle="italic"
              >
                {p.title} {p.accent}
              </text>
              <text
                x="200"
                y="186"
                textAnchor="middle"
                fill={p.textColor}
                opacity="0.55"
                fontFamily="var(--font-body)"
                fontSize="11"
                letterSpacing="3"
              >
                {p.accent.toUpperCase()}
              </text>
            </svg>
          </DistortThumb>

          {/* Meta row */}
          <div className="mt-4 flex justify-between text-[11px] uppercase tracking-[0.15em] text-muted">
            <span>
              {p.meta[0]} · {p.meta[p.meta.length - 1]}
            </span>
            <span>{p.num} / 04</span>
          </div>

          {/* Title */}
          <h3
            className="mt-2 text-ink transition-colors group-hover:text-accent"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {p.title} <em style={{ color: "var(--accent)" }}>{p.accent}</em>
          </h3>

          {/* One-line desc */}
          <p className="mt-2.5 max-w-[480px] text-[14px] leading-[1.45] text-ink opacity-70">
            {p.desc}
          </p>
        </Link>
      ))}
    </div>
  );
}
