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

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) notFound();

  const fm = cs.frontmatter;
  // The scroll-choreographed Figma button + split hero media are MyCourses-only.
  const isMyCourses = slug === "mycourses";

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
      </Hero>

      <article>
        <MDXRemote
          source={cs.body}
          components={mdxComponents}
          options={{ blockJS: false }}
        />
      </article>

      {isMyCourses && <FigmaOnePager />}

      <NextProject currentSlug={slug} />
    </>
  );
}
