// RIT Athletics case-study layout kit. Presentational sections matching
// design-reference/rit-athletics-casestudy.html, built from the site's
// tokens/fonts (no HTML typefaces/weights/colors). Used only by
// content/case-studies/rit-athletics.mdx. Self-contained — does not import the
// other case-study kits, so they stay untouched. Server components throughout
// (the traveling deck button is its own client component).

import type { ReactNode } from "react";
import styles from "./RitAthleticsSections.module.css";

const IMG_BASE = "/case-studies/rit-athletics/";

// Shared <picture>: WebP first, JPEG fallback. Explicit width/height reserve
// space (no layout shift); below the fold, so lazy + async-decoded.
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

// ── Content image (or pending-asset slot) + caption ───────────────────────────
type ImageFrameProps = {
  webp?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: ReactNode;
  variant?: "wide" | "tall";
  slotFile?: string;
  slot?: string;
};

export function ImageFrame({
  webp,
  src,
  alt,
  width,
  height,
  caption,
  variant = "wide",
  slotFile,
  slot,
}: ImageFrameProps) {
  return (
    <>
      {src ? (
        <div className={styles.imgframe}>
          <Picture webp={webp} src={src} alt={alt ?? ""} width={width} height={height} />
        </div>
      ) : (
        <div
          className={`${styles.imgframe} ${variant === "tall" ? styles.slotTall : styles.slotWide}`}
        >
          <Slot file={slotFile ?? "mockup.png"}>{slot}</Slot>
        </div>
      )}
      {caption && <div className={styles.caption}>{caption}</div>}
    </>
  );
}

// ── 01 Problem: numbered findings ─────────────────────────────────────────────
export function Findings({ children }: { children: ReactNode }) {
  return <div className={styles.findings}>{children}</div>;
}
export function Finding({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className={styles.finding}>
      <span className={styles.n} aria-hidden>
        {n}
      </span>
      <div>
        <h4>{title}</h4>
        <p>{children}</p>
      </div>
    </div>
  );
}

// ── 02 Research: method chips, persona cards, journey-map table ───────────────
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

export function PersonaGrid({ children }: { children: ReactNode }) {
  return <div className={styles.personaGrid}>{children}</div>;
}
export function PersonaCard({
  name,
  tag,
  children,
}: {
  name: ReactNode;
  tag: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.personaCard}>
      <div className={styles.pname}>{name}</div>
      <div className={styles.ptag}>{tag}</div>
      <p>{children}</p>
    </div>
  );
}

export function JourneyMap({
  head,
  columns,
  rows,
}: {
  head: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className={styles.jmap}>
      <div className={styles.jhead}>{head}</div>
      <div className={styles.jscroll}>
        <table className={styles.jtable}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  title = "What I left out",
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
