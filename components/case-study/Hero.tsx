// Case-study Hero (spine section 1): project name, role, timeline, team size,
// one-line outcome. Rendered by the route from frontmatter, above the MDX body.
// Server component.

import type { ReactNode } from "react";

export function Hero({
  title,
  role,
  year,
  duration,
  team,
  outcome,
  children,
  media,
}: {
  title: ReactNode;
  role: string;
  year: string;
  duration: string;
  team: string;
  outcome?: ReactNode;
  children?: ReactNode;
  // Optional hero media, when present the hero becomes a two-column split
  // (text left, media right) and the title scales down to fit the column.
  media?: ReactNode;
}) {
  const meta = [role, year, duration, team].filter(Boolean);

  const textBlock = (
    <>
      <div className="mb-6 flex flex-wrap items-center text-[11px] uppercase tracking-[0.2em] text-muted">
        {meta.map((m, i) => (
          <span key={i} className="flex items-center">
            {i > 0 && <span aria-hidden className="mx-3 text-line">·</span>}
            {m}
          </span>
        ))}
      </div>

      <h1
        className="text-ink"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: media ? "clamp(44px, 6.5vw, 88px)" : "clamp(48px, 9vw, 128px)",
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
        }}
      >
        {title}
      </h1>

      {outcome && (
        <p
          className="mt-6 max-w-[700px] text-ink"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 2.6vw, 30px)",
            lineHeight: 1.3,
          }}
        >
          {outcome}
        </p>
      )}

      {children}
    </>
  );

  return (
    <header style={{ padding: "140px 6vw 56px" }}>
      <div className="mx-auto max-w-[1100px]">
        {media ? (
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.05fr] md:gap-14">
            <div>{textBlock}</div>
            <div>{media}</div>
          </div>
        ) : (
          textBlock
        )}
      </div>
    </header>
  );
}
