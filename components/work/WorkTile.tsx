import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { CaseStudyMeta } from "@/data/case-studies";

export function WorkTile({ cs }: { cs: CaseStudyMeta }) {
  return (
    <Link
      href={`/work/${cs.slug}`}
      data-cursor="View →"
      className="block group"
    >
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[var(--bg-2)] mb-5 transition-transform group-hover:scale-[0.99]">
        <PlaceholderImage
          slot="cover"
          path={cs.cover}
          aspect="4/3"
          label={cs.title}
        />
      </div>
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
          {cs.title}
        </h3>
        <span className="text-xs uppercase tracking-wider opacity-55">
          {cs.year}
        </span>
      </div>
      <div className="text-xs uppercase tracking-[0.12em] text-[var(--accent)] mb-2">
        {cs.role}
      </div>
      <p className="text-sm opacity-70 max-w-md">{cs.tagline}</p>
    </Link>
  );
}
