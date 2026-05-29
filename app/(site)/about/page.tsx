import { Reveal } from "@/components/motion/Reveal";
import { PalashCharacter } from "@/components/character/PalashCharacter";
import { PortraitsFilm } from "@/components/motion/PortraitsFilm";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { experience } from "@/data/experience";
import { toolkit } from "@/data/tools";
import { beliefs } from "@/data/beliefs";
import { currently } from "@/data/currently";

export const metadata = {
  title: "About — Palash Nagar",
  description: "UX designer, HCI researcher, cricket fan. Here's the longer version.",
};

export default function AboutPage() {
  return (
    <main>
      {/* 01 Hero */}
      <section className="max-w-content mx-auto px-6 md:px-10 pt-24 pb-16">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
            About
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl tracking-tight leading-[1.0] max-w-4xl">
            I'm trying to make digital things feel{" "}
            <em className="text-[var(--accent)]">less anxious.</em>
          </h1>
        </Reveal>
      </section>

      {/* 02 Bio + character mascot instance #1 */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-16 border-t border-[var(--line)]">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
          <Reveal>
            <div className="space-y-6 text-lg leading-relaxed max-w-reading">
              <p>
                I'm a UX designer and an HCI grad student at RIT. Before grad
                school I was an intern at Netlink Software and Code Clause,
                where I learned that good interfaces are mostly about removing
                things, not adding them.
              </p>
              <p>
                Right now I'm building a thermal-illusion wearable for my
                capstone — a wristband that uses temperature contrast to signal
                information without the buzz-and-light overload of typical
                notifications. I'm interested in interaction design because
                that's where usability and emotion meet.
              </p>
              <p>
                Outside of school I'm a cricketer, a gym regular, and someone
                who genuinely enjoys airport layovers because they're forced
                quiet time.
              </p>
            </div>
            <blockquote className="mt-10 pl-6 border-l-2 border-[var(--accent)] font-[family-name:var(--font-display)] italic text-2xl text-[var(--ink-2)]">
              "Subtlety is a feature, not a compromise."
            </blockquote>
          </Reveal>
          <div>
            <PalashCharacter variant="hero-wave" decorative={false} size={320} />
          </div>
        </div>
      </section>

      {/* 03 Currently */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-16 border-t border-[var(--line)]">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
            Currently
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] opacity-70 mb-2">
                Building
              </div>
              <p className="text-lg">{currently.building}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] opacity-70 mb-2">
                Reading
              </div>
              <p className="text-lg">{currently.reading}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] opacity-70 mb-2">
                Available
              </div>
              <p className="text-lg">{currently.availability}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 04 Experience */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-16 border-t border-[var(--line)]">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
            Experience
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl mb-10">
            A short <em>résumé.</em>
          </h2>
        </Reveal>
        <ul className="divide-y divide-[var(--line)]">
          {experience.map((e, i) => (
            <Reveal key={i} delay={i * 0.05} as="div">
              <li className="py-5 grid grid-cols-[120px_1fr] md:grid-cols-[140px_1fr_2fr] gap-6 items-baseline">
                <span className="text-xs uppercase tracking-[0.08em] opacity-70">
                  {e.year}
                </span>
                <span className="font-medium">{e.where}</span>
                <span className="opacity-70">
                  {e.role}
                  {e.context && (
                    <span className="hidden md:inline opacity-70">
                      {" · "}
                      {e.context}
                    </span>
                  )}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 05 Off the clock — Portraits film */}
      <section className="py-16 border-t border-[var(--line)]">
        <div className="max-w-content mx-auto px-6 md:px-10 mb-10">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
              Off the clock
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
              What I do <em>when I'm not designing.</em>
            </h2>
          </Reveal>
        </div>
        <PortraitsFilm />
      </section>

      {/* 06 Toolkit */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-16 border-t border-[var(--line)]">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
            Toolkit
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl mb-10">
            What I <em>design &amp; build with.</em>
          </h2>
        </Reveal>
        <div className="space-y-5">
          {toolkit.map((t) => (
            <Reveal key={t.group}>
              <div className="grid md:grid-cols-[120px_1fr] gap-4 md:items-baseline">
                <div className="text-sm font-medium">{t.group}</div>
                <ul className="flex flex-wrap gap-2">
                  {t.items.map((item) => (
                    <li
                      key={item}
                      className="bg-[var(--accent-soft)] text-[var(--accent)] text-sm px-3 py-1 rounded"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 07 Beliefs */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-16 border-t border-[var(--line)]">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
            Beliefs
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl mb-12">
            What I <em>hold close.</em>
          </h2>
        </Reveal>
        <ol className="space-y-12">
          {beliefs.map((b, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <li className="flex gap-6 items-start">
                <span className="font-[family-name:var(--font-display)] italic text-[var(--accent)] text-2xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl leading-tight">
                  {b}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 08 Connect */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-24 border-t border-[var(--line)]">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
            Connect
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl mb-10 max-w-3xl">
            Want to <em>build something</em> together?
          </h2>
          <div className="flex flex-wrap gap-6 items-center">
            <MagneticButton href="/contact">Let's talk →</MagneticButton>
            <a
              href="/palash-nagar-resume.pdf"
              className="text-sm uppercase tracking-[0.18em] opacity-75 hover:opacity-100"
              download
            >
              Download résumé ↓
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
