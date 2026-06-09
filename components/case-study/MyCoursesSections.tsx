// MyCourses case-study layout kit. Presentational sections matching
// design-reference/mycourses-casestudy.html, built from the site's tokens/fonts
// (no HTML typefaces/weights/colors). Used only by content/case-studies/mycourses.mdx;
// other case studies keep their existing components. Server components throughout
// (the demo video is a plain HTML5 <video>, no client JS).

import type { ReactNode } from "react";
import styles from "./MyCoursesSections.module.css";

const IMG_BASE = "/case-studies/mycourses/";

// ── Section shell: italic accent number + mono label + serif heading ──────────
export function CsSection({
  num,
  label,
  title,
  children,
}: {
  num: string;
  label: string;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.section} aria-label={label}>
      <div className={styles.inner}>
        <div className={styles.secNum}>
          <span className={styles.num}>{num}</span>
          <span className={styles.label}>{label}</span>
        </div>
        {title && <h2 className={styles.secH}>{title}</h2>}
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <div className={styles.caption}>{children}</div>;
}

// ── Problem: 2×2 card grid ────────────────────────────────────────────────────
export function ProblemGrid({ children }: { children: ReactNode }) {
  return <div className={styles.probGrid}>{children}</div>;
}
export function ProblemCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.prob}>
      <div className={styles.probHead}>
        <span className={styles.scDot} aria-hidden />
        <span className={styles.scTitle}>{title}</span>
      </div>
      <div className={styles.scDesc}>{children}</div>
    </div>
  );
}

// ── Research: paired big stats + horizontal bar chart ─────────────────────────
export function StatRow({ children }: { children: ReactNode }) {
  return <div className={styles.statRow}>{children}</div>;
}
export function Stat({ value, children }: { value: string; children: ReactNode }) {
  return (
    <div className={styles.bigstat}>
      <div className={styles.n}>
        <em>{value}</em>
      </div>
      <div className={styles.d}>{children}</div>
    </div>
  );
}

export function BarChart({
  title,
  sub,
  rows,
}: {
  title: string;
  sub: string;
  rows: { label: string; pct: number }[];
}) {
  // rows are passed in descending order, so the first (highest) bar is accented.
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartTitle}>{title}</div>
      <div className={styles.chartSub}>{sub}</div>
      <div className={styles.hbar}>
        {rows.map((r, i) => (
          <div className={styles.hbarRow} key={r.label}>
            <div className={styles.hbarLabel}>{r.label}</div>
            <div className={styles.hbarTrack}>
              <div
                className={`${styles.hbarFill} ${i === 0 ? styles.primary : styles.muted}`}
                style={{ width: `${r.pct}%` }}
              >
                {r.pct}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Strategy: 3 intent cards ──────────────────────────────────────────────────
export function IntentGrid({ children }: { children: ReactNode }) {
  return <div className={styles.intentGrid}>{children}</div>;
}
export function Intent({
  numeral,
  title,
  children,
}: {
  numeral: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.intent}>
      <div className={styles.ic}>{numeral}</div>
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}

// ── Solution: zig-zag pillar (text + media, alternating sides) ────────────────
export function Pillar({
  num,
  title,
  lead,
  points,
  media,
  flip = false,
}: {
  num: string;
  title: string;
  lead: string;
  points: string[];
  media: { src: string; alt: string }[];
  flip?: boolean;
}) {
  return (
    <div className={`${styles.pillar} ${flip ? styles.flip : ""}`}>
      <div>
        <div className={styles.pillarNum}>{num}</div>
        <h3>{title}</h3>
        <p>{lead}</p>
        <ul>
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <div className={styles.pillarMedia}>
        {media.map((m) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={m.src} src={IMG_BASE + m.src} alt={m.alt} loading="lazy" decoding="async" />
        ))}
      </div>
    </div>
  );
}

// ── In motion: the demo screen recording ──────────────────────────────────────
export function VideoEmbed({ src, label }: { src: string; label: string }) {
  return (
    <div className={styles.videoFrame}>
      <video
        controls
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        src={IMG_BASE + src}
      />
    </div>
  );
}

// ── Final reveal: the full dashboard, uncropped + centered ────────────────────
export function Reveal({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={styles.reveal}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMG_BASE + src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}

// ── Reflection: dark takeaway card ────────────────────────────────────────────
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <div className={styles.takeaway}>
      <h4>Reflection</h4>
      <p>{children}</p>
    </div>
  );
}
