"use client";

// Mobile navigation: a ≥44px menu trigger (top-right) that opens a full-screen
// editorial overlay with large, tappable serif links. Replaces the desktop
// corner-nav / header below the `md` breakpoint, where those 11px corner links
// are too small to tap reliably. Desktop is untouched (this whole tree is
// `md:hidden`). Honors reduced motion, locks scroll, traps focus, and closes on
// link tap, route change, Escape, or the toggle.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useIntro } from "./intro-context";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/explorations", label: "Explorations" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { playIntro, revealed, ready } = useIntro();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on navigation (the component persists across route changes).
  useEffect(() => setOpen(false), [pathname]);

  // While open: lock body scroll, trap focus, close on Escape, restore focus.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(
      () => panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus(),
      80
    );

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      buttonRef.current?.focus();
    };
  }, [open]);

  // Hide the trigger during the homepage intro; fade it in with the rest of the
  // chrome. (Inner pages reveal immediately, so this is a no-op there.)
  const triggerStyle: React.CSSProperties = open
    ? {}
    : {
        opacity: playIntro && !revealed ? 0 : 1,
        pointerEvents: playIntro && !revealed ? "none" : "auto",
        transition: ready ? "opacity 0.7s ease 1.4s" : "none",
      };

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="fixed right-4 top-4 z-[130] flex h-11 w-11 items-center justify-center"
        style={triggerStyle}
      >
        <span className="relative block h-4 w-[26px]">
          <span
            aria-hidden
            className="absolute left-0 block h-[2px] w-full bg-ink transition-all duration-300"
            style={{
              top: open ? "7px" : "0px",
              transform: open ? "rotate(45deg)" : "none",
              transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)",
            }}
          />
          <span
            aria-hidden
            className="absolute left-0 top-[7px] block h-[2px] w-full bg-ink transition-opacity duration-200"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            aria-hidden
            className="absolute left-0 block h-[2px] w-full bg-ink transition-all duration-300"
            style={{
              bottom: open ? "7px" : "0px",
              transform: open ? "rotate(-45deg)" : "none",
              transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)",
            }}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[120] flex flex-col px-7 pb-12 pt-28"
            style={{ backgroundColor: "var(--bg)" }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduce ? 0.15 : 0.34, ease: EASE }}
          >
            <nav aria-label="Primary" className="my-auto flex flex-col">
              {links.map((link, i) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <motion.div
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: reduce ? 0 : 0.1 + i * 0.05,
                      ease: EASE,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(40px, 12vw, 60px)",
                        lineHeight: 1.08,
                        letterSpacing: "-0.02em",
                        color: active ? "var(--accent)" : "var(--ink)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="flex items-end justify-between text-[11px] uppercase tracking-[0.12em] text-muted">
              <div>
                <div>Rochester, NY</div>
                <div className="mt-1">Available Dec 2026</div>
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="text-[var(--accent-text)]"
              >
                Get in touch →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
