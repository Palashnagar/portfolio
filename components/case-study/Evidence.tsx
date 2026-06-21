// Evidence: a quote or stat backing a claim, with its source. Used inside
// Problem (a data point / user quote) and inside each Insight. If the quote or
// stat isn't real, wrap the value in <Todo> rather than inventing it.

import type { ReactNode } from "react";

export function Evidence({
  source,
  children,
}: {
  source?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="my-6 border-l-2 border-accent pl-5">
      <blockquote
        className="text-ink"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(20px, 2.4vw, 26px)", lineHeight: 1.3 }}
      >
        {children}
      </blockquote>
      {source && (
        <figcaption className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted">
{source}
        </figcaption>
      )}
    </figure>
  );
}
