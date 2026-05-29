// A single research insight (lives inside <Research>): serif-italic accent
// number + statement, with optional evidence (an <Evidence> quote/stat) below.

import type { ReactNode } from "react";

export function Insight({
  number,
  title,
  children,
}: {
  number?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-4 border-t border-line py-6 first:border-t-0">
      {number && (
        <span
          aria-hidden
          className="leading-none text-accent"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "26px" }}
        >
          {number}
        </span>
      )}
      <div className={number ? "" : "col-span-2"}>
        <p className="text-[19px] font-medium leading-snug text-ink">{title}</p>
        {children && <div className="mt-2 text-[15px] leading-relaxed text-muted">{children}</div>}
      </div>
    </div>
  );
}
