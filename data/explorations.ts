// Explorations — the "in between" work that doesn't fit a case study. Powers
// /explorations (components/explorations/ExplorationsGrid.tsx).
//
// TODO: Palash replaces these placeholders with real explorations. Each item
// ships with a bespoke placeholder SVG in `art`; for real content set
// `thumbnail` to an image URL (rendered as a lazy <img>) and `href` to the real
// destination (Lottie demo, Figma file, PDF, etc.).

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
    id: "orbit-study",
    type: "animation",
    feature: true,
    title: "Orbit study, <em>iteration 03</em>",
    description:
      "Spring-physics easing on a planetary loading state. Tuning damping until the bounce stops feeling robotic. Built in Rive, exported as Lottie.",
    date: "May 2026",
    badge: "Animation · loop",
    meta: "0:08 loop",
    href: "#",
    art: `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g-feat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E94E1B"/><stop offset="1" stop-color="#1A0F08"/></linearGradient></defs><rect width="800" height="500" fill="url(#g-feat)"/><circle cx="500" cy="250" r="120" fill="rgba(255,255,255,0.18)"/><circle cx="500" cy="250" r="60" fill="rgba(0,0,0,0.25)"/><text x="160" y="280" fill="rgba(255,255,255,0.92)" font-family="Instrument Serif" font-style="italic" font-size="48">orbit study</text></svg>`,
  },
  {
    id: "banking-onboarding",
    type: "mockup",
    title: "Banking app <em>onboarding</em>",
    description: "A 3-screen flow I built for a workshop critique.",
    date: "Apr 2026",
    href: "#",
    art: `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="#2D5F3F"/><rect x="60" y="60" width="280" height="60" rx="4" fill="rgba(255,255,255,0.15)"/><rect x="60" y="140" width="200" height="14" rx="2" fill="rgba(255,255,255,0.25)"/><rect x="60" y="166" width="160" height="14" rx="2" fill="rgba(255,255,255,0.15)"/><rect x="60" y="220" width="280" height="120" rx="4" fill="rgba(0,0,0,0.2)"/></svg>`,
  },
  {
    id: "meditation-splash",
    type: "mockup",
    title: "Meditation app <em>splash</em>",
    description: "Color study for a calmer first-launch.",
    date: "Apr 2026",
    href: "#",
    art: `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="#1E3A5F"/><circle cx="200" cy="170" r="60" fill="rgba(255,255,255,0.18)"/><rect x="100" y="260" width="200" height="14" rx="2" fill="rgba(255,255,255,0.3)"/><rect x="120" y="284" width="160" height="10" rx="2" fill="rgba(255,255,255,0.15)"/><rect x="80" y="320" width="240" height="40" rx="20" fill="#E94E1B"/></svg>`,
  },
  {
    id: "thermal-referral",
    type: "research",
    title: "Thermal referral illusions in <em>wearables</em>",
    description:
      "Working paper from my HCI capstone exploring how off-target heat sensations can map to spatial UI. Currently under review for CHI 2026.",
    date: "Mar 2026",
    badge: "Research · paper",
    href: "#",
    art: `<svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid slice"><rect width="800" height="380" fill="#5B7B8C"/><rect x="60" y="60" width="320" height="260" rx="2" fill="#F5F1EA"/><rect x="80" y="84" width="170" height="6" fill="#0A0A0A"/><rect x="80" y="100" width="220" height="3" fill="#8A867F"/><rect x="80" y="108" width="200" height="3" fill="#8A867F"/><rect x="80" y="124" width="240" height="3" fill="#8A867F"/><rect x="80" y="132" width="190" height="3" fill="#8A867F"/><rect x="80" y="148" width="220" height="3" fill="#8A867F"/><rect x="80" y="160" width="160" height="3" fill="#8A867F"/><rect x="80" y="200" width="240" height="80" rx="2" fill="rgba(10,10,10,0.1)"/><text x="440" y="180" fill="#F5F1EA" font-family="Instrument Serif" font-style="italic" font-size="36">thermal illusions</text><text x="440" y="220" fill="rgba(245,241,234,0.7)" font-family="Bricolage Grotesque" font-size="13" letter-spacing="2">CHI 2026 SUBMISSION</text></svg>`,
  },
  {
    id: "loading-dots",
    type: "animation",
    title: "Loading dots, <em>rethought</em>",
    description: "Wave-staggered easing instead of the usual scale-up.",
    date: "Feb 2026",
    meta: "0:04 loop",
    href: "#",
    art: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#0A0A0A"/><line x1="0" y1="150" x2="400" y2="150" stroke="#E94E1B" stroke-width="1" stroke-dasharray="4 6"/><circle cx="80" cy="150" r="14" fill="#E94E1B"/><circle cx="200" cy="150" r="20" fill="#E94E1B" opacity="0.7"/><circle cx="320" cy="150" r="14" fill="#E94E1B" opacity="0.4"/></svg>`,
  },
  {
    id: "broken-grid",
    type: "exploration",
    title: "Is the grid <em>over</em>?",
    description: "A long thread on broken-grid layouts I keep saving.",
    date: "Jan 2026",
    href: "#",
    art: `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="#F5A623"/><polygon points="200,80 320,320 80,320" fill="rgba(255,255,255,0.18)"/><text x="200" y="220" text-anchor="middle" fill="#1A1407" font-family="Instrument Serif" font-style="italic" font-size="32">grid?</text></svg>`,
  },
  {
    id: "card-layouts",
    type: "sketch",
    title: "Card layouts, <em>wireframed</em>",
    description: "Three days of trying to find the right one.",
    date: "Dec 2025",
    href: "#",
    art: `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="#FAFAF6"/><rect x="80" y="80" width="240" height="80" fill="none" stroke="#0A0A0A" stroke-width="1.5"/><circle cx="120" cy="120" r="20" fill="none" stroke="#0A0A0A" stroke-width="1.5"/><line x1="160" y1="110" x2="280" y2="110" stroke="#0A0A0A" stroke-width="1.5"/><line x1="160" y1="130" x2="240" y2="130" stroke="#0A0A0A" stroke-width="1.5"/><rect x="80" y="180" width="240" height="140" fill="none" stroke="#0A0A0A" stroke-width="1.5"/><text x="200" y="370" text-anchor="middle" fill="#8A867F" font-family="Instrument Serif" font-style="italic" font-size="14">notebook page 47</text></svg>`,
  },
  {
    id: "travel-booking",
    type: "mockup",
    title: "Travel app <em>booking flow</em>",
    description: "Simplifying a 9-step process into 3.",
    date: "Nov 2025",
    href: "#",
    art: `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="#6B4530"/><circle cx="200" cy="160" r="55" fill="rgba(255,255,255,0.18)"/><rect x="80" y="240" width="240" height="14" rx="2" fill="rgba(255,255,255,0.3)"/><rect x="100" y="266" width="200" height="10" rx="2" fill="rgba(255,255,255,0.18)"/><rect x="80" y="310" width="100" height="40" rx="20" fill="rgba(255,255,255,0.25)"/><rect x="200" y="310" width="120" height="40" rx="20" fill="#E94E1B"/></svg>`,
  },
  {
    id: "perceived-speed",
    type: "research",
    title: "Designing for <em>perceived speed</em>",
    description:
      "Literature review on loading-state psychology and the gap between actual and perceived performance.",
    date: "Oct 2025",
    badge: "Research · lit review",
    href: "#",
    art: `<svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid slice"><rect width="800" height="380" fill="#3D4A5C"/><rect x="80" y="50" width="280" height="280" rx="2" fill="#F5F1EA"/><rect x="100" y="80" width="140" height="6" fill="#0A0A0A"/><rect x="100" y="100" width="220" height="3" fill="#8A867F"/><rect x="100" y="108" width="200" height="3" fill="#8A867F"/><rect x="100" y="124" width="240" height="3" fill="#8A867F"/><rect x="100" y="132" width="190" height="3" fill="#8A867F"/><text x="440" y="180" fill="#F5F1EA" font-family="Instrument Serif" font-style="italic" font-size="32">perceived speed</text><text x="440" y="220" fill="rgba(245,241,234,0.7)" font-family="Bricolage Grotesque" font-size="12" letter-spacing="2">GRADUATE SEMINAR · 2025</text></svg>`,
  },
  {
    id: "color-by-motion",
    type: "exploration",
    title: "Color shift, <em>by motion</em>",
    description: "What happens when a hue rotates as a button moves.",
    date: "Sep 2025",
    href: "#",
    art: `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="#8E5C8B"/><circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-dasharray="4 8"/><circle cx="200" cy="200" r="60" fill="rgba(255,255,255,0.2)"/><text x="200" y="208" text-anchor="middle" fill="#F5F1EA" font-family="Instrument Serif" font-style="italic" font-size="22">color×motion</text></svg>`,
  },
  {
    id: "easing-by-hand",
    type: "sketch",
    title: "Easing curve, <em>by hand</em>",
    description: "Notes from a motion design workshop.",
    date: "Aug 2025",
    href: "#",
    art: `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="#FAFAF6"/><path d="M 60 320 Q 120 100 200 220 T 340 80" fill="none" stroke="#0A0A0A" stroke-width="1.5"/><circle cx="120" cy="180" r="6" fill="#E94E1B"/><circle cx="240" cy="200" r="6" fill="#E94E1B"/><text x="200" y="370" text-anchor="middle" fill="#8A867F" font-family="Instrument Serif" font-style="italic" font-size="14">easing curve sketch</text></svg>`,
  },
];
