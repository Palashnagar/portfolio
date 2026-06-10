// Explorations — the "in between" work that doesn't fit a case study. Powers
// /explorations (components/explorations/ExplorationsGrid.tsx).
//
// These are real side projects, each linking to its full write-up on the older
// site. `art` holds an on-brand placeholder SVG; to show the real design set
// `thumbnail` to an image URL (rendered as a lazy <img>) once exports are dropped
// into /public.

export type ExplorationType =
  | "animation"
  | "mockup"
  | "research"
  | "sketch"
  | "exploration";

export interface Exploration {
  id: string;
  type: ExplorationType;
  feature?: boolean; // at most one — gets the largest editorial slot
  title: string; // may include <em> for the italic-orange accent
  description: string;
  date: string; // e.g. "May 2026"
  badge?: string; // overrides the badge label; defaults to the capitalized type
  meta?: string; // play-badge text for animations, e.g. "0:08 loop"
  href: string;
  thumbnail?: string; // real image URL (swap in later); falls back to `art`
  art: string; // placeholder SVG markup
}

export const explorations: Exploration[] = [
  {
    id: "ar-education",
    type: "research",
    title: "Children &amp; <em>educational AR</em>",
    description:
      "A qualitative study of how children aged 5–10 experience educational AR — observations and interviews toward more inclusive, child-centered design.",
    date: "May 2025",
    badge: "Research · paper",
    href: "https://acrobat.adobe.com/id/urn:aaid:sc:AP:d2f36c35-bfc6-4de8-99af-d72549e72fdb",
    art: `<svg viewBox="0 0 840 400" preserveAspectRatio="xMidYMid slice"><rect width="840" height="400" fill="#1E3A5F"/><rect x="56" y="58" width="300" height="284" rx="3" fill="#F5F1EA"/><rect x="80" y="84" width="150" height="7" fill="#0A0A0A"/><rect x="80" y="108" width="240" height="3" fill="#8A867F"/><rect x="80" y="118" width="220" height="3" fill="#8A867F"/><rect x="80" y="128" width="244" height="3" fill="#8A867F"/><rect x="80" y="138" width="180" height="3" fill="#8A867F"/><rect x="80" y="172" width="244" height="92" rx="2" fill="rgba(10,10,10,0.08)"/><g stroke="#E94E1B" stroke-width="3" fill="none"><path d="M624 150 l58 -33 l58 33 v68 l-58 33 l-58 -33 z"/><path d="M624 150 l58 33 l58 -33 M682 183 v68"/></g><text x="430" y="200" fill="#F5F1EA" font-family="Instrument Serif" font-style="italic" font-size="38">children &amp; AR</text><text x="430" y="236" fill="rgba(245,241,234,0.7)" font-family="Bricolage Grotesque" font-size="12" letter-spacing="2">QUALITATIVE STUDY · 2025</text></svg>`,
  },
  {
    id: "motion-design",
    type: "animation",
    title: "UI <em>motion design</em>",
    description:
      "A user-centered UI animation concept — transitions and micro-interactions built with Figma's smart-animate to bring an interface to life.",
    date: "2024",
    meta: "Figma prototype",
    href: "https://www.figma.com/proto/2sgtcAwrMHdhWIOz55CFsG/Untitled?page-id=0%3A1&node-id=11-689&viewport=-854%2C681%2C0.11&t=Y7kJqt4tI4ekkdZ9-1&scaling=scale-down&content-scaling=fixed",
    art: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#0A0A0A"/><path d="M40 232 Q 140 50 200 160 T 362 88" fill="none" stroke="#E94E1B" stroke-width="2" stroke-dasharray="3 7"/><circle cx="120" cy="150" r="10" fill="#E94E1B" opacity="0.35"/><circle cx="200" cy="160" r="16" fill="#E94E1B" opacity="0.65"/><circle cx="288" cy="118" r="23" fill="#E94E1B"/><text x="40" y="62" fill="rgba(245,241,234,0.92)" font-family="Instrument Serif" font-style="italic" font-size="32">motion</text></svg>`,
  },
  {
    id: "hinge-eval",
    type: "research",
    title: "Heuristic eval of <em>Hinge</em>",
    description:
      "A heuristic evaluation of the Hinge dating app against Nielsen's 10 usability heuristics — interface strengths, usability issues, and recommendations.",
    date: "May 2023",
    badge: "Research · evaluation",
    href: "https://medium.com/@nagar.palash683/heuristic-evaluation-of-hinge-afe52dbd3b75",
    art: `<svg viewBox="0 0 840 400" preserveAspectRatio="xMidYMid slice"><rect width="840" height="400" fill="#5B7B8C"/><rect x="64" y="50" width="168" height="300" rx="20" fill="#F5F1EA"/><rect x="64" y="50" width="168" height="96" rx="20" fill="#0A0A0A"/><rect x="64" y="120" width="168" height="26" fill="#0A0A0A"/><circle cx="104" cy="98" r="16" fill="#E94E1B"/><rect x="86" y="176" width="124" height="9" rx="2" fill="#0A0A0A"/><rect x="86" y="196" width="96" height="6" rx="2" fill="#8A867F"/><rect x="86" y="212" width="110" height="6" rx="2" fill="#8A867F"/><g font-family="Bricolage Grotesque" font-size="13" font-weight="700"><circle cx="272" cy="120" r="13" fill="#E94E1B"/><text x="272" y="125" text-anchor="middle" fill="#F5F1EA">1</text><circle cx="272" cy="200" r="13" fill="#E94E1B"/><text x="272" y="205" text-anchor="middle" fill="#F5F1EA">2</text><circle cx="272" cy="280" r="13" fill="#E94E1B"/><text x="272" y="285" text-anchor="middle" fill="#F5F1EA">3</text></g><text x="342" y="200" fill="#F5F1EA" font-family="Instrument Serif" font-style="italic" font-size="38">heuristic eval</text><text x="342" y="236" fill="rgba(245,241,234,0.8)" font-family="Bricolage Grotesque" font-size="12" letter-spacing="2">NIELSEN'S 10 HEURISTICS</text></svg>`,
  },
  {
    id: "nike-mockups",
    type: "mockup",
    title: "Nike Jordan <em>mockups</em>",
    description:
      "A self-initiated Nike Jordan UI concept — a bold, immersive way to showcase sneakers across mobile and web.",
    date: "2023",
    badge: "Mockup · concept",
    href: "https://www.figma.com/proto/fdOnDExp2waKee7gJoqJMr/Jordon-first-UI-design-palash?page-id=0%3A1&node-id=408-120&viewport=-349%2C221%2C0.15&t=QUabrgj6d7M93lTL-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=408%3A120",
    art: `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="#0A0A0A"/><rect x="56" y="74" width="288" height="172" rx="6" fill="#171717"/><path d="M104 206 Q 196 118 304 150 Q 220 152 126 214 Z" fill="#E94E1B"/><rect x="56" y="280" width="172" height="14" rx="2" fill="rgba(245,241,234,0.92)"/><rect x="56" y="306" width="120" height="10" rx="2" fill="rgba(245,241,234,0.4)"/><rect x="252" y="278" width="92" height="42" rx="21" fill="#E94E1B"/><text x="56" y="56" fill="#F5F1EA" font-family="Instrument Serif" font-style="italic" font-size="26">Jordan UI</text></svg>`,
  },
];
