// /work index — distortion grid (anatomy from 04-hover-distortion.html): mono
// eyebrow + serif page title with accent + 2-col WorkGrid driven by
// data/projects.ts. No <main> here — the (site) layout provides it.

import { projects } from "@/data/projects";
import { WorkGrid } from "@/components/work/WorkGrid";

export const metadata = {
  title: "Work — Palash Nagar",
  description: "Selected case studies in UX/UI, product design, and HCI research.",
};

export default function WorkIndexPage() {
  return (
    <div style={{ padding: "120px 6vw 80px" }}>
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 text-[13px] uppercase tracking-[0.15em] text-muted">
          Selected work · {String(projects.length).padStart(2, "0")} projects
        </div>
        <h1
          className="mb-20 text-ink"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(56px, 10vw, 160px)",
            lineHeight: 0.92,
            letterSpacing: "-0.025em",
          }}
        >
          Things I&apos;ve <em style={{ color: "var(--accent)" }}>built.</em>
        </h1>

        <WorkGrid />
      </div>
    </div>
  );
}
