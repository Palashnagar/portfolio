import { experience } from "@/data/experience";
import { toolkit } from "@/data/tools";
import { caseStudies } from "@/data/case-studies";

export const metadata = {
  title: "Résumé — Palash Nagar",
  description: "Palash Nagar's résumé · UX/UI Designer.",
};

export default function ResumePage() {
  return (
    <main className="max-w-reading mx-auto px-6 md:px-10 py-16 print:py-8 print:max-w-none">
      <header className="border-b border-[var(--line)] pb-6 mb-8 print:pb-3 print:mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl tracking-tight">
          Palash Nagar
        </h1>
        <p className="mt-2 opacity-75">
          UX/UI Designer · HCI Master's at RIT · Rochester, NY
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="mailto:asnddev@gmail.com" className="hover:text-[var(--accent)]">
            asnddev@gmail.com
          </a>
          <a href="https://linkedin.com/in/palashnagar" className="hover:text-[var(--accent)]" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/palashnagar
          </a>
          <a
            href="/palash-nagar-resume.pdf"
            download
            className="hover:text-[var(--accent)] print:hidden"
          >
            Download PDF ↓
          </a>
        </div>
      </header>

      <ResumeSection title="Experience">
        {experience.filter((e) => e.kind === "work").map((e, i) => (
          <ResumeRow
            key={i}
            year={e.year}
            primary={e.where}
            secondary={e.role}
            tertiary={e.context}
          />
        ))}
      </ResumeSection>

      <ResumeSection title="Education">
        {experience.filter((e) => e.kind === "edu").map((e, i) => (
          <ResumeRow
            key={i}
            year={e.year}
            primary={e.where}
            secondary={e.role}
            tertiary={e.context}
          />
        ))}
      </ResumeSection>

      <ResumeSection title="Selected projects">
        {caseStudies.map((cs) => (
          <ResumeRow
            key={cs.slug}
            year={cs.year}
            primary={cs.title}
            secondary={cs.role}
            tertiary={cs.tagline}
          />
        ))}
      </ResumeSection>

      <ResumeSection title="Toolkit">
        <div className="space-y-2">
          {toolkit.map((t) => (
            <div key={t.group} className="grid grid-cols-[110px_1fr] gap-3">
              <span className="text-sm font-medium">{t.group}</span>
              <span className="text-sm opacity-80">{t.items.join(" · ")}</span>
            </div>
          ))}
        </div>
      </ResumeSection>

      <style>{`
        @media print {
          body { background: white; color: black; }
          a { color: black; text-decoration: none; }
          nav, footer, [role="status"] { display: none !important; }
        }
      `}</style>
    </main>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10 print:mb-6">
      <h2 className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-4">
        {title}
      </h2>
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
    <div className="grid grid-cols-[110px_1fr] gap-3 py-3 border-t border-[var(--line)] first:border-t-0">
      <span className="text-sm opacity-65">{year}</span>
      <div>
        <div className="font-medium">{primary}</div>
        <div className="text-sm opacity-75">{secondary}</div>
        {tertiary && (
          <div className="text-sm opacity-70 mt-0.5">{tertiary}</div>
        )}
      </div>
    </div>
  );
}
