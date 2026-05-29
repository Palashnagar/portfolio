import { StatusMarquee } from "@/components/marquee/StatusMarquee";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { CustomCursor } from "@/components/cursor/CustomCursor";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Skip-to-main for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-[var(--ink)] focus:text-[var(--bg)] focus:rounded-full focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <CustomCursor />
      <StatusMarquee />
      <Nav />
      <div id="main-content">{children}</div>
      <Footer />
    </>
  );
}
