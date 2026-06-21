// Missing-data marker (CRITICAL convention, spec §10): wherever a real number,
// quote, sample size, or outcome is unavailable, render this instead of
// fabricating. Visible orange inline tag, announced as a note to assistive tech.
// Authors MUST also leave an MDX/HTML comment in source next to it.

import type { ReactNode } from "react";

export function Todo({ children }: { children: ReactNode }) {
  return (
    <span
      role="note"
      className="mx-0.5 inline-flex items-baseline rounded-[2px] border border-accent/40 bg-accent/10 px-2 py-0.5 text-[13px] font-medium text-accent"
      style={{ fontFamily: "var(--font-body)" }}
    >
      TODO: needs data from Palash, {children}
    </span>
  );
}
