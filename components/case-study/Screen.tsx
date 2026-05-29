// A solution walkthrough item (lives inside <Solution>): one screen/flow image
// paired with the insight → decision mapping that justifies it. If no real
// screenshot is available, renders a <Todo> marker rather than a placeholder —
// never fabricate a screen.

import Image from "next/image";
import type { ReactNode } from "react";
import { Todo } from "./Todo";

export function Screen({
  src,
  alt,
  caption,
  insight,
  decision,
  aspect = "4/3",
}: {
  src?: string;
  alt?: string;
  caption?: ReactNode;
  insight?: ReactNode;
  decision?: ReactNode;
  aspect?: string;
}) {
  return (
    <figure className="my-10 grid items-start gap-6 md:grid-cols-2 md:gap-10">
      <div
        className="relative overflow-hidden rounded-[2px] border border-line bg-ink/[0.03]"
        style={{ aspectRatio: aspect }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? ""}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <Todo>screen image{alt ? ` — ${alt}` : ""}</Todo>
          </span>
        )}
      </div>

      <div className="md:pt-2">
        {insight && (
          <>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Insight</p>
            <p className="mt-1 text-[16px] leading-relaxed text-ink">{insight}</p>
          </>
        )}
        {decision && (
          <>
            <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-accent">Decision</p>
            <p className="mt-1 text-[16px] leading-relaxed text-ink">{decision}</p>
          </>
        )}
        {caption && (
          <figcaption className="mt-5 text-[13px] italic leading-relaxed text-muted">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
