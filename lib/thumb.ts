// Builds a data-URI of a project's branded title-card, used as the magnified
// background for the case-study hover loupe (components/work/LoupeThumb.tsx).
//
// The cards render their title-card as inline SVG (so they pick up the page's
// Instrument Serif). A background-image can't reference the page's web fonts, so
// the loupe's magnified copy falls back to a system serif, exactly as in the
// reference mockup (design-reference/case-study-combined.html). When real
// photographic thumbnails exist, pass that image URL to <LoupeThumb> instead and
// the loupe will magnify the real photo.

import type { Project } from "@/data/projects";

export function thumbDataUri(p: Project, w: number, h: number): string {
  const cx = w / 2;
  const titleY = h / 2;
  const subY = titleY + 36;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='xMidYMid slice'>` +
    `<rect width='${w}' height='${h}' fill='${p.color}'/>` +
    `<text x='${cx}' y='${titleY}' text-anchor='middle' fill='${p.textColor}' ` +
    `font-family='Instrument Serif, Georgia, serif' font-size='40' font-style='italic'>${p.title} ${p.accent}</text>` +
    `<text x='${cx}' y='${subY}' text-anchor='middle' fill='${p.textColor}' opacity='0.55' ` +
    `font-family='Bricolage Grotesque, sans-serif' font-size='11' letter-spacing='3'>${p.accent.toUpperCase()}</text>` +
    `</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
