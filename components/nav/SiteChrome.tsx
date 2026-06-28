"use client";

import { usePathname } from "next/navigation";
import { CornerNav } from "./CornerNav";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function SiteChrome() {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop chrome (hidden < md); the homepage gets the corner nav, every
          other route the top header. */}
      {pathname === "/" ? <CornerNav /> : <Header />}
      {/* Mobile chrome (hidden >= md): a hamburger + full-screen menu. */}
      <MobileNav />
    </>
  );
}
