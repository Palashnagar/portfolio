// Case-study spine section 5, The solution: walk through key screens/flows,
// showing how each insight mapped to a design decision. Wraps <Screen> items.

import type { ReactNode } from "react";
import { SectionFrame } from "./SectionFrame";

export function Solution({
  number = "04",
  title,
  children,
}: {
  number?: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <SectionFrame number={number} label="The solution" title={title}>
      {children}
    </SectionFrame>
  );
}
