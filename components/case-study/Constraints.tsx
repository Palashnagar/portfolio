// Case-study spine section 4, Constraints & decisions: what was worked around,
// what was deliberately ignored, and why.

import type { ReactNode } from "react";
import { SectionFrame } from "./SectionFrame";

export function Constraints({
  number = "03",
  title,
  children,
}: {
  number?: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <SectionFrame number={number} label="Constraints & decisions" title={title}>
      {children}
    </SectionFrame>
  );
}
