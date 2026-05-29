// "Now" strip (spec §8) — thin three-column info rail, Bricolage uppercase,
// hairline separators only, NO card backgrounds. Replaces the Ship-1 "Now" card
// and the StatusMarquee ticker. Pure presentational server component.

import { now } from "@/data/now";

const columns = [
  { label: "Building", value: now.building },
  { label: "Reading", value: now.reading },
  { label: "Available", value: now.available },
];

export default function NowStrip() {
  return (
    <section className="px-[6vw]">
      <div className="grid grid-cols-1 border-b border-line sm:grid-cols-3 sm:border-t">
        {columns.map((c) => (
          <div
            key={c.label}
            className="border-t border-line px-8 py-7 sm:border-l sm:border-t-0 sm:first:border-l-0"
          >
            <div className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
              {c.label}
            </div>
            <div className="text-[13px] uppercase leading-snug tracking-[0.08em] text-ink">
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
