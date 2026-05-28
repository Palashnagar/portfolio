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
      <CustomCursor />
      <StatusMarquee />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
