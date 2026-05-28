/**
 * Pulls all images referenced by the existing Framer portfolio into
 * /public/case-studies/<slug>/ as best-effort placeholders.
 *
 * Run: npx tsx scripts/pull-existing-images.ts
 */

import { writeFile, mkdir } from "fs/promises";
import path from "path";

const SITE = "https://palashnagar15.framer.website";
const SLUGS = ["mycourses", "roomiematch", "rit-athletics", "rit-eats"] as const;

/** Maps our portfolio slug to the Framer site's URL path */
const FRAMER_PATH: Record<string, string> = {
  mycourses: "/works/mycourses",
  roomiematch: "/works/roomiematch",
  "rit-athletics": "/works/athleticapp",
  "rit-eats": "/works/riteats",
};

async function pullPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (portfolio-pull/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

function extractImageUrls(html: string): string[] {
  const out = new Set<string>();
  // Decode HTML entities in attribute values before matching
  const decoded = html.replace(/&amp;/gi, "&");
  const reSrc = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = reSrc.exec(decoded)) !== null) {
    const u = m[1];
    if (u.startsWith("data:")) continue;
    out.add(u.startsWith("http") ? u : new URL(u, SITE).toString());
  }
  const reOg = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi;
  while ((m = reOg.exec(decoded)) !== null) out.add(m[1]);
  return Array.from(out);
}

async function downloadOne(url: string, dest: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
}

async function main() {
  const inventory: Record<string, { pulled: string[]; failed: string[] }> = {};

  console.log(`→ fetching index pages`);
  const indexHtml = await pullPage(`${SITE}/`);
  const worksHtml = await pullPage(`${SITE}/works`).catch(() => "");

  // Global images (home + works index) — shared / hero shots
  const globalUrls = new Set<string>([
    ...extractImageUrls(indexHtml),
    ...extractImageUrls(worksHtml),
  ]);

  for (const slug of SLUGS) {
    inventory[slug] = { pulled: [], failed: [] };
    const dir = path.join(process.cwd(), "public", "case-studies", slug);
    await mkdir(dir, { recursive: true });

    // Fetch the individual case-study page from the Framer site
    const framerUrl = `${SITE}${FRAMER_PATH[slug]}`;
    console.log(`→ fetching ${framerUrl}`);
    const pageHtml = await pullPage(framerUrl).catch((e) => {
      console.log(`  ✗ could not fetch ${framerUrl}: ${(e as Error).message}`);
      return "";
    });

    const pageUrls = extractImageUrls(pageHtml);

    // Also keep any global URLs that appeared on the works index
    // (they may be project thumbnails)
    const allUrls = new Set<string>([...pageUrls, ...globalUrls]);

    // Filter to framerusercontent images only (skip tiny SVG icons etc.)
    const candidates = Array.from(allUrls).filter(
      (u) =>
        u.includes("framerusercontent.com/images") &&
        !u.toLowerCase().endsWith(".svg"),
    );

    // Deduplicate by base URL (strip query params for dedup key)
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const u of candidates) {
      const base = u.split("?")[0];
      if (!seen.has(base)) {
        seen.add(base);
        deduped.push(u);
      }
    }

    console.log(`  found ${deduped.length} candidate image(s) for ${slug}`);

    for (let i = 0; i < deduped.length; i++) {
      const url = deduped[i];
      const ext = (url.split("?")[0].match(/\.(jpe?g|png|webp|gif|svg)/i) || [
        "",
        "jpg",
      ])[1];
      const dest = path.join(
        dir,
        `pulled-${String(i).padStart(2, "0")}.${ext}`,
      );
      try {
        await downloadOne(url, dest);
        inventory[slug].pulled.push(path.basename(dest));
        console.log(`  ✓ ${slug}: ${path.basename(dest)}`);
      } catch (err) {
        inventory[slug].failed.push(url);
        console.log(`  ✗ ${slug}: ${url} (${(err as Error).message})`);
      }
    }
  }

  await mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await writeFile(
    path.join(process.cwd(), "data", "image-inventory.json"),
    JSON.stringify(inventory, null, 2),
  );
  console.log("→ inventory saved to data/image-inventory.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
