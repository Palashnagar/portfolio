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

  return (
    <>
      <Hero
        title={fm.title}
        role={fm.role}
        year={fm.year}
        duration={fm.duration}
        team={fm.team}
        outcome={fm.tagline}
      />

      <article>
        <MDXRemote
          source={cs.body}
          components={mdxComponents}
          options={{ blockJS: false }}
        />
      </article>

      <NextProject currentSlug={slug} />
    </>
  );
}
