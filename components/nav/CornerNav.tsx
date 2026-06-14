"use client";

import Link from "next/link";
import { useIntro } from "./intro-context";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/explorations", label: "Explorations" },
  { href: "/resume", label: "Resume" },
];

const cornerBase =
  "fixed z-50 text-[11px] uppercase tracking-[0.08em] leading-[1.4]";

export function CornerNav() {
  const { playIntro, revealed, ready } = useIntro();

  // During the homepage intro these corners start hidden and fade in once the
  // sequence reveals the page (~2.2s + the 1.4s delay below, matching the
  // reference). Everywhere else they're visible immediately. Transitions are
  // suppressed until `ready` so the non-playing settle doesn't animate.
  const fadeStyle: React.CSSProperties = {
    opacity: playIntro && !revealed ? 0 : 1,
    transition: ready ? "opacity 0.7s ease 1.4s" : "none",
  };

  return (
    <>
      {/* Top-left identity now lives in <SiteLogo /> (the parked logo). */}

      {/* Top-right: nav links */}
      <nav
        aria-label="Primary navigation"
        className={`reveal-gated ${cornerBase} top-8 right-8 text-right`}
        style={fadeStyle}
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
      <div className={`reveal-gated ${cornerBase} bottom-8 left-8`} style={fadeStyle}>
        <div>© 2026 · Rochester, NY</div>
        <div className="mt-0.5 text-[var(--muted)]">Available Dec 2026</div>
      </div>

      {/* Bottom-right: contact CTA */}
      <div className={`reveal-gated ${cornerBase} bottom-8 right-8 text-right`} style={fadeStyle}>
        <Link
          href="/contact"
          data-cursor="link"
          className="text-[var(--accent-text)] hover:opacity-70 transition-opacity duration-150"
        >
          Get in touch →
        </Link>
      </div>
    </>
  );
}
