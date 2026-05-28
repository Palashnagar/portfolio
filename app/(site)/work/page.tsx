import { Reveal } from "@/components/motion/Reveal";
import { WorkTile } from "@/components/work/WorkTile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { caseStudies } from "@/data/case-studies";

export const metadata = {
  title: "Work — Palash Nagar",
  description: "Selected case studies in UX/UI and product design.",
};

export default function WorkIndexPage() {
  return (
    <main>
      <section className="max-w-content mx-auto px-6 md:px-10 pt-24 pb-16">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
            Selected work · {String(caseStudies.length).padStart(2, "0")} projects
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl tracking-tight leading-[1.0]">
            Things I've <em>built.</em>
          </h1>
        </Reveal>
      </section>

      <section className="max-w-content mx-auto px-6 md:px-10 pb-24">
        <div className="grid gap-16 md:grid-cols-2">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={(i % 2) * 0.1}>
              <WorkTile cs={cs} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-content mx-auto px-6 md:px-10 py-24 border-t border-[var(--line)]">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
              Want to <em>talk through one?</em>
            </h2>
            <MagneticButton href="/contact">Get in touch →</MagneticButton>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
