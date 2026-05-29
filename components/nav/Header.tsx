import Link from "next/link";

const navLinks = [
  { href: "/work", label: "Work", accent: false },
  { href: "/about", label: "About", accent: false },
  { href: "/resume", label: "Resume", accent: false },
  { href: "/contact", label: "Contact", accent: true },
];

export function Header() {
  return (
    <header className="fixed top-8 left-8 right-8 z-50 flex justify-between items-start text-[11px] uppercase tracking-[0.08em]">
      {/* Left: identity */}
      <Link
        href="/"
        data-cursor="link"
        className="flex items-center gap-[6px] hover:opacity-70 transition-opacity duration-150"
        aria-label="Palash Nagar — home"
      >
        <span
          className="dot-pulse inline-block w-[6px] h-[6px] rounded-full bg-[var(--accent)] shrink-0"
          aria-hidden="true"
        />
        <span>Palash Nagar — UX/UI · HCI · RIT</span>
      </Link>

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
