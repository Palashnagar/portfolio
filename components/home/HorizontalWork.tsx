"use client";

// Landing work section — the four case studies as a vertical stack of large
// panels (index + thumbnail + title + one-line problem + case-study link) that
// scroll straight down. Each panel does a subtle fade-and-rise as it enters the
// viewport (once, strong ease-out), honoring prefers-reduced-motion. Replaced an
// earlier horizontal scroll-jack; filename kept to avoid churning the import.

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";
import { LoupeThumb } from "@/components/work/LoupeThumb";
import { ThumbPhones } from "@/components/work/ThumbPhones";
import Image from "next/image";

// ─── Sub-components ────────────────────────────────────────────────────────────

function Thumb({ p }: { p: Project }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      data-cursor="card"
      aria-label={`Open the ${p.title} ${p.accent} case study`}
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <LoupeThumb className="h-full w-full rounded-2xl" loupeImage={p.thumb}>
        {p.thumbScreens ? (
          <ThumbPhones screens={p.thumbScreens} />
        ) : (
          <Image
            src={p.thumb}
            alt={`${p.title} ${p.accent}`}
            fill
            sizes="(max-width: 768px) 85vw, 40vw"
            style={{ objectFit: "contain", objectPosition: p.thumbFocus }}
          />
        )}
      </LoupeThumb>
    </Link>
  );
}

function PanelInfo({ p }: { p: Project }) {
  return (
    <div>
      {/* Meta row */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "24px",
        }}
      >
        {p.meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(34px, 7vw, 110px)",
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          marginBottom: "24px",
          fontWeight: 400,
        }}
      >
        {p.title}{" "}
        <em style={{ color: "var(--accent)" }}>{p.accent}</em>
      </h3>

      {/* Problem */}
      <p
        style={{
          fontSize: "19px",
          lineHeight: 1.45,
          maxWidth: "480px",
          marginBottom: "32px",
        }}
      >
        {p.problem.map((seg, i) =>
          seg.em ? (
            <em
              key={i}
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
              }}
            >
              {seg.text}
            </em>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </p>

      {/* CTA */}
      <Link
        href={`/work/${p.slug}`}
        data-cursor="card"
        style={{
          display: "inline-block",
          fontSize: "12px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--accent)",
          textDecoration: "none",
          borderBottom: "1px solid var(--accent)",
          paddingBottom: "4px",
        }}
      >
        Read the case study →
      </Link>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function HorizontalWork() {
  const prefersReduced = useReducedMotion();

  // Entrance: fade + a small rise as each panel scrolls into view. Fires once,
  // strong ease-out so it feels responsive rather than floaty. Reduced-motion
  // drops the movement entirely (renders in place, no animation props).
  const reveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
      };

  return (
    <section style={{ padding: "80px 6vw" }}>
      {projects.map((p) => (
        <motion.div
          key={p.slug}
          className="group"
          {...reveal}
          style={{ marginBottom: 120 }}
        >
          {/* Index */}
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "var(--muted)",
              marginBottom: 20,
            }}
          >
            {p.num} / {String(projects.length).padStart(2, "0")}
          </div>

          {/* Thumb + info row (wraps to stacked on narrow screens) */}
          <div
            style={{
              display: "flex",
              gap: "6vw",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: "1 1 320px",
                aspectRatio: "4/5",
                maxHeight: "70vh",
              }}
            >
              <Thumb p={p} />
            </div>

            <div style={{ flex: "1 1 360px" }}>
              <PanelInfo p={p} />
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
