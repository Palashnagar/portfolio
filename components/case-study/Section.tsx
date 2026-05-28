import { Reveal } from "@/components/motion/Reveal";

interface SectionProps {
  number: string;
  label: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ number, label, title, children }: SectionProps) {
  return (
    <section className="max-w-content mx-auto px-6 md:px-10 py-16 border-t border-[var(--line)]">
      <Reveal>
        <div className="grid md:grid-cols-[120px_1fr] gap-8">
          <div>
            <div className="font-[family-name:var(--font-display)] italic text-[var(--accent)] text-3xl md:text-4xl mb-2">
              {number}
            </div>
            <div className="text-xs uppercase tracking-[0.18em] opacity-55">
              {label}
            </div>
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl leading-tight mb-8">
              {title}
            </h2>
            <div className="max-w-reading space-y-5 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
