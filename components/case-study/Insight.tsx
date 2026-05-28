interface InsightProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export function Insight({ number, title, children }: InsightProps) {
  return (
    <div className="grid grid-cols-[60px_1fr] gap-4 py-4 border-t border-[var(--line)]">
      <span className="font-[family-name:var(--font-display)] italic text-[var(--accent)] text-2xl">
        {number}
      </span>
      <div>
        <div className="font-medium text-lg mb-1">{title}</div>
        <div className="opacity-75">{children}</div>
      </div>
    </div>
  );
}
