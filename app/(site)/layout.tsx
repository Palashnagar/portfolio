import { SiteChrome } from "@/components/nav/SiteChrome";
import { Footer } from "@/components/footer/Footer";
import { IntroProvider } from "@/components/nav/intro-context";
import { SiteLogo } from "@/components/nav/SiteLogo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <IntroProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-[var(--ink)] focus:text-[var(--bg)] focus:rounded-full focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      {/* Morphing brand mark + homepage intro (replaces the old top-left text). */}
      <SiteLogo />
      <SiteChrome />
      <main id="main-content">{children}</main>
      <Footer />
    </IntroProvider>
  );
}
