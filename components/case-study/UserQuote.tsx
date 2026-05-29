interface UserQuoteProps {
  quote: string;
  attribution: string;
}

export function UserQuote({ quote, attribution }: UserQuoteProps) {
  return (
    <blockquote className="my-8 pl-6 border-l-2 border-[var(--accent)]">
      <p className="font-[family-name:var(--font-display)] italic text-2xl md:text-3xl leading-snug">
        "{quote}"
      </p>
      <footer className="mt-3 text-sm uppercase tracking-[0.12em] opacity-70">
        — {attribution}
      </footer>
    </blockquote>
  );
}
