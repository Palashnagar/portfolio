import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface CaseStudyFrontmatter {
  title: string;
  tagline: string;
  role: string;
  year: string;
  duration: string;
  team: string;
  tools: string[];
  cover: string;
  metrics?: { label: string; value: string }[];
}

export interface LoadedCaseStudy {
  frontmatter: CaseStudyFrontmatter;
  body: string;
}

export async function loadCaseStudy(slug: string): Promise<LoadedCaseStudy | null> {
  const filepath = path.join(process.cwd(), "content", "case-studies", `${slug}.mdx`);
  try {
    const file = await fs.readFile(filepath, "utf-8");
    const { data, content } = matter(file);
    return { frontmatter: data as CaseStudyFrontmatter, body: content };
  } catch {
    return null;
  }
}

export async function listCaseStudySlugs(): Promise<string[]> {
  const dir = path.join(process.cwd(), "content", "case-studies");
  try {
    const files = await fs.readdir(dir);
    return files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}
