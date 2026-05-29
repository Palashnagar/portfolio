// Captioned image for case-study artifacts that aren't solution walkthroughs —
// research diagrams, survey slides, process shots, hero beauty shots. Uses
// object-contain so diagrams and full screens are never cropped. For solution
// screens that pair an image with an insight→decision rationale, use <Screen>.

import Image from "next/image";
import type { ReactNode } from "react";

export function Figure({
  src,
  alt,
  caption,
  aspect = "16/9",
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  aspect?: string;
}) {
  return (
    <figure className="my-10">
      <div
        className="relative overflow-hidden rounded-[2px] border border-line bg-ink/[0.03]"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1100px) 1024px, 100vw"
          className="object-contain"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-[13px] italic leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
