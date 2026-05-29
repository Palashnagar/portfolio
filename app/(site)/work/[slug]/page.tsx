import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Reveal } from "@/components/motion/Reveal";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { PalashCharacter } from "@/components/character/PalashCharacter";
import { Section } from "@/components/case-study/Section";
import { Insight } from "@/components/case-study/Insight";
import { MetricCallout } from "@/components/case-study/MetricCallout";
import { UserQuote } from "@/components/case-study/UserQuote";
import { ImageGroup } from "@/components/case-study/ImageGroup";
import { NextCaseStudy } from "@/components/case-study/NextCaseStudy";
import { loadCaseStudy, listCaseStudySlugs } from "@/lib/mdx";

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
      images: [cs.frontmatter.cover],
    },
  };
}

const mdxComponents = {
  Section,
  Insight,
  MetricCallout,
  UserQuote,
  ImageGroup,
  PalashCharacter,
};

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) notFound();

  return (
    <main>
      {/* 01 Cover */}
      <section className="max-w-content mx-auto px-6 md:px-10 pt-24 pb-12">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
            {cs.frontmatter.role} · {cs.frontmatter.year} · {cs.frontmatter.duration}
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-8xl tracking-tight leading-[1.0] mb-6">
            {cs.frontmatter.title}
          </h1>
          <p className="max-w-3xl text-xl md:text-2xl opacity-80 leading-relaxed">
            {cs.frontmatter.tagline}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.12em] opacity-70 mb-1">
                Team
              </div>
              <div>{cs.frontmatter.team}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.12em] opacity-70 mb-1">
                Tools
              </div>
              <div>{cs.frontmatter.tools.join(" · ")}</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-12 aspect-[16/9] rounded-xl overflow-hidden bg-[var(--bg-2)]">
            <PlaceholderImage
              slot="cover"
              path={cs.frontmatter.cover}
              aspect="16/9"
              label={`${cs.frontmatter.title} hero`}
            />
          </div>
        </Reveal>
      </section>

      {/* MDX-rendered sections (02–08) */}
      <article>
        <MDXRemote
          source={cs.body}
          components={mdxComponents}
          options={{ blockJS: false }}
        />
      </article>

      <NextCaseStudy currentSlug={slug} />
    </main>
  );
}
