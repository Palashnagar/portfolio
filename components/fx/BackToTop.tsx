"use client";

// Back-to-top control for long content pages (case studies, About, the résumé,
// etc.). Fades in once you've scrolled past ~500px and smooth-scrolls to the top
// via the shared Lenis instance. Bottom-right, mirroring the site's corner UI.
// Skipped on the homepage, whose CornerNav already owns both bottom corners.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { scrollToTop } from "@/lib/lenis";

export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setVisible(y > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      data-cursor="link"
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)] transition-all duration-300 hover:bg-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        pointerEvents: visible ? "auto" : "none",
        boxShadow: "0 6px 20px rgba(10, 10, 10, 0.22)",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
