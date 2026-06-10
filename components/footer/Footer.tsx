import Link from "next/link";

const socialLinks = [
  { href: "https://linkedin.com/in/palashnagar", label: "LinkedIn" },
  { href: "https://twitter.com/palashnagar", label: "X" },
  { href: "mailto:nagar.palash683@gmail.com", label: "Email" },
];

const siteLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/explorations", label: "Explorations" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--line)]">
      <div className="max-w-content mx-auto px-6 md:px-10 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-[family-name:var(--font-display)] text-2xl">
            Palash Nagar
          </div>
          <p className="mt-2 text-sm text-[var(--muted)] max-w-xs">
            Product/UX designer & HCI researcher. Rochester, NY.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
            Sitemap
          </div>
          <ul className="space-y-1.5 text-sm">
            {siteLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  data-cursor="link"
                  className="hover:text-[var(--accent)] transition-colors duration-150"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
            Elsewhere
          </div>
          <ul className="space-y-1.5 text-sm">
            {socialLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="hover:text-[var(--accent)] transition-colors duration-150"
                >
                  {l.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-10 py-6 border-t border-[var(--line)] flex justify-between text-xs text-[var(--muted)]">
        <span>© {new Date().getFullYear()} Palash Nagar</span>
        <span>Designed & built in Rochester</span>
      </div>
    </footer>
  );
}
