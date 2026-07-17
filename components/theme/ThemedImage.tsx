"use client";

// next/image wrapper that swaps between a light and a dark source with the manual
// theme (data-theme on <html>, set by ThemeToggle). SSR and first paint render the
// light source (the site's default); after hydration the observer corrects and
// tracks toggles. While the light source is showing in dark mode it still gets the
// global dark dim from globals.css; once the dark-native source is in, the
// data-dark-native attribute lifts that dim (a dark-built image shouldn't be
// dimmed). The swap sits inside the toggle's page-wide cross-fade, so it reads as
// part of the same moment.

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

export function ThemedImage({
  srcLight,
  srcDark,
  alt,
  ...rest
}: Omit<ImageProps, "src"> & { srcLight: string; srcDark: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.dataset.theme === "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  return (
    <Image
      {...rest}
      alt={alt}
      src={dark ? srcDark : srcLight}
      data-dark-native={dark ? "true" : undefined}
    />
  );
}
