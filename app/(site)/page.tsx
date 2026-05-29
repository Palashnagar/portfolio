import type { Metadata } from "next";
import Link from "next/link";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { Reveal } from "@/components/motion/Reveal";
import { PalashCharacter } from "@/components/character/PalashCharacter";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { caseStudies } from "@/data/case-studies";
import { currently } from "@/data/currently";

export const metadata: Metadata = {
  title: "Palash Nagar — UX/UI Designer",
  description:
    "UX designer and HCI researcher at RIT. Designing digital things that feel inevitable.",
};

export default function HomePage() {
  const featured = caseStudies.filter((cs) => cs.featured);

  return (
    <>
      <IntroReveal />
      <main>
        {/* Hero */}
        <section className="max-w-content mx-auto px-6 md:px-10 pt-24 pb-32">
          <Reveal>
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-8xl tracking-tight leading-[1.0]">
              Good design should feel{" "}
              <em className="text-[var(--accent)]">inevitable.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-reading text-lg md:text-xl opacity-80 leading-relaxed">
              I'm Palash — a UX designer and HCI grad student at RIT, currently
              turning thermal illusions into a wearable. I make digital things
              feel less anxious.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <a
              href="#work"
              className="mt-10 inline-block text-sm uppercase tracking-[0.18em] opacity-60 hover:opacity-100"
            >
              See selected work ↓
            </a>
          </Reveal>
        </section>

        {/* Selected work */}
        <section id="work" className="max-w-content mx-auto px-6 md:px-10 py-24">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-2">
              Selected work · {featured.length} projects
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl mb-16">
              Things I've <em>built</em>.
            </h2>
          </Reveal>
          <div className="grid gap-12 md:grid-cols-2">
            {featured.map((cs, i) => (
              <Reveal key={cs.slug} delay={i * 0.1}>
                <Link
                  href={`/work/${cs.slug}`}
                  data-cursor="View →"
                  className="block group"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[var(--bg-2)] mb-4">
                    <PlaceholderImage
                      slot="cover"
                      path={cs.cover}
                      aspect="4/3"
                      label={cs.title}
                    />
                  </div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl">
                      {cs.title}
                    </h3>
                    <span className="text-xs uppercase tracking-wider opacity-55">
                      {cs.year}
                    </span>
                  </div>
                  <p className="mt-2 text-sm opacity-70 max-w-md">
                    {cs.tagline}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link
              href="/work"
              className="mt-12 inline-block text-sm uppercase tracking-[0.18em] opacity-60 hover:opacity-100"
            >
              All work →
            </Link>
          </Reveal>
        </section>

        {/* A bit about me */}
        <section className="max-w-content mx-auto px-6 md:px-10 py-24 border-t border-[var(--line)]">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-2">
                A bit about me
              </div>
              <p className="font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-snug">
                I'm drawn to <em>interaction design</em> because that's where
                usability and emotion meet.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-block text-sm uppercase tracking-[0.18em] opacity-60 hover:opacity-100"
              >
                More about me →
              </Link>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="aspect-square rounded-xl bg-[var(--bg-2)] overflow-hidden">
                <PlaceholderImage
                  slot="portrait"
                  path="/me/portrait.jpg"
                  aspect="1/1"
                  label="Palash Nagar"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Currently / Now */}
        <section className="max-w-content mx-auto px-6 md:px-10 py-24 border-t border-[var(--line)]">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-2">
              Now
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl mb-12">
              What I'm <em>up to</em>.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            <Reveal>
              <div className="text-xs uppercase tracking-[0.18em] opacity-55 mb-2">
                Building
              </div>
              <p className="text-lg">{currently.building}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="text-xs uppercase tracking-[0.18em] opacity-55 mb-2">
                Reading
              </div>
              <p className="text-lg">{currently.reading}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="text-xs uppercase tracking-[0.18em] opacity-55 mb-2">
                Available
              </div>
              <p className="text-lg">{currently.availability}</p>
            </Reveal>
          </div>
        </section>

        {/* Let's connect — with character mascot instance #3 */}
        <section className="max-w-content mx-auto px-6 md:px-10 py-32 border-t border-[var(--line)]">
          <div className="grid md:grid-cols-[1fr_auto] gap-12 items-end">
            <Reveal>
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-2">
                Let's connect
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl leading-[1.0]">
                Got something <em>worth building?</em>
              </h2>
              <MagneticButton href="/contact" className="mt-10">
                Get in touch →
              </MagneticButton>
            </Reveal>
            <div className="-mb-4">
              <PalashCharacter variant="pointing" size={140} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
