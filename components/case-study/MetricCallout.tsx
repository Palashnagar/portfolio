interface MetricCalloutProps {
  metrics: { value: string; label: string }[];
}

export function MetricCallout({ metrics }: MetricCalloutProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 my-8">
      {metrics.map((m) => (
        <div key={m.label}>
          <div className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-[var(--accent)]">
            {m.value}
          </div>
          <div className="text-xs uppercase tracking-[0.12em] opacity-70 mt-2">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
