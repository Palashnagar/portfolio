import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { loadCaseStudy, listCaseStudySlugs } from "@/lib/mdx";

// v2 fixed 7-section spine (spec §10). The Hero + NextProject bookends are
// rendered by this route; Problem→Outcome come from the MDX body.
import { Hero } from "@/components/case-study/Hero";
import { Problem } from "@/components/case-study/Problem";
import { Research } from "@/components/case-study/Research";
import { Insight } from "@/components/case-study/Insight";
import { Evidence } from "@/components/case-study/Evidence";
import { Constraints } from "@/components/case-study/Constraints";
import { Solution } from "@/components/case-study/Solution";
import { Screen } from "@/components/case-study/Screen";
import { Figure } from "@/components/case-study/Figure";
import { Outcome } from "@/components/case-study/Outcome";
import { NextProject } from "@/components/case-study/NextProject";
import { Todo } from "@/components/case-study/Todo";
import { FigmaHeroButton, FigmaOnePager } from "@/components/case-study/FigmaOnePager";
import { PrototypeHeroButton, PrototypeButton } from "@/components/case-study/PrototypeButton";
import {
  CsSection,
  Caption,
  ProblemGrid,
  ProblemCard,
  StatRow,
  Stat,
  BarChart,
  IntentGrid,
  Intent,
  Pillar,
  VideoEmbed,
  Reveal,
  Takeaway,
} from "@/components/case-study/MyCoursesSections";
import {
  CsSection as RmCsSection,
  Caption as RmCaption,
  ProblemGrid as RmProblemGrid,
  ProblemCard as RmProblemCard,
  Pullquote,
  Chips,
  InsightBand,
  Persona,
  Hmw,
  Bets,
  Bet,
  LeftOut,
  IdSplit,
  DesignDecisions,
  Decision,
  Gallery,
  Takeaway as RmTakeaway,
} from "@/components/case-study/RoomieMatchSections";
import {
  CsSection as RaCsSection,
  Caption as RaCaption,
  ImageFrame,
  Findings,
  Finding,
  Chips as RaChips,
  PersonaGrid,
  PersonaCard,
  JourneyMap,
  Bets as RaBets,
  Bet as RaBet,
  LeftOut as RaLeftOut,
  Takeaway as RaTakeaway,
} from "@/components/case-study/RitAthleticsSections";
import {
  CsSection as EatsCsSection,
  Caption as EatsCaption,
  RoleNote,
  ProblemGrid as EatsProblemGrid,
  ProblemCard as EatsProblemCard,
  StatBand,
  Stat as EatsStat,
  Chips as EatsChips,
  InsightBand as EatsInsightBand,
  Directions,
  Direction,
  LeftOut as EatsLeftOut,
  Pillars,
  Pillar as EatsPillar,
  ImageFrame as EatsImageFrame,
  IdSplit as EatsIdSplit,
  Takeaway as EatsTakeaway,
} from "@/components/case-study/RitEatsSections";

export async function generateStaticParams() {
  const slugs = await listCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.frontmatter.title} — Palash Nagar`,
    description: cs.frontmatter.tagline,
    openGraph: {
      title: cs.frontmatter.title,
      description: cs.frontmatter.tagline,
      ...(cs.frontmatter.cover ? { images: [cs.frontmatter.cover] } : {}),
    },
  };
}

const mdxComponents = {
  Problem,
  Research,
  Insight,
  Evidence,
  Constraints,
  Solution,
  Screen,
  Figure,
  Outcome,
  Todo,
  // MyCourses layout kit (used only by mycourses.mdx)
  CsSection,
  Caption,
  ProblemGrid,
  ProblemCard,
  StatRow,
  Stat,
  BarChart,
  IntentGrid,
  Intent,
  Pillar,
  VideoEmbed,
  Reveal,
  Takeaway,
};

// RoomieMatch uses its own self-contained kit. Several names overlap with the
// MyCourses kit (CsSection, ProblemGrid, ProblemCard, Caption, Takeaway) but the
// implementations differ (3-col problem grid, titled takeaway), so RoomieMatch
// gets its own component map rather than sharing one object.
const roomieComponents = {
  CsSection: RmCsSection,
  Caption: RmCaption,
  ProblemGrid: RmProblemGrid,
  ProblemCard: RmProblemCard,
  Pullquote,
  Chips,
  InsightBand,
  Persona,
  Hmw,
  Bets,
  Bet,
  LeftOut,
  IdSplit,
  DesignDecisions,
  Decision,
  Gallery,
  Takeaway: RmTakeaway,
};

// RoomieMatch Figma prototype + the traveling-button copy. The button lands in
// the closing CTA; the Next-Project section below it stays put.
const ROOMIE_PROTO = {
  url: "https://www.figma.com/proto/0yEU63sc4AIuayEqT7dpYF/IXD-idea-pitch-RoomieMatch?page-id=283%3A246&node-id=584-4599&viewport=576%2C308%2C0.15&t=6Qzlmuaae1FyDpNl-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=584%3A4599",
  heroLabel: "View prototype ↗",
  closeLabel: "Open the prototype ↗",
  ariaLabel: "View prototype",
  closeHeading: (
    <>
      Want to <em>try it</em>?
    </>
  ),
  closeSub: "The full interactive flow lives in the Figma prototype.",
};

// RIT Athletics uses its own self-contained kit (numbered findings, persona
// cards, a real journey-map table, image frames). Names overlap with the other
// kits, so it gets its own component map.
const ritComponents = {
  CsSection: RaCsSection,
  Caption: RaCaption,
  ImageFrame,
  Findings,
  Finding,
  Chips: RaChips,
  PersonaGrid,
  PersonaCard,
  JourneyMap,
  Bets: RaBets,
  Bet: RaBet,
  LeftOut: RaLeftOut,
  Takeaway: RaTakeaway,
};

// RIT Athletics ships to a Google Slides deck (not Figma). Same traveling-button
// behavior; the button lands in the closing CTA and the Next-Project section
// (RIT EATS) stays put below it.
const RIT_DECK = {
  url: "https://docs.google.com/presentation/d/1LAgeFbZh4RXJFcRqzZfiWBLMYVkDib7QpaEPtDv256o/edit?usp=sharing",
  heroLabel: "View the deck ↗",
  closeLabel: "View the deck ↗",
  ariaLabel: "View the deck",
  closeHeading: (
    <>
      Want the <em>full walkthrough</em>?
    </>
  ),
  closeSub: "Every screen and decision lives in the case-study deck.",
};

// RIT EATS uses its own self-contained kit (stat band, directions list, two-sided
// pillars, role note). Names overlap with the other kits, so it gets its own map.
const ritEatsComponents = {
  CsSection: EatsCsSection,
  Caption: EatsCaption,
  RoleNote,
  ProblemGrid: EatsProblemGrid,
  ProblemCard: EatsProblemCard,
  StatBand,
  Stat: EatsStat,
  Chips: EatsChips,
  InsightBand: EatsInsightBand,
  Directions,
  Direction,
  LeftOut: EatsLeftOut,
  Pillars,
  Pillar: EatsPillar,
  ImageFrame: EatsImageFrame,
  IdSplit: EatsIdSplit,
  Takeaway: EatsTakeaway,
};

// RIT EATS links to the Team Athens Figma prototype. Same traveling-button
// behavior; lands in the closing CTA, Next Project (MyCourses 2.0) stays below.
const RIT_EATS_PROTO = {
  url: "https://www.figma.com/proto/pctLeYEMbOrLog27bP3pCs/620---Prototype?node-id=420-2&t=h0P5XmvQ8eh8Ec0z-1",
  heroLabel: "View prototype ↗",
  closeLabel: "Open the prototype ↗",
  ariaLabel: "View prototype",
  closeHeading: (
    <>
      Want to <em>try it</em>?
    </>
  ),
  closeSub: "The full two-sided flow lives in the Figma prototype.",
};

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) notFound();

  const fm = cs.frontmatter;
  // The scroll-choreographed deck/prototype button + split hero media are opt-in
  // per case study (currently MyCourses + RoomieMatch + RIT Athletics).
  const isMyCourses = slug === "mycourses";
  const isRoomieMatch = slug === "roomiematch";
  const isRitAthletics = slug === "rit-athletics";
  const isRitEats = slug === "rit-eats";

  const heroMedia = isMyCourses ? (
    // Self-contained mockup (tablet + brand gradient) — shown whole at its natural
    // aspect, no extra frame. next/image optimizes the heavy source PNG.
    <Image
      src="/case-studies/mycourses/hero-tablet.png"
      alt="The redesigned MyCourses dashboard, shown on a tablet."
      width={1860}
      height={1520}
      sizes="(max-width: 768px) 92vw, 46vw"
      priority
      style={{ width: "100%", height: "auto", borderRadius: 12 }}
    />
  ) : isRoomieMatch ? (
    // Phone mockups on cream (NOT the dark-purple full-bleed banner). Purple lives
    // only inside the app screens; the page chrome stays cream/ink/orange.
    <Image
      src="/case-studies/roomiematch/hero.png"
      alt="RoomieMatch shown on three phones — the lifestyle onboarding step, a swipe-to-match card, and the community listings."
      width={1600}
      height={1095}
      sizes="(max-width: 768px) 92vw, 46vw"
      priority
      style={{ width: "100%", height: "auto", borderRadius: 12 }}
    />
  ) : isRitAthletics ? (
    // Live-game scoreboard phones on cream (the gray studio backdrop was
    // flood-filled to the page cream) — not the old gray pedestal hero.
    <Image
      src="/case-studies/rit-athletics/hero.png"
      alt="The redesigned RIT Athletics live-game view on two phones — a roster with RIT Tigers leading Boston University 3–2, and a live play-by-play commentary feed."
      width={1500}
      height={1077}
      sizes="(max-width: 768px) 92vw, 46vw"
      priority
      style={{ width: "100%", height: "auto", borderRadius: 12 }}
    />
  ) : isRitEats ? (
    // The existing RITEATS title slide — a dark branded asset framed on cream like
    // a poster (not a full-bleed band). next/image optimizes the heavy source.
    <Image
      src="/case-studies/rit-eats/hero.png"
      alt="The RITEATS title slide — the RITEATS wordmark, a repeated 'Tigers gotta eat' motif, and a phone showing the burger-forward ordering app, credited to Team Athens, 2024."
      width={1800}
      height={1018}
      sizes="(max-width: 768px) 92vw, 46vw"
      priority
      style={{ width: "100%", height: "auto", borderRadius: 12 }}
    />
  ) : undefined;

  return (
    <>
      <Hero
        title={fm.title}
        role={fm.role}
        year={fm.year}
        duration={fm.duration}
        team={fm.team}
        outcome={fm.tagline}
        media={heroMedia}
      >
        {isMyCourses && <FigmaHeroButton />}
        {isRoomieMatch && (
          <PrototypeHeroButton url={ROOMIE_PROTO.url} heroLabel={ROOMIE_PROTO.heroLabel} />
        )}
        {isRitAthletics && (
          <PrototypeHeroButton url={RIT_DECK.url} heroLabel={RIT_DECK.heroLabel} />
        )}
        {isRitEats && (
          <PrototypeHeroButton url={RIT_EATS_PROTO.url} heroLabel={RIT_EATS_PROTO.heroLabel} />
        )}
      </Hero>

      <article>
        <MDXRemote
          source={cs.body}
          components={
            isRoomieMatch
              ? roomieComponents
              : isRitAthletics
                ? ritComponents
                : isRitEats
                  ? ritEatsComponents
                  : mdxComponents
          }
          options={{ blockJS: false }}
        />
      </article>

      {isMyCourses && <FigmaOnePager />}
      {isRoomieMatch && <PrototypeButton {...ROOMIE_PROTO} />}
      {isRitAthletics && <PrototypeButton {...RIT_DECK} />}
      {isRitEats && <PrototypeButton {...RIT_EATS_PROTO} />}

      <NextProject currentSlug={slug} />
    </>
  );
}
