// Home + /work project list. Order is intentional — the signature horizontal
// section walks through these 01 → 04.
//
// THUMBNAILS: rendered as branded color title-cards (project `color` +
// `textColor`), matching the approved design references (03-horizontal-scroll
// and 04-hover-distortion both render thumbnails this way — it is the intended
// aesthetic, not a placeholder). Real photographic thumbnails could replace
// these later: drop a curated image under public/case-studies/<slug>/ and render
// it via next/image inside <DistortThumb>. No curated thumbnail exists today —
// the public/case-studies/* folders hold only uncurated scraped images — so do
// NOT guess at one.
//
// STATS: the problem one-liners are copied verbatim from the approved design
// reference (03-horizontal-scroll.html), authored by Palash. Some contain
// specific figures not yet independently verified — flagged inline with TODO so
// Palash can confirm or replace them before relying on them publicly.

export interface ProblemSegment {
  text: string;
  em?: boolean; // rendered Instrument Serif italic (matches reference .panel-problem em)
}

export interface Project {
  slug: string;
  num: string; // "01".."04" — display index
  title: string; // primary title, e.g. "MyCourses"
  accent: string; // accent word, rendered italic-orange, e.g. "2.0"
  meta: string[]; // [year, context, "CASE STUDY"]
  problem: ProblemSegment[];
  color: string; // brand color — title-card background
  textColor: string; // readable text color on `color`
}

export const projects: Project[] = [
  {
    slug: "mycourses",
    num: "01",
    title: "MyCourses",
    accent: "2.0",
    meta: ["2025", "RIT · 19K USERS", "CASE STUDY"],
    problem: [
      {
        text: "Students were missing assignments because the LMS buried due dates three clicks deep. I redesigned the dashboard around ",
      },
      { text: "what's due next", em: true },
      { text: "." },
    ],
    color: "#E94E1B",
    textColor: "#FFF8F0",
  },
  {
    slug: "roomiematch",
    num: "02",
    title: "Roomie",
    accent: "Match",
    meta: ["2025", "MOBILE", "CASE STUDY"],
    // TODO: confirm "41% of complaints in Year 1" with Palash — figure sourced
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
  },
  {
    slug: "rit-athletics",
    num: "03",
    title: "RIT",
    accent: "Athletics",
    meta: ["2025", "SPORTS", "CASE STUDY"],
    problem: [
      {
        text: "Tigers fans were jumping between three apps for scores, schedules, and tickets. One home, one tap, ",
      },
      { text: "live", em: true },
      { text: "." },
    ],
    color: "#F5A623",
    textColor: "#1A1407",
  },
  {
    slug: "rit-eats",
    num: "04",
    title: "RIT",
    accent: "EATS",
    // NOTE: design-reference mockup labelled this "2025", but existing project
    // data (data/case-studies.ts) records RIT EATS as a 2024 project — using the
    // real year. TODO: confirm year with Palash.
    meta: ["2024", "F&B", "CASE STUDY"],
    // TODO: confirm "lines peaked at 22 minutes ... under six" with Palash —
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
  },
];
