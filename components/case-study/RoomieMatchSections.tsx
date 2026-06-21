// RoomieMatch case-study layout kit. Presentational sections matching
// design-reference/roomiematch-casestudy.html, built from the site's tokens/fonts
// (no HTML typefaces/weights/colors). Used only by content/case-studies/roomiematch.mdx.
// Self-contained, does not import the MyCourses kit, so that case study is untouched.
// Server components throughout (no client JS here; the traveling prototype button is
// its own client component).

import type { ReactNode } from "react";
import styles from "./RoomieMatchSections.module.css";

const IMG_BASE = "/case-studies/roomiematch/";

// Shared <picture>: WebP first, JPEG/PNG fallback. Explicit width/height reserve
// space to prevent layout shift; the container's aspect-ratio + object-fit:cover
// make the art fill its slot. Below-the-fold, so lazy + async-decoded.
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

// Placeholder shown in an image slot until the real mockup file is dropped in.
function Slot({ file, children }: { file: string; children: ReactNode }) {
  return (
    <div className={styles.slot}>
      <span className={styles.slotFile}>→ {file}</span>
      <span>{children}</span>
    </div>
  );
}

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

// ── 01 Problem: 3-card grid ───────────────────────────────────────────────────
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

export function Pullquote({ children }: { children: ReactNode }) {
  return (
    <div className={styles.pullquote}>
      <p>{children}</p>
    </div>
  );
}

// ── 02 Research: chips, key-insight band, persona quote, HMW list ─────────────
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

export function InsightBand({ kicker = "Key insight", children }: { kicker?: string; children: ReactNode }) {
  return (
    <div className={styles.insightBand}>
      <div className={styles.k}>{kicker}</div>
      <p>{children}</p>
    </div>
  );
}

export function Persona({ cite, children }: { cite: string; children: ReactNode }) {
  return (
    <blockquote className={styles.persona}>
      <p>{children}</p>
      <div className={styles.cite}>{cite}</div>
    </blockquote>
  );
}

export function Hmw({ items }: { items: string[] }) {
  return (
    <div className={styles.hmw}>
      {items.map((q, i) => (
        <div className={styles.hmwItem} key={i}>
          <span className={styles.n} aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={styles.q}>{q}</span>
        </div>
      ))}
    </div>
  );
}

// ── 03 Constraints: bets + deliberately-left-out box ──────────────────────────
export function Bets({ children }: { children: ReactNode }) {
  return <div className={styles.bets}>{children}</div>;
}
export function Bet({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.bet}>
      <p>
        <b>{title}</b> {children}
      </p>
    </div>
  );
}
export function LeftOut({
  title = "What I deliberately left out",
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

// ── 04 Solution: insight/decision split (with onboarding media) ───────────────
type MediaProps = {
  webp?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  slotFile?: string;
  slot?: string;
};

export function IdSplit({
  media,
  insight,
  decision,
  caption,
}: {
  media: MediaProps;
  insight: ReactNode;
  decision: ReactNode;
  caption: ReactNode;
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
          <Slot file={media.slotFile ?? "mockup.png"}>{media.slot}</Slot>
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
        <div className={styles.idCap}>{caption}</div>
      </div>
    </div>
  );
}

// ── 04 Solution: the three design-decision cards ──────────────────────────────
export function DesignDecisions({ children }: { children: ReactNode }) {
  return <div className={styles.dd}>{children}</div>;
}
export function Decision({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className={styles.ddItem}>
      <div className={styles.n}>{n}</div>
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}

// ── 04 Solution: full-width mockup gallery (image or pending-asset slot) ───────
export function Gallery({
  webp,
  src,
  alt,
  width,
  height,
  slotFile,
  slot,
  caption,
}: MediaProps & { caption?: ReactNode }) {
  return (
    <>
      <div className={styles.gallery}>
        {src ? (
          <Picture webp={webp} src={src} alt={alt ?? ""} width={width} height={height} />
        ) : (
          <Slot file={slotFile ?? "mockup-row.png"}>{slot}</Slot>
        )}
      </div>
      {caption && <div className={styles.caption}>{caption}</div>}
    </>
  );
}

// ── 05 Outcome: dark takeaway card ────────────────────────────────────────────
export function Takeaway({
  title = "Why this project matters",
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
