// ASND case-study kit. The section anatomy (CsSection, problem grid, stat band,
// directions, pillars, insight/decision split, role note, takeaway) is reused from the
// RIT EATS kit, so ASND renders in the same portfolio tokens (cream / ink / orange /
// Instrument Serif / JetBrains Mono) as the other four studies. This file adds only the
// ASND-specific exhibits: an attributed Quote, the ranking-weight Rubric, and an
// ImageFrame. ImageFrame renders a labelled placeholder slot until the real prototype
// screens are captured into /public/case-studies/asnd/; swap the slot for the real
// <img> once those files exist.

import type { CSSProperties, ReactNode } from "react";
import styles from "./AsndSections.module.css";

export {
  CsSection,
  Caption,
  ProblemCard,
  StatBand,
  Stat,
  Chips,
  InsightBand,
  Directions,
  Direction,
  Pillars,
  Pillar,
  RoleNote,
  Takeaway,
} from "./RitEatsSections";

// ASND problem/principle grid. Same hairline-divider styling as the RIT EATS grid, but
// the column count is explicit (`cols`) so the four problems sit 2x2 and the six
// principles sit 3x2, with no orphaned empty cells.
export function ProblemGrid({ cols = 3, children }: { cols?: number; children: ReactNode }) {
  return (
    <div className={styles.pgrid} style={{ "--pcols": cols } as CSSProperties}>
      {children}
    </div>
  );
}

export function Quote({ cite, children }: { cite: string; children: ReactNode }) {
  return (
    <figure className={styles.quote}>
      <blockquote>{children}</blockquote>
      <figcaption>{cite}</figcaption>
    </figure>
  );
}

// A two-column labelled split (no forced media), for before/after and
// insight/decision pairs. Distinct from the RIT EATS IdSplit, which requires a media
// image and hardcodes its "Insight"/"Decision" labels.
export function Split({
  aLabel,
  a,
  bLabel,
  b,
}: {
  aLabel: string;
  a: ReactNode;
  bLabel: string;
  b: ReactNode;
}) {
  return (
    <div className={styles.split}>
      <div className={styles.splitCol}>
        <div className={styles.splitK}>{aLabel}</div>
        <p>{a}</p>
      </div>
      <div className={styles.splitCol}>
        <div className={styles.splitK}>{bLabel}</div>
        <p>{b}</p>
      </div>
    </div>
  );
}

export function Rubric({
  items,
}: {
  items: { k: string; v: number; locked?: boolean }[];
}) {
  const max = Math.max(...items.map((i) => i.v));
  return (
    <div className={styles.rubric}>
      {items.map((it) => (
        <div key={it.k} className={`${styles.row}${it.locked ? ` ${styles.locked}` : ""}`}>
          <span className={styles.rk}>{it.k}</span>
          <span className={styles.track}>
            <span className={styles.bar} style={{ width: `${Math.round((it.v / max) * 100)}%` }} />
          </span>
          <span className={styles.rv}>{it.v.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export function ImageFrame({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className={styles.imgframe}>
      <div
        className={styles.slot}
        role="img"
        aria-label={alt}
        style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
      >
        <span className={styles.slotFile}>screen · {src}</span>
        <span className={styles.slotAlt}>{alt}</span>
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
