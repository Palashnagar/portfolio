"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";
import { LoupeThumb } from "@/components/work/LoupeThumb";
import { thumbDataUri } from "@/lib/thumb";
import { activePanelIndex } from "@/lib/horizontal";

// ─── Sub-components ────────────────────────────────────────────────────────────

function Thumb({ p }: { p: Project }) {
  return (
    <LoupeThumb className="h-full w-full rounded-2xl" loupeImage={thumbDataUri(p, 400, 500)}>
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <rect width="400" height="500" fill={p.color} />
        <text
          x="200"
          y="250"
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
          y="288"
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
    </LoupeThumb>
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
          fontSize: "clamp(48px, 7vw, 110px)",
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
  // ── All hooks called unconditionally at top ──────────────────────────────

  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [mode, setMode] = useState<"stack" | "carousel" | "jack">("stack");
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(projects.length - 1) * 100}vw`]
  );

  const railWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Only the jack layout renders the progress label; in stack/carousel modes
    // wrapperRef is unattached and scrollYProgress tracks the window, so skip the
    // state churn (and re-renders) entirely.
    if (mode !== "jack") return;
    setActiveIdx(activePanelIndex(p, projects.length));
  });

  useEffect(() => {
    if (prefersReduced) {
      setMode("stack");
    } else if (!window.matchMedia("(pointer: fine)").matches) {
      setMode("carousel");
    } else {
      setMode("jack");
    }
  }, [prefersReduced]);

  // ── Layout: jack (desktop + motion) ─────────────────────────────────────
  if (mode === "jack") {
    return (
      <section
        ref={wrapperRef}
        style={{ position: "relative", height: "500vh" }}
      >
        <div
          style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        >
          {/* Horizontal track */}
          <motion.div
            style={{
              x,
              display: "flex",
              height: "100%",
              willChange: "transform",
            }}
          >
            {projects.map((p) => (
              <div
                key={p.slug}
                className="group"
                style={{
                  flex: "0 0 100vw",
                  height: "100%",
                  padding: "100px 6vw 80px",
                  display: "flex",
                  gap: "6vw",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Panel number */}
                <div
                  style={{
                    position: "absolute",
                    top: 100,
                    left: "6vw",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    color: "var(--muted)",
                  }}
                >
                  {p.num} / 04
                </div>

                {/* Thumb */}
                <div
                  style={{
                    flex: "1 1 50%",
                    aspectRatio: "4/5",
                    maxHeight: "70vh",
                  }}
                >
                  <Thumb p={p} />
                </div>

                {/* Info */}
                <div style={{ flex: "1 1 50%" }}>
                  <PanelInfo p={p} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Progress label — inside sticky, scoped to section */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 50,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              whiteSpace: "nowrap",
            }}
          >
            {projects[activeIdx].num} / 04 — {projects[activeIdx].title}{" "}
            {projects[activeIdx].accent}
          </motion.div>

          {/* Progress rail — inside sticky, scoped to section */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              width: 280,
              height: 1,
              background: "rgba(10,10,10,0.15)",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                background: "var(--accent)",
                width: railWidth,
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  // ── Layout: carousel (touch) ─────────────────────────────────────────────
  if (mode === "carousel") {
    return (
      <section
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {projects.map((p) => (
          <div
            key={p.slug}
            className="group"
            style={{
              flex: "0 0 85vw",
              scrollSnapAlign: "start",
              padding: "80px 6vw",
            }}
          >
            {/* Panel number */}
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "var(--muted)",
                marginBottom: "16px",
              }}
            >
              {p.num} / 04
            </div>

            {/* Thumb */}
            <div
              style={{
                aspectRatio: "4/5",
                marginBottom: 24,
                maxHeight: "50vh",
              }}
            >
              <Thumb p={p} />
            </div>

            {/* Info */}
            <PanelInfo p={p} />
          </div>
        ))}
      </section>
    );
  }

  // ── Layout: stack (reduced-motion + SSR default) ─────────────────────────
  return (
    <section style={{ padding: "80px 6vw" }}>
      {projects.map((p) => (
        <div
          key={p.slug}
          className="group"
          style={{
            marginBottom: 120,
            display: "flex",
            gap: "6vw",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Thumb */}
          <div
            style={{
              flex: "1 1 320px",
              aspectRatio: "4/5",
              maxHeight: "70vh",
            }}
          >
            <Thumb p={p} />
          </div>

          {/* Info */}
          <div style={{ flex: "1 1 360px" }}>
            <PanelInfo p={p} />
          </div>
        </div>
      ))}
    </section>
  );
}
