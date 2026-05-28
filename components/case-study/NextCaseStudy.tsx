import Link from "next/link";
import { caseStudies } from "@/data/case-studies";

export function NextCaseStudy({ currentSlug }: { currentSlug: string }) {
  const idx = caseStudies.findIndex((c) => c.slug === currentSlug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <section className="max-w-content mx-auto px-6 md:px-10 py-24 border-t border-[var(--line)]">
      <Link
        href={`/work/${next.slug}`}
        data-cursor="Open →"
        className="block group"
      >
        <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
          Next case study →
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl group-hover:text-[var(--accent)] transition-colors">
          {next.title}
        </h2>
        <p className="mt-3 max-w-2xl opacity-75 text-lg">{next.tagline}</p>
      </Link>
    </section>
  );
}
