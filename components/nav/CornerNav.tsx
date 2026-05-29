import Link from "next/link";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
];

const cornerBase =
  "fixed z-50 text-[11px] uppercase tracking-[0.08em] leading-[1.4]";

export function CornerNav() {
  return (
    <>
      {/* Top-left: identity */}
      <div className={`${cornerBase} top-8 left-8`}>
        <div className="flex items-center gap-[6px]">
          <span
            className="dot-pulse inline-block w-[6px] h-[6px] rounded-full bg-[var(--accent)] shrink-0"
            aria-hidden="true"
          />
          <span>Palash Nagar</span>
        </div>
        <div className="mt-0.5 text-[var(--muted)]">UX/UI · HCI · RIT</div>
      </div>

      {/* Top-right: nav links */}
      <nav
        aria-label="Primary navigation"
        className={`${cornerBase} top-8 right-8 text-right`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            data-cursor="link"
            className="ml-[18px] hover:text-[var(--accent)] transition-colors duration-150"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Bottom-left: location + availability */}
      <div className={`${cornerBase} bottom-8 left-8`}>
        <div>© 2026 · Rochester, NY</div>
        <div className="mt-0.5 text-[var(--muted)]">Available May 2026</div>
      </div>

      {/* Bottom-right: contact CTA */}
      <div className={`${cornerBase} bottom-8 right-8 text-right`}>
        <Link
          href="/contact"
          data-cursor="link"
          className="text-[var(--accent)] hover:opacity-70 transition-opacity duration-150"
        >
          Get in touch →
        </Link>
      </div>
    </>
  );
}
