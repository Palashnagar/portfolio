// RIT EATS case-study layout kit. Presentational sections matching
// design-reference/rit-eats-casestudy.html, built from the site's tokens/fonts
// (no HTML typefaces/weights/colors). Used only by content/case-studies/rit-eats.mdx.
// Self-contained, does not import the other case-study kits. Server components
// throughout (the traveling prototype button is its own client component).

import type { ReactNode } from "react";
import styles from "./RitEatsSections.module.css";

const IMG_BASE = "/case-studies/rit-eats/";

function Picture({
  webp,
  src,
  alt,
  width,
  height,
}: {
  webp?: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return (
    <picture>
      {webp && <source srcSet={IMG_BASE + webp} type="image/webp" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMG_BASE + src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

function Slot({ file, children }: { file: string; children: ReactNode }) {
  return (
    <div className={styles.slot}>
      <span className={styles.slotFile}>→ {file}</span>
      <span>{children}</span>
    </div>
  );
}

// ── Section shell ─────────────────────────────────────────────────────────────
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

// ── 03 Role note (intentional content, not a TODO) ────────────────────────────
export function RoleNote({ label = "My role", children }: { label?: string; children: ReactNode }) {
  return (
    <div className={styles.rolenote}>
      <span className={styles.k}>{label}</span>
      <p>{children}</p>
    </div>
  );
}

// ── 01 Problem: 3-up cards + stat band ────────────────────────────────────────
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

export function StatBand({ children }: { children: ReactNode }) {
  return <div className={styles.stats}>{children}</div>;
}
export function Stat({ big, src, children }: { big: string; src: string; children: ReactNode }) {
  return (
    <div className={styles.stat}>
      <div className={styles.big}>{big}</div>
      <div className={styles.lab}>{children}</div>
      <div className={styles.src}>{src}</div>
    </div>
  );
}

// ── 02 Research ───────────────────────────────────────────────────────────────
export function Chips({ items }: { items: string[] }) {
  return (
    <div className={styles.chips}>
      {items.map((c) => (
        <span className={styles.chip} key={c}>
          {c}
        </span>
      ))}
    </div>
  );
}

export function InsightBand({ kicker = "The key insight", children }: { kicker?: string; children: ReactNode }) {
  return (
    <div className={styles.insightBand}>
      <div className={styles.k}>{kicker}</div>
      <p>{children}</p>
    </div>
  );
}

// ── 03 Directions considered (real ordered list; one marked chosen) ───────────
export function Directions({ children }: { children: ReactNode }) {
  return <ol className={styles.dirs}>{children}</ol>;
}
export function Direction({
  n,
  title,
  chosen = false,
  children,
}: {
  n: string;
  title: string;
  chosen?: boolean;
  children: ReactNode;
}) {
  return (
    <li className={`${styles.dir} ${chosen ? styles.dirChosen : ""}`}>
      <span className={styles.n} aria-hidden>
        {n}
      </span>
      <div>
        <h4>
          {title}
          {chosen && <span className={styles.tag}>chosen</span>}
        </h4>
        <p>{children}</p>
      </div>
    </li>
  );
}

export function LeftOut({
  title = "What we left out",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.leftout}>
      <div className={styles.k}>{title}</div>
      <p>{children}</p>
    </div>
  );
}

// ── 04 Two-sided solution pillars (real lists inside each card) ───────────────
export function Pillars({ children }: { children: ReactNode }) {
  return <div className={styles.pillars}>{children}</div>;
}
export function Pillar({ side, title, items }: { side: string; title: string; items: string[] }) {
  return (
    <div className={styles.pillar}>
      <div className={styles.side}>{side}</div>
      <h4>{title}</h4>
      <ul>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

// ── 04 Content image (or pending-asset slot) + caption ────────────────────────
type MediaProps = {
  webp?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  slotFile?: string;
  slot?: string;
};

export function ImageFrame({ webp, src, alt, width, height, slotFile, slot, caption, scroll }: MediaProps & { caption?: ReactNode; scroll?: boolean }) {
  return (
    <>
      {src ? (
        <div className={`${styles.imgframe}${scroll ? " " + styles.scrollable : ""}`}>
          <Picture webp={webp} src={src} alt={alt ?? ""} width={width} height={height} />
        </div>
      ) : (
        <div className={`${styles.imgframe} ${styles.slotWide}`}>
          <Slot file={slotFile ?? "screens.png"}>{slot}</Slot>
        </div>
      )}
      {caption && <div className={styles.caption}>{caption}</div>}
    </>
  );
}

// ── 04 Insight/decision split (delivery-side media) ───────────────────────────
export function IdSplit({
  media,
  insight,
  decision,
}: {
  media: MediaProps;
  insight: ReactNode;
  decision: ReactNode;
}) {
  return (
    <div className={styles.idGrid}>
      <div className={styles.idMedia}>
        {media.src ? (
          <Picture
            webp={media.webp}
            src={media.src}
            alt={media.alt ?? ""}
            width={media.width}
            height={media.height}
          />
        ) : (
          <Slot file={media.slotFile ?? "screens.png"}>{media.slot}</Slot>
        )}
      </div>
      <div>
        <div className={styles.idBlock}>
          <div className={`${styles.k} ${styles.kInsight}`}>Insight</div>
          <p>{insight}</p>
        </div>
        <div className={styles.idBlock}>
          <div className={`${styles.k} ${styles.kDecision}`}>Decision</div>
          <p>{decision}</p>
        </div>
      </div>
    </div>
  );
}

// ── 05 Outcome: dark takeaway card ────────────────────────────────────────────
export function Takeaway({
  title = "What it taught me",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.takeaway}>
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}
