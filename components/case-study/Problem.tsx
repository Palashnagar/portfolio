// Case-study spine section 2 — The problem: what was broken, who it affected,
// why it mattered. Body should include a data point or user quote via <Evidence>.

import type { ReactNode } from "react";
import { SectionFrame } from "./SectionFrame";

export function Problem({
  number = "01",
  title,
  children,
}: {
  number?: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <SectionFrame number={number} label="The problem" title={title}>
      {children}
    </SectionFrame>
  );
}
