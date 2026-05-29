import Link from "next/link";

const socialLinks = [
  { href: "https://linkedin.com/in/palashnagar", label: "LinkedIn" },
  { href: "https://twitter.com/palashnagar", label: "X" },
  { href: "mailto:asnddev@gmail.com", label: "Email" },
];

const siteLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--line)] bg-[var(--bg-2)]">
      <div className="max-w-content mx-auto px-6 md:px-10 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-[family-name:var(--font-display)] text-2xl">
            <span className="text-[var(--accent)]">✱</span> Palash Nagar
          </div>
          <p className="mt-2 text-sm opacity-70 max-w-xs">
            Designing things that feel inevitable.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] opacity-70 mb-3">
            Sitemap
          </div>
          <ul className="space-y-1.5 text-sm">
            {siteLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[var(--accent)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] opacity-70 mb-3">
            Elsewhere
          </div>
          <ul className="space-y-1.5 text-sm">
            {socialLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)]"
                >
                  {l.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-content mx-auto px-6 md:px-10 py-6 border-t border-[var(--line)] flex justify-between text-xs opacity-70">
        <span>© {new Date().getFullYear()} Palash Nagar</span>
        <span>Built from scratch · 2026</span>
      </div>
    </footer>
  );
}
