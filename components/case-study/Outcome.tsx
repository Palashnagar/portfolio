// Case-study spine section 6 — Outcome / what I'd do next: measurable result if
// available (big serif accent metrics) + reflection on what to improve. Omit the
// metrics prop (or wrap values in <Todo> in prose) when numbers aren't real.

import type { ReactNode } from "react";
import { SectionFrame } from "./SectionFrame";

export function Outcome({
  number = "05",
  title,
  metrics,
  children,
}: {
  number?: string;
  title: ReactNode;
  metrics?: { value: ReactNode; label: ReactNode }[];
  children: ReactNode;
}) {
  return (
    <SectionFrame number={number} label="Outcome & next" title={title}>
      {metrics && metrics.length > 0 && (
        <ul className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {metrics.map((m, i) => (
            <li key={i}>
              <div
                className="leading-none text-accent"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 60px)" }}
              >
                {m.value}
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted">
                {m.label}
              </p>
            </li>
          ))}
        </ul>
      )}
      {children}
    </SectionFrame>
  );
}
