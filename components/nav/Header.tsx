import Link from "next/link";

const navLinks = [
  { href: "/work", label: "Work", accent: false },
  { href: "/about", label: "About", accent: false },
  { href: "/resume", label: "Resume", accent: false },
  { href: "/contact", label: "Contact", accent: true },
];

export function Header() {
  return (
    <header className="fixed top-8 left-8 right-8 z-50 flex justify-end items-start text-[11px] uppercase tracking-[0.08em]">
      {/* Identity now lives in <SiteLogo /> (parked top-left, on every page). */}

      {/* Right: nav links */}
      <nav aria-label="Primary navigation">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            data-cursor="link"
            className={`ml-[18px] transition-colors duration-150 ${
              link.accent
                ? "text-[var(--accent)] hover:opacity-70"
                : "hover:text-[var(--accent)]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
