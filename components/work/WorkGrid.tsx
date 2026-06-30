// 2-column work index grid (anatomy from 04-hover-distortion.html): each card
// is a distortion thumbnail + meta row + serif title with accent + one-line
// desc. Hover distortion + title→accent are CSS (group-hover), so this stays a
// server component. Driven by data/projects.ts.

import Link from "next/link";
import { projects } from "@/data/projects";
import { LoupeThumb } from "@/components/work/LoupeThumb";
import { ThumbPhones } from "@/components/work/ThumbPhones";
import Image from "next/image";

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
          <LoupeThumb className="aspect-[4/3] w-full rounded-2xl" loupeImage={p.thumb}>
            {p.thumbScreens ? (
              <ThumbPhones screens={p.thumbScreens} />
            ) : (
              <Image
                src={p.thumb}
                alt={`${p.title} ${p.accent}`}
                fill
                sizes="(max-width: 768px) 92vw, 46vw"
                style={{ objectFit: "contain", objectPosition: p.thumbFocus }}
              />
            )}
          </LoupeThumb>

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
