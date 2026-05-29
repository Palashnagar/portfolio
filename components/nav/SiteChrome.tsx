"use client";

import { usePathname } from "next/navigation";
import { CornerNav } from "./CornerNav";
import { Header } from "./Header";

export function SiteChrome() {
  const pathname = usePathname();
  return pathname === "/" ? <CornerNav /> : <Header />;
}
