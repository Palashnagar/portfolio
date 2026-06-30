// Home + /work project list. Order is intentional, the signature horizontal
// section walks through these 01 → 04.
//
// THUMBNAILS: each project renders its curated case-study hero (`thumb`)
// full-bleed inside <LoupeThumb> (color-awaken + cursor loupe). `thumbFocus` sets
// the object-position for the cover-crop so the key part of the shot is framed
// (the heroes are landscape; the home slot is 4:5, the /work slot is 4:3). The
// loupe magnifies the same image so visitors can inspect the real UI.
//
// STATS: the problem one-liners are copied verbatim from the approved design
// reference (03-horizontal-scroll.html), authored by Palash. Some contain
// specific figures not yet independently verified, flagged inline with TODO so
// Palash can confirm or replace them before relying on them publicly.

export interface ProblemSegment {
  text: string;
  em?: boolean; // rendered Instrument Serif italic (matches reference .panel-problem em)
}

export interface Project {
  slug: string;
  num: string; // "01".."04", display index
  title: string; // primary title, e.g. "MyCourses"
  accent: string; // accent word, rendered italic-orange, e.g. "2.0"
  meta: string[]; // [year, context, "CASE STUDY"]
  desc: string; // one-line tagline for the /work grid card (04 anatomy)
  problem: ProblemSegment[];
  color: string; // brand color (kept for reference / future use)
  textColor: string; // readable text color on `color`
  thumb: string; // curated case-study hero, rendered full-bleed in the thumbnail
  thumbFocus: string; // object-position for the cover-crop (frames the key part)
  thumbScreens?: string[]; // optional: compose these phone screens on cream instead of one full-bleed hero (RIT EATS, whose real screens are individual phones)
}

export const projects: Project[] = [
  {
    slug: "mycourses",
    num: "01",
    title: "MyCourses",
    accent: "2.0",
    meta: ["2025", "RIT · 19K USERS", "CASE STUDY"],
    desc: "Helping 19,000+ RIT students never miss an assignment again.",
    problem: [
      {
        text: "Students were missing assignments because the LMS buried due dates three clicks deep. I redesigned the dashboard around ",
      },
      { text: "what's due next", em: true },
      { text: "." },
    ],
    color: "#E94E1B",
    textColor: "#FFF8F0",
    thumb: "/case-studies/mycourses/hero-tablet.png",
    thumbFocus: "center",
  },
  {
    slug: "roomiematch",
    num: "02",
    title: "Roomie",
    accent: "Match",
    meta: ["2025", "MOBILE", "CASE STUDY"],
    desc: "Mobile-first roommate matching by lifestyle compatibility.",
    // TODO: confirm "41% of complaints in Year 1" with Palash, figure sourced
    // from the design-reference mockup, not yet independently verified.
    problem: [
      {
        text: "Random roommate assignment caused 41% of complaints in Year 1. I built lifestyle-based matching for a ",
      },
      { text: "better first week", em: true },
      { text: "." },
    ],
    color: "#1E3A5F",
    textColor: "#F5F1EA",
    thumb: "/case-studies/roomiematch/hero.png",
    thumbFocus: "center",
  },
  {
    slug: "rit-athletics",
    num: "03",
    title: "RIT",
    accent: "Athletics",
    meta: ["2025", "SPORTS", "CASE STUDY"],
    desc: "Keeping RIT Tigers fans connected on the go.",
    problem: [
      {
        text: "Tigers fans were jumping between three apps for scores, schedules, and tickets. One home, one tap, ",
      },
      { text: "live", em: true },
      { text: "." },
    ],
    color: "#F5A623",
    textColor: "#1A1407",
    thumb: "/case-studies/rit-athletics/hero.png",
    thumbFocus: "25% 50%",
  },
  {
    slug: "rit-eats",
    num: "04",
    title: "RIT",
    accent: "EATS",
    // NOTE: design-reference mockup labelled this "2025", but existing project
    // data (data/case-studies.ts) records RIT EATS as a 2024 project, using the
    // real year. TODO: confirm year with Palash.
    meta: ["2024", "F&B", "CASE STUDY"],
    desc: "Campus food ordering, redesigned.",
    // TODO: confirm "lines peaked at 22 minutes ... under six" with Palash,
    // figures sourced from the design-reference mockup, not yet verified.
    problem: [
      {
        text: "Dining hall lines peaked at 22 minutes. A predictive crowd map cut that to ",
      },
      { text: "under six", em: true },
      { text: "." },
    ],
    color: "#2D5F3F",
    textColor: "#F5F1EA",
    thumb: "/case-studies/rit-eats/screen-home.png",
    thumbFocus: "50% 15%",
    thumbScreens: [
      "/case-studies/rit-eats/screen-home.png",
      "/case-studies/rit-eats/screen-dish.png",
    ],
  },
];
