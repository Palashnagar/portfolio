import { statusStrings } from "@/data/status";

export function StatusMarquee() {
  const repeated = [...statusStrings, ...statusStrings];

  return (
    <div
      className="bg-[var(--ink)] text-[var(--bg)] overflow-hidden py-2 text-xs tracking-[0.18em] uppercase font-medium"
      role="status"
      aria-label="Current status"
    >
      <div className="inline-block whitespace-nowrap animate-marquee will-change-transform">
        {repeated.map((s, i) => (
          <span key={i} className="mx-6">
            ✱ {s}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
