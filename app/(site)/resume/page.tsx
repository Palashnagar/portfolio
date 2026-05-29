import type { Metadata } from "next";
import { experience } from "@/data/experience";
import { toolkit } from "@/data/tools";
import { projects } from "@/data/projects";
import { loadCaseStudy, type CaseStudyFrontmatter } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Résumé — Palash Nagar",
  description: "Palash Nagar — UX/UI designer and HCI researcher at RIT. Résumé.",
};

export default async function ResumePage() {
  // Selected projects come from the canonical MDX frontmatter, ordered to match
  // the homepage work section (data/projects.ts). This decouples the résumé from
  // the legacy data/case-studies.ts registry so the registry can be removed.
  const loaded = await Promise.all(projects.map((p) => loadCaseStudy(p.slug)));
  const selected = loaded
    .map((cs) => cs?.frontmatter)
    .filter((f): f is CaseStudyFrontmatter => Boolean(f));

  return (
    <div className="mx-auto max-w-reading px-6 py-24 md:px-10 print:max-w-none print:py-8">
      <header className="mb-10 border-b border-line pb-6 print:mb-6 print:pb-3">
        <h1
          className="text-ink"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 6vw, 56px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          Palash Nagar
        </h1>
        <p className="mt-3 text-muted">UX/UI Designer · HCI Master&apos;s at RIT · Rochester, NY</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          <a href="mailto:asnddev@gmail.com" className="text-ink transition-colors hover:text-accent">
            asnddev@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/palashnagar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink transition-colors hover:text-accent"
          >
            linkedin.com/in/palashnagar
          </a>
          <a
            href="/palash-nagar-resume.pdf"
            download
            data-cursor="link"
            className="text-accent transition-colors hover:text-ink print:hidden"
          >
            Download PDF ↓
          </a>
        </div>
      </header>

      <ResumeSection title="Experience">
        {experience
          .filter((e) => e.kind === "work")
          .map((e) => (
            <ResumeRow
              key={`${e.year}-${e.where}`}
              year={e.year}
              primary={e.where}
              secondary={e.role}
              tertiary={e.context}
            />
          ))}
      </ResumeSection>

      <ResumeSection title="Education">
        {experience
          .filter((e) => e.kind === "edu")
          .map((e) => (
            <ResumeRow
              key={`${e.year}-${e.where}`}
              year={e.year}
              primary={e.where}
              secondary={e.role}
              tertiary={e.context}
            />
          ))}
      </ResumeSection>

      <ResumeSection title="Selected projects">
        {selected.map((f) => (
          <ResumeRow
            key={f.title}
            year={f.year}
            primary={f.title}
            secondary={f.role}
            tertiary={f.tagline}
          />
        ))}
      </ResumeSection>

      <ResumeSection title="Toolkit">
        <div className="space-y-3">
          {toolkit.map((t) => (
            <div key={t.group} className="grid grid-cols-[110px_1fr] gap-3">
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted">{t.group}</span>
              <span className="text-[14px] text-ink">{t.items.join(" · ")}</span>
            </div>
          ))}
        </div>
      </ResumeSection>

      <style>{`
        @media print {
          body { background: #fff; color: #000; }
          a { color: #000 !important; text-decoration: none; }
          .fixed, footer, [role="status"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 print:mb-6">
      <h2 className="mb-4 text-[11px] uppercase tracking-[0.2em] text-accent">{title}</h2>
      {children}
    </section>
  );
}

function ResumeRow({
  year,
  primary,
  secondary,
  tertiary,
}: {
  year: string;
  primary: string;
  secondary: string;
  tertiary?: string;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 border-t border-line py-3 first:border-t-0">
      <span className="text-[13px] text-muted">{year}</span>
      <div>
        <div className="font-medium text-ink">{primary}</div>
        <div className="text-[14px] text-muted">{secondary}</div>
        {tertiary && <div className="mt-0.5 text-[14px] text-muted">{tertiary}</div>}
      </div>
    </div>
  );
}
