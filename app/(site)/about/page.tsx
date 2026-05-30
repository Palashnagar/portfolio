import type { Metadata } from "next";
import Link from "next/link";
import NowStrip from "@/components/home/NowStrip";
import { ImageWall } from "@/components/about/ImageWall";
import { Magnetic } from "@/components/fx/Magnetic";
import { experience } from "@/data/experience";
import { toolkit } from "@/data/tools";
import { beliefs } from "@/data/beliefs";

export const metadata: Metadata = {
  title: "About — Palash Nagar",
  description:
    "Palash Nagar — a UX designer and HCI researcher at RIT turning thermal illusions into calmer wearables. The longer version.",
};

// Shared section header: small-caps eyebrow over a serif title. Mirrors the v2
// home idiom (AboutTeaser / NowStrip), distinct from the case-study 140px rail.
function SectionHead({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <>
      <div className="mb-4 text-[11px] uppercase tracking-[0.2em] text-muted">{eyebrow}</div>
      <h2
        className="text-ink"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 4vw, 52px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
        }}
      >
        {children}
      </h2>
    </>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* 01 — Hero: text-first, researcher-meets-designer */}
      <header style={{ padding: "140px 6vw 56px" }}>
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-6 text-[11px] uppercase tracking-[0.2em] text-accent">About</div>
          <h1
            className="max-w-[18ch] text-ink"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(44px, 8.5vw, 124px)",
              lineHeight: 0.96,
              letterSpacing: "-0.025em",
            }}
          >
            I design calm interfaces — and research how they make people{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>feel.</em>
          </h1>
        </div>
      </header>

      {/* 02 — Who: typographic portrait block + bio prose + belief pull-quote */}
      <section className="border-t border-line" style={{ padding: "80px 6vw" }}>
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 md:grid-cols-[1fr_1.5fr] md:gap-16">
          {/* Typographic portrait block — no portrait asset exists, so a clean
              monogram stands in (same pattern as the home AboutTeaser). TODO:
              when Palash provides a portrait, drop it at /me/portrait.jpg and
              render it with next/image inside this frame. */}
          <div className="flex aspect-[4/5] max-h-[58vh] flex-col justify-between border border-line p-8">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted">UX · HCI</span>
            <span
              aria-hidden
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(72px, 12vw, 150px)",
                lineHeight: 0.9,
              }}
            >
              P<span style={{ color: "var(--accent)" }}>N</span>
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted">Rochester, NY</span>
          </div>

          <div>
            <div className="max-w-[58ch] space-y-6 text-[17px] leading-[1.65] text-ink">
              <p>
                Hi, I&apos;m Palash Nagar — a UX designer and HCI graduate student who believes
                thoughtful interaction design can turn everyday frustrations into{" "}
                <em
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.08em" }}
                >
                  smooth experiences.
                </em>{" "}
                I enjoy making small UX improvements that guide users, respond to their actions, and
                help them get things done with ease.
              </p>
              <p>
                I&apos;m especially drawn to interaction design because it&apos;s where usability and
                emotion meet. Subtle transitions, clear feedback, and thoughtful motion can turn a
                confusing interface into something that feels calm and trustworthy. I like designing
                experiences that guide users quietly in the background instead of demanding their
                attention.
              </p>
            </div>

            <blockquote
              className="mt-10 border-l-2 border-accent pl-6 text-ink"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(22px, 2.6vw, 30px)",
                lineHeight: 1.25,
              }}
            >
              &ldquo;Make people feel competent, not impressed.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* "The rest of me" — full-bleed draggable wall of things Palash loves */}
      <ImageWall />

      {/* 03 — What I research: thermal illusions → wearables */}
      <section className="border-t border-line" style={{ padding: "80px 6vw" }}>
        <div className="mx-auto max-w-[1100px]">
          <SectionHead eyebrow="What I research">
            Turning <em style={{ fontStyle: "italic", color: "var(--accent)" }}>thermal illusions</em>{" "}
            into wearables.
          </SectionHead>
          <div className="mt-8 max-w-[62ch] space-y-6 text-[17px] leading-[1.65] text-ink">
            <p>
              My capstone is a thermal-illusion wearable: a wristband that uses temperature
              contrast — warm against cool — as a signal channel, instead of the buzz-and-light
              overload that most notifications rely on. The idea is to let a device tell you
              something without yanking you out of whatever you&apos;re doing.
            </p>
            <p>
              It&apos;s the clearest expression of what I care about as a researcher: notifications
              that respect attention, feedback you feel rather than fight, and technology that
              fades into the background until the moment it&apos;s useful.
            </p>
          </div>
        </div>
      </section>

      {/* 04 — How I work */}
      <section className="border-t border-line" style={{ padding: "80px 6vw" }}>
        <div className="mx-auto max-w-[1100px]">
          <SectionHead eyebrow="How I work">
            Research first, then <em style={{ fontStyle: "italic", color: "var(--accent)" }}>subtract.</em>
          </SectionHead>
          <div className="mt-8 max-w-[62ch] space-y-6 text-[17px] leading-[1.65] text-ink">
            <p>
              I start by listening on purpose — mapping the journey, watching where it quietly
              breaks, and naming the moment a product lets someone down. Only then do I design, and
              the work is usually about taking things away until what&apos;s left feels inevitable.
            </p>
            <p>
              I prototype in Figma, test with real people, and keep iterating until the interface
              feels calm and legible rather than clever. Subtlety, to me, is a feature — not a
              compromise.
            </p>
          </div>
        </div>
      </section>

      {/* 05 — Now strip (reused home component, reads data/now.ts) */}
      <div style={{ paddingTop: 16, paddingBottom: 16 }}>
        <NowStrip />
      </div>

      {/* 06 — Experience */}
      <section className="border-t border-line" style={{ padding: "80px 6vw" }}>
        <div className="mx-auto max-w-[1100px]">
          <SectionHead eyebrow="Experience">
            A short <em style={{ fontStyle: "italic", color: "var(--accent)" }}>résumé.</em>
          </SectionHead>
          <ul className="mt-10 divide-y divide-line border-t border-line">
            {experience.map((e) => (
              <li
                key={`${e.year}-${e.where}`}
                className="grid grid-cols-[110px_1fr] items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[150px_1fr_1.6fr]"
              >
                <span className="text-[12px] uppercase tracking-[0.08em] text-muted">{e.year}</span>
                <span className="font-medium text-ink">{e.where}</span>
                <span className="col-span-2 text-[15px] text-muted md:col-span-1">
                  {e.role}
                  {e.context && <span className="hidden md:inline"> · {e.context}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 07 — Toolkit */}
      <section className="border-t border-line" style={{ padding: "80px 6vw" }}>
        <div className="mx-auto max-w-[1100px]">
          <SectionHead eyebrow="Toolkit">
            What I design &amp; <em style={{ fontStyle: "italic", color: "var(--accent)" }}>build with.</em>
          </SectionHead>
          <div className="mt-10 space-y-6">
            {toolkit.map((t) => (
              <div key={t.group} className="grid gap-3 md:grid-cols-[150px_1fr] md:items-baseline">
                <div className="text-[12px] uppercase tracking-[0.08em] text-muted">{t.group}</div>
                <ul className="flex flex-wrap gap-2">
                  {t.items.map((item) => (
                    <li
                      key={item}
                      className="border border-line px-3 py-1 text-[13px] uppercase tracking-[0.06em] text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Beliefs */}
      <section className="border-t border-line" style={{ padding: "80px 6vw" }}>
        <div className="mx-auto max-w-[1100px]">
          <SectionHead eyebrow="Beliefs">
            What I <em style={{ fontStyle: "italic", color: "var(--accent)" }}>hold close.</em>
          </SectionHead>
          <ol className="mt-12 space-y-10">
            {beliefs.map((b, i) => (
              <li key={b} className="flex items-start gap-6">
                <span
                  aria-hidden
                  className="text-accent"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-ink"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 3.4vw, 38px)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 09 — Closer */}
      <section
        className="flex flex-col items-center justify-center border-t border-line text-center"
        style={{ padding: "120px 6vw" }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(40px, 7vw, 100px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          Let&apos;s make something{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>calm.</em>
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
          <Magnetic>
            <Link
              href="/contact"
              data-cursor="link"
              style={{
                display: "inline-block",
                fontSize: "14px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                textDecoration: "none",
                borderBottom: "1px solid var(--accent)",
                paddingBottom: "4px",
              }}
            >
              Get in touch →
            </Link>
          </Magnetic>
          <a
            href="/palash-nagar-resume.pdf"
            download
            data-cursor="link"
            className="text-[13px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink"
          >
            Download résumé ↓
          </a>
        </div>
      </section>
    </>
  );
}
