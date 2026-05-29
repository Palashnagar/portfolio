// Case-study spine section 3 — Research: methods + sample size (rendered as
// small-caps chips), then 3–5 <Insight> children (max), each pairing a
// statement with <Evidence>.

import type { ReactNode } from "react";
import { SectionFrame } from "./SectionFrame";

export function Research({
  number = "02",
  title,
  methods,
  children,
}: {
  number?: string;
  title: ReactNode;
  methods?: string[];
  children: ReactNode;
}) {
  return (
    <SectionFrame number={number} label="Research" title={title}>
      {methods && methods.length > 0 && (
        <ul
          className="flex flex-wrap gap-2"
          aria-label="Methods and sample size"
        >
          {methods.map((m) => (
            <li
              key={m}
              className="border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-muted"
            >
              {m}
            </li>
          ))}
        </ul>
      )}
      {children}
    </SectionFrame>
  );
}
