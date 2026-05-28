"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--line)]">
      <div className="max-w-content mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg tracking-tight"
        >
          <span className="text-[var(--accent)]">✱</span> Palash Nagar
        </Link>
        <ul className="flex gap-6 text-sm">
          {links.map((l) => {
            const active =
              pathname === l.href || pathname?.startsWith(l.href + "/");
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={clsx(
                    "transition-opacity",
                    active
                      ? "text-[var(--accent)] font-medium"
                      : "hover:opacity-70",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
