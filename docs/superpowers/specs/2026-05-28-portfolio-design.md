# Portfolio Design Spec — Palash Nagar

**Date:** 2026-05-28
**Owner:** Palash Nagar
**Replaces:** `palashnagar15.framer.website` (existing Framer-built site)
**Working dir:** `/Users/palashnagar/portfolio/`

## Goal

Build a custom-coded portfolio that stands out on first impression, keeps case studies recruiter-skimmable, and reads as "considered, calm, current." Replaces the current Framer site, ships fully working on Vercel with the URL shareable in ~1–2 sessions of build work.

## Non-goals

- Dark mode (light-only is part of the visual identity)
- WebGL / 3D / heavy shader work (out of scope, not worth the lift for this version)
- Headless CMS (file-based MDX is plenty for this scale)
- Custom domain (Vercel subdomain for now; trivial to attach later)
- Inline rebuild in Framer's visual editor (custom code on Vercel, not `*.framer.website`)

## Constraints & decisions

| | |
|---|---|
| **Hosting** | Vercel free tier · `palashnagar.vercel.app` |
| **Theme** | Light only · Warm Atelier (cream + ochre) |
| **Type** | Fraunces (display, with soft italics) + Inter (body/UI) |
| **Case studies** | All 4 follow one 8-section template (locked) |
| **Build sequence** | MVP-first: Ship 1 (Home + About + Work + MyCourses + Contact) → Ship 2 (remaining 3 case studies) → Ship 3 (Blog) |
| **Images** | Phase 1: pull from existing Framer site. Phase 2: generate cream/ochre SVG placeholders. Phase 3: user replaces with real artifacts. |
| **Cinematic moments** | 4 selected: intro reveal · portraits film · custom cursor · status marquee |
| **Animation language** | Quiet (word-rise, fade, parallax) + Cursor-reactive (magnetic CTAs) |

## Tech stack

- **Next.js 15** (App Router) — file-based routing, image optimization, static rendering by default
- **TypeScript** — strict mode
- **Tailwind CSS v4** — utility-first, theme tokens defined in `tailwind.config.ts`
- **Framer Motion** — page transitions, scroll-triggered reveals, magnetic cursor
- **MDX** (`@next/mdx` or `next-mdx-remote`) — case study and blog content
- **Lenis** (optional, behind `prefers-reduced-motion`) — smooth scroll
- **next-themes** — not needed (light-only) → skip
- **Vercel Analytics** — pageview + web vitals tracking
- **Resend** — contact form (free tier covers expected volume)

## Site map

```
/                           Home
/work                       Work index (all 4 case studies)
/work/mycourses             Case study (Ship 1)
/work/roomiematch           Case study (Ship 2)
/work/rit-athletics         Case study (Ship 2)
/work/rit-eats              Case study (Ship 2)
/about                      About page
/blog                       Blog index (Ship 3)
/blog/[slug]                Blog post (Ship 3)
/resume                     In-site résumé + PDF download
/contact                    Contact form
```

**Navigation order:** Work · About · Blog · Resume · Contact · (logo "✱ Palash Nagar" returns home)

## Design system

### Color tokens

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#f6efe3` | Page background, primary canvas |
| `--bg-2` | `#ede5d4` | Section divider, alt-row background |
| `--ink` | `#2b1d12` | Primary text, dark UI |
| `--ink-2` | `#5a3a22` | Secondary text, captions |
| `--accent` | `#b45309` | Ochre — links, accents, magnetic CTA, italic display text |
| `--accent-2` | `#d4a373` | Warm tan — secondary accent, subtle backgrounds |
| `--accent-soft` | `rgba(180,83,9,0.12)` | Pill backgrounds, hover tints |
| `--line` | `rgba(43,29,18,0.12)` | Hairlines, dividers |

### Typography

- **Display** — `Fraunces` (variable, opsz 9–144, wght 400–700, SOFT 0–100). Italic variants used for accent words.
- **Body / UI** — `Inter` (variable, wght 400–600)
- **Mono** (optional, for captions/metadata) — system monospace stack

**Type scale (rem, mobile → desktop):**

| Role | Mobile | Desktop |
|---|---|---|
| Display XL (hero) | 3.5 | 6.5 |
| Display L (section headers) | 2.5 | 4 |
| Display M (case study titles) | 2 | 3 |
| Body L (lead paragraphs) | 1.125 | 1.25 |
| Body M (default) | 1 | 1.0625 |
| Caption / Eyebrow | 0.75 | 0.8125 |

### Spacing

8px base unit. Section vertical padding: `5rem` mobile → `8rem` desktop. Max content width: `72rem` (1152px). Reading column max: `42rem` (case study body).

### Motion tokens

- `--ease-out-quart` — `cubic-bezier(0.25, 1, 0.5, 1)` — primary easing for reveals
- `--duration-fast` — `0.4s`
- `--duration-base` — `0.7s`
- `--duration-slow` — `1.2s`
- All motion checks `prefers-reduced-motion: reduce` and degrades to instant fade or no animation.

## Cinematic moments (the four selected)

### 1. Intro reveal — first load only

**Where:** Homepage, only on first visit (gate via sessionStorage flag).
**Sequence (~3s):**
- `0.0s` — Empty cream canvas
- `0.3s` — Letters of "PALASH" rise + fade in one-by-one (stagger 150ms)
- `0.8s` — Warm radial gradient blob blooms from top-right corner (opacity 0 → 0.4)
- `1.5s` — Tagline "Good design should feel *inevitable.*" word-rises in
- `2.5s` — Hero image dissolves in
- `3.0s` — Navigation fades in, page is interactive
**Tech:** Framer Motion with orchestrated `AnimatePresence`. Skippable by scroll or click.

### 3. Portraits film — About page section #5

**Where:** `/about`, section #5 ("Off the clock").
**Behavior:**
- Horizontal-flowing reel of 6–10 frames (Cricket, Travel, Gym, Capstone, Books, etc.)
- Auto-scrolls slowly (constant velocity) when in viewport
- Scroll velocity multiplied based on vertical scroll progress when section is pinned
- Each frame: photo + one-line caption + small year tag
- Reduced-motion fallback: static grid of frames

**Tech:** CSS `animation` for base loop. `useScroll` + `useTransform` (Framer Motion) for vertical-scroll-coupled speed-up.

### 5. Custom cursor — desktop only

**Where:** Site-wide on desktop. Hidden on touch devices.
**Behavior:**
- Tiny ochre disc (8px) follows pointer
- On `data-cursor="view"` elements (case study cards, etc.): cursor expands to 56px disc with label ("View →", "Open", "Read")
- On text input fields: cursor switches to text caret style
- 100ms lag for smoothness (springy follow)
- Hidden cursor (`cursor: none`) on hoverable surfaces

**Tech:** Single React component using `pointermove` + Framer Motion springs.

### 6. Status marquee — top of site

**Where:** Thin strip above the main nav, every page.
**Behavior:** Horizontal scrolling ticker (CSS keyframes) with status strings the user defines in `data/status.ts`. Pause-on-hover. Tiny (28px height).
**Initial strings:** `✱ Available May 2026` · `✱ Building thermal wearables at RIT` · `✱ Open to relocation` · `✱ Currently reading: Ruined by Design`

## Character mascot — "Palash" illustration

A custom illustrated character of the user, used **sparingly** as a recurring personality element. Style direction locked: **Warm Hand-Drawn / Editorial illustration** (Mailchimp Freddie · Headspace · Cassie Evans · New Yorker spot lineage).

### Locked design elements

These stay identical across every instance so the character reads as one consistent personality:

- Young designer figure, friendly proportions (head slightly larger than realistic)
- Short, slightly messy dark hair (`--ink` #2b1d12) with visible individual strokes
- Round-frame glasses (1.5px outline, no fill)
- Warm skin tone (base `#d4a373`, shadow `#c8946b`)
- Casual shirt in ochre/terracotta (`--accent` #b45309 or `#c2410c`)
- **Line treatment:** 1.5px primary outline, 1.2px detail strokes, slightly imperfect / hand-drawn feel
- **Shading:** Soft diagonal hatch pattern at 30% opacity in shirt fills, subtle blush ellipses on cheeks
- All fills reference design system color tokens via CSS variables — fully themeable

### Variants (poses & expressions)

| Variant | Description | Display size | Aria |
|---|---|---|---|
| `hero-wave` | Full body, waving with right arm, soft smile | 320–400px wide | Meaningful label |
| `thinking` | Head + shoulders, finger to chin, contemplating | 64–96px | Decorative (hidden) |
| `pointing` | Head + arm, finger extended toward next element | 80px | Decorative (hidden) |
| `peeking` | Just head + glasses appearing from screen edge | 48–64px | Decorative (hidden) |
| `celebrating` | Both arms up, eyes closed in joy | 96–120px | Decorative (hidden) |

### Placement plan (4 instances total — cap enforced)

1. **`/about` section 02 (Bio)** — `hero-wave` at full size alongside the bio text. Idle wave animation. The "primary introduction" instance — gets the only meaningful aria-label.
2. **`/work/[slug]` section 02 (Problem)** — `thinking` pose peeking from the left margin near the problem statement. Subtle entrance fade.
3. **`/` Home, "Let's connect" section** — `pointing` pose oriented toward the magnetic CTA button. Entrance fade on scroll-in.
4. **`/contact` success state** — `celebrating` after successful form submission. Brief scale-pop entrance.

Hard rule: **no other appearances**. Adding more risks tipping into gimmicky.

### Implementation

**Component:** `/components/character/PalashCharacter.tsx`

```ts
type CharacterVariant = 'hero-wave' | 'thinking' | 'pointing' | 'peeking' | 'celebrating';

interface PalashCharacterProps {
  variant: CharacterVariant;
  size?: number;          // px; defaults per variant
  decorative?: boolean;   // default true → aria-hidden
  label?: string;         // overrides default aria-label when decorative=false
}
```

- Returns **inline SVG** (not `<img>` or background-image) so colors react to CSS variables
- All colors via `currentColor` / CSS custom properties (`var(--accent)`, etc.) — no hardcoded hex
- Animations live in component (variant-specific) — wave on `hero-wave` only, fade-in entrance on all
- Each SVG ≤ 4KB inline
- Variants are separate SVG bodies in one file — shared `<defs>` for the hatch pattern and gradient definitions

### Animation

- **Entrance (all variants):** `useReveal` hook — opacity 0→1 + 12px y offset → 0, 0.7s ease-out-quart, triggered once on intersection
- **Idle on hero-wave:**
  - Arm wave: 2.4s ease-in-out infinite, rotates 18° → -8° → 0° on a `transform-origin` near the shoulder joint
  - Blink: eye opacity 1 → 0 → 1 over 200ms, every 4-6s (randomized)
- **Celebrating idle:** Subtle 0.5s scale-bounce on mount (1 → 1.08 → 1)
- All idle animations check `prefers-reduced-motion: reduce` → disabled entirely

### Accessibility

- Hero version: `aria-label="Illustration of Palash waving hello"` (or user-provided override)
- All other instances: `aria-hidden="true"`
- Inline SVG (not external) — no extra network request, no render-block
- `role="img"` only on the labelled hero instance
- Idle animations pause when component is off-screen (intersection observer) to save battery

### Open item for character art

The rough SVGs shown in the visual companion are **style-direction references, not final art**. During Ship 1 the site uses my refined SVG sketches as functional placeholders. The path to final art:

- **(a)** Palash draws the variants himself in Figma/Procreate following the locked design rules — most authentic, preferred
- **(b)** Commission an illustrator who can match the Warm Hand-Drawn direction
- **(c)** I refine the placeholder SVGs further with more anatomical accuracy

Flagged in Ship 1 open items below.

## Page designs

### `/` Home

Sections top to bottom:
1. **Status marquee** (cinematic moment #6, on every page)
2. **Navigation** — logo left, links right
3. **Hero** — Intro reveal (cinematic #1) on first load; thereafter a static hero with name + tagline + intro paragraph + "See work ↓" link
4. **Selected work** — 3 featured case studies as large tiles (MyCourses, RoomieMatch, RIT Athletics). Hover triggers warm tint + custom cursor "View →". Each tile shows: cover image, project title, role tag, one-line description, year.
5. **A bit about me** — Short paragraph + headshot + "More about me →" link to /about
6. **Currently / Now** — 3 live strips (Building, Reading, Available)
7. **Let's connect** — Magnetic ochre CTA + social row. **Character mascot instance #3:** `pointing` pose oriented toward the CTA.
8. **Footer** — Sitemap links, copyright, "Built from scratch · 2026" credit

### `/work` Work index

- Page title: "Selected work · 04 projects"
- 4 large case study tiles in a 2-column grid (mobile: stacked)
- Each tile: cover image, title, year, role, 1-line description, hover-reveal pull quote
- Custom cursor shows "View →"
- Bottom: "Want to talk? →" CTA

### `/work/[slug]` Case study template

Every case study uses this 8-section structure (locked).

| # | Section | What it does |
|---|---|---|
| 01 | **Cover** | Title + tagline + role/year/duration/team/tools strip + hero image |
| 02 | **Problem** | Pain narrative + one user quote pull-out + scope. **Character mascot instance #2:** `thinking` pose peeking from left margin. |
| 03 | **Research** | Methods (2-3 max) + 3 numbered insights + research artifact images |
| 04 | **How Might We** | One bold HMW statement + 2-3 design principles |
| 05 | **Process** | Sketches → wireframes → iterations (2-4 visuals, each captioned with *what changed and why*) |
| 06 | **Solution** | Final hi-fi screens grouped by user flow (each group: 1-3 screens + 1 sentence on what it solves) |
| 07 | **Outcome** | Big metric callouts + validation note ("real users", "8 users in 2nd usability round", etc.) |
| 08 | **Reflection** | 2-3 sentences: what surprised you, what you'd change, what you carry forward |
| → | **Next case study** | Auto-cycle tile to keep recruiters scrolling |

**Image slots per case study:**
- `cover.jpg` (16:9, hero)
- `problem-quote-bg.jpg` (optional, atmospheric)
- `research-artifact-1.jpg`, `-2.jpg` (affinity map, interview shots)
- `process-1.jpg` through `-4.jpg` (sketches, wireframes)
- `solution-flow-1.jpg` through `-3.jpg` (hi-fi screens, grouped by flow)
- `outcome.jpg` (optional, validation moment)
- `og.jpg` (1200×630 for social sharing)

**Content storage:** MDX file at `/content/case-studies/[slug].mdx` with frontmatter for metadata, image paths, metrics. Body uses custom MDX components: `<Section>`, `<Insight>`, `<MetricCallout>`, `<ImageGroup>`, `<UserQuote>`, `<NextCaseStudy>`.

### `/about`

8 sections (locked anatomy):

| # | Section | Notes |
|---|---|---|
| 01 | **Hero** | One opinionated sentence. Word-rise on view. |
| 02 | **Bio** | 2-3 paragraphs + **character mascot instance #1**: `hero-wave` full-size, with idle wave + blink. The character replaces the photo headshot here as the primary personal introduction. Pull-quote callout below. |
| 03 | **Currently** | Live strip: working on, reading, availability. Updates from `data/currently.ts`. |
| 04 | **Experience** | Timeline rows (year · place · role). Hover for context line. |
| 05 | **Off the clock** | **Portraits film** (cinematic moment #3). |
| 06 | **Toolkit** | Pill tags grouped by Design / Research / Build. |
| 07 | **Beliefs** | 3 design principles. Each scrolls in larger as it enters viewport. |
| 08 | **Connect** | Magnetic CTA → /contact + social links + résumé download. |

### `/blog` (Ship 3)

- Index: list of posts, ordered by date, each with title + date + 1-line excerpt
- Post page: MDX-rendered article with reading column constraint
- No comments. No tags v1.

### `/resume`

- In-site typeset résumé in the Warm Atelier system
- Sections: Header (name + contact) · Experience · Education · Selected projects · Skills · Awards
- Print stylesheet so `Cmd-P` produces a clean black-on-white PDF
- "Download PDF" button at top (links to a static PDF in `/public/palash-nagar-resume.pdf`)

### `/contact`

- Big hero: "Let's make something." (or similar — final copy in content plan)
- Form: Name · Email · Message · Project type (radio: Full-time · Freelance · Just saying hi)
- Submit hits Resend API route at `/api/contact`
- Success state: typewriter-style confirmation message + **character mascot instance #4:** `celebrating` pose with scale-pop entrance
- Fallback: `mailto:asnddev@gmail.com` link visible below form

## Image asset strategy

### Phase 1 — Pull from existing site (build-time, one-shot)

Script at `/scripts/pull-existing-images.ts`:
1. Crawl `palashnagar15.framer.website/works`
2. Download all referenced images to `/public/case-studies/<slug>/<original-filename>`
3. Generate an inventory file at `/data/image-inventory.json` listing what we got vs what's missing

### Phase 2 — Generated placeholders

For any missing image slot, generate a styled SVG placeholder:
- Cream background, ochre dashed border
- Centered Fraunces italic caption: "Hero mockup · drop file at `/public/case-studies/mycourses/cover.jpg`"
- Maintains correct aspect ratio so layout doesn't shift when real image lands
- Component: `<PlaceholderImage slot="cover" path="..." aspect="16/9" />`

### Phase 3 — User-replaced

User drops real files into `/public/case-studies/<slug>/`. No code change needed — placeholder component detects file existence at build time and switches automatically.

## Animation system

Single hook `useReveal()` wraps Framer Motion's `motion.div` with:
- `initial` — opacity 0, y offset 24px
- `whileInView` — opacity 1, y 0
- `viewport` — `once: true`, `margin: -10%`
- `transition` — duration 0.7s, ease-out-quart, optional stagger for children
- Honors `prefers-reduced-motion: reduce` → instant fade only, no Y movement

Used everywhere — case study sections, about sections, work tiles. Keeps motion language consistent.

Magnetic button hook `useMagnetic()` — primary CTAs translate up to 8px toward cursor on hover, spring back on leave. Skipped on touch devices.

## Accessibility

- Semantic HTML throughout (`<header>`, `<main>`, `<article>`, `<nav>`)
- All images have alt text (descriptive for content images, empty for decorative)
- Color contrast ≥ 4.5:1 for body text (verified: ink `#2b1d12` on bg `#f6efe3` ≈ 11.8:1)
- Focus rings visible — ochre outline 2px offset, never removed
- Custom cursor falls back to system cursor on touch / when JS disabled
- Marquee pauses on focus-within and respects reduced motion
- Form fields labelled, errors announced via `aria-live`
- Skip-to-content link at top of every page
- Keyboard-traversable in DOM order; magnetic buttons keep their bounding box for keyboard focus

## Project structure

```
/Users/palashnagar/portfolio/
├── app/                              Next.js App Router
│   ├── (site)/
│   │   ├── page.tsx                  Home
│   │   ├── work/
│   │   │   ├── page.tsx              Work index
│   │   │   └── [slug]/page.tsx       Case study page
│   │   ├── about/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── contact/page.tsx
│   │   └── layout.tsx                Site shell (marquee, nav, footer, cursor)
│   ├── api/
│   │   └── contact/route.ts          Resend handler
│   └── layout.tsx                    Root layout (fonts, theme)
├── components/
│   ├── motion/                       useReveal, useMagnetic, IntroReveal, PortraitsFilm
│   ├── cursor/CustomCursor.tsx
│   ├── marquee/StatusMarquee.tsx
│   ├── nav/Nav.tsx
│   ├── footer/Footer.tsx
│   ├── character/                    PalashCharacter.tsx (all variants), variants.tsx (SVG bodies)
│   ├── case-study/                   Section, Insight, MetricCallout, etc.
│   ├── work/WorkTile.tsx
│   └── ui/                           Button, MagneticButton, PlaceholderImage
├── content/
│   ├── case-studies/                 mycourses.mdx, roomiematch.mdx, etc.
│   └── blog/                         (Ship 3)
├── data/
│   ├── currently.ts                  About-page "Currently" strip
│   ├── status.ts                     Marquee strings
│   ├── experience.ts                 Timeline rows
│   ├── tools.ts                      Toolkit pills
│   ├── beliefs.ts                    3 design principles
│   └── portraits.ts                  Off-the-clock film entries
├── lib/
│   ├── mdx.ts                        MDX loading + frontmatter parsing
│   └── motion.ts                     Reduced-motion utility
├── public/
│   ├── case-studies/<slug>/          Images per case study
│   ├── fonts/                        Self-hosted Fraunces + Inter (woff2)
│   └── palash-nagar-resume.pdf
├── scripts/
│   └── pull-existing-images.ts       Phase 1 image pull
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

## Build sequence

### Ship 1 — MVP live URL (~2.5 sessions)
- Project setup (Next.js, Tailwind, Framer Motion, fonts)
- Design system tokens + global styles
- Site shell: marquee, nav, footer, custom cursor
- Home page (with intro reveal)
- About page (all 8 sections including portraits film)
- Work index page
- MyCourses case study (fully populated, all 8 sections)
- Resume page + PDF
- Contact form + Resend handler
- **Character mascot system:** `PalashCharacter` component with all 5 variants, placed at 4 locations (about hero-wave, MyCourses thinking, home pointing, contact celebrating)
- Deploy to Vercel
- **Outcome:** Shareable URL with a fully complete look — nothing half-finished.

### Ship 2 — Remaining case studies (~1 session each)
- RoomieMatch MDX + images
- RIT Athletics MDX + images
- RIT EATS MDX + images
- "Next case study" tile linking activated across all four

### Ship 3 — Blog (~1 session)
- Blog index + post page
- MDX components for posts (callouts, code blocks if needed)
- First post seeded (user provides content)

## Content seed (initial copy)

User-supplied or pulled from existing site:
- Tagline: "Good design should feel inevitable."
- Bio: 2-3 paragraphs adapted from current /about
- MyCourses: existing content + restructured into 8-section template
- Other case studies: existing thin content stubbed into template, user fills in research/insights/reflection sections progressively

Open question for after spec approval: does the user want me to draft new copy for the home/about hero, or use existing verbatim? (Default: use existing as starting point; user edits in MDX.)

## Open items (post-spec, pre-build)

These are not blockers for spec approval but will need resolution during Ship 1:
- [ ] User provides portrait headshot for `/about` section 02 alt slot, or accepts character mascot as the primary intro (current spec assumes character replaces headshot here)
- [ ] User provides 6-10 hobby photos for portraits film (or placeholders + user replaces)
- [ ] User confirms initial marquee strings + "Currently" entries
- [ ] User provides résumé PDF or I generate one from the in-site résumé
- [ ] Resend API key in `.env.local` for contact form (or fall back to mailto)
- [ ] **Character art source:** decide between (a) Palash draws final variants, (b) commission an illustrator, or (c) I refine the placeholder SVGs further. Ship 1 uses my SVG sketches regardless — this just determines the v2 upgrade path.

## What "done for v1" looks like

- Live at `palashnagar.vercel.app`
- All Ship 1 pages working
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95
- Intro reveal works smoothly on first load
- Portraits film flows correctly
- Custom cursor active on desktop, invisible on mobile
- Marquee scrolls cleanly
- MyCourses case study reads as a complete, polished story
- Contact form sends or falls back to mailto
- Character mascot present at all 4 locked locations with hero-wave idle animation
- All copy is real (not lorem)

## Out-of-scope explicitly

- WebGL / Three.js / shaders
- Storytelling scroll-jacked hero (option #2 from cinematic-moments — skipped per recommendation)
- Door transition (option #4 — skipped, expensive and low-visibility)
- Dark mode
- Custom domain on day one (Vercel subdomain to start)
- CMS / database
- Internationalization
