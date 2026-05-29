# Portfolio v2 — Design Spec

> **Supersedes** `2026-05-28-portfolio-design.md` (Ship 1 "Warm Atelier"). That direction shipped, was reviewed as "functional but generic," and is being replaced wholesale. Do not preserve the Ship 1 visual language.
>
> **Source of truth for *feel*:** the four approved mockups in `/design-reference/`. Match their animation curves, cursor behavior, grain, palette, and typography, then polish for production. When this spec and a reference file disagree on a constant, the reference file wins for motion/visuals; this spec wins for structure/architecture.

**Goal:** Rebuild the portfolio around two signature interactions (a cursor-reactive kinetic hero and a horizontal scroll-jacked work section) and a bold editorial design system, refactor every case study onto one research-driven 7-part spine, and remove the broken illustration system and generic 2024–26 portfolio vocabulary.

**Architecture:** Next.js App Router (existing). One shared design system (tokens + 2 fonts + grain). A small set of reusable interaction primitives (cursor, magnetic, distortion, page transitions, Lenis smooth scroll) consumed by pages. Case studies are MDX rendered through one fixed 7-section template. Two signature interactions live only where specified (kinetic hero = home; horizontal reel = home).

**Tech Stack:** Next.js 16 (App Router, Turbopack) · TypeScript strict · Tailwind v4 (inline `@theme`) · Framer Motion (primary animation lib) · Lenis (smooth scroll) · vanilla `requestAnimationFrame` for the hero letter physics · MDX via next-mdx-remote/rsc · Vitest + RTL · Resend (contact) · Vercel.

---

## 1. Design language (locked)

| Token | Value | Notes |
|---|---|---|
| `--bg` | `#F5F1EA` | warm cream, NOT pure white |
| `--ink` | `#0A0A0A` | near-black foreground |
| `--accent` | `#E94E1B` | thermal orange (nods to thermal-wearable capstone) |
| `--muted` | `#8A867F` | secondary text / meta |
| `--line` | `rgba(10,10,10,0.14)` | hairlines, borders |

- **Display type:** Instrument Serif (Google Fonts, `ital@0;1`). Italic used liberally for accent words **inside the kinetic hero**, project-title accent words, and inline emphasis. Default weight 400.
- **Body type:** Bricolage Grotesque (Google Fonts, `wght 300;400;500;700`).
- **Meta / eyebrows / numbers / progress + cursor labels / Now strip:** Bricolage Grotesque, **uppercase, letter-spaced (~0.15–0.2em), small-caps register** — exactly the reference files' treatment. **No third typeface** (the locked brief specifies two fonts; "mono-cased small caps" in the brief is read as this uppercase/small-caps treatment, not a monospace typeface). If a monospace accent is wanted later, it's an additive decision, not part of v2 baseline.
- **Grain overlay (every page):** fixed full-viewport SVG `feTurbulence` (`type=fractalNoise baseFrequency=0.9 numOctaves=3 stitchTiles=stitch`, inner rect `opacity 0.65`), layer `opacity: 0.18; mix-blend-mode: multiply; z-index: 100; pointer-events: none`. Exact data-URI in every `/design-reference` file — reuse verbatim.
- **Fonts loaded** via `next/font/google` in the root layout (self-hosted, no CLS), exposing CSS vars `--font-display` (Instrument Serif) and `--font-body` (Bricolage Grotesque).

---

## 2. Reference files (source of truth)

All four live in `/design-reference/` (committed). They are standalone HTML; do not ship them, port their behavior.

| File | Governs |
|---|---|
| `01-kinetic-hero.html` | Homepage hero letter physics + corner nav + cursor + sub-copy |
| `03-horizontal-scroll.html` | Homepage horizontal scroll-jacked work section + progress rail + panel anatomy |
| `04-hover-distortion.html` | `/work` grid + thumbnail distortion filter + expanding "View →" cursor |
| `02-draggable-canvas.html` | Reference only — an alternate work-grid exploration. **Not used** in v2 (the locked spec routes `/work` to the static distortion grid). Keep for inspiration on the easter-egg / future. |

---

## 3. Information architecture & routes

| Route | Contents |
|---|---|
| `/` | Kinetic hero → intro slate → horizontal scroll work section → About teaser → Now strip → Contact CTA → footer |
| `/work` | All projects in a static 2-col grid with hover distortion (same filter as horizontal section) |
| `/work/[slug]` | Case study, rendered through the fixed 7-section template |
| `/about` | Personal page (researcher-meets-designer narrative) |
| `/resume` | Clean web layout + link to PDF (keep existing print styles) |
| `/contact` | Simple form (keep existing API + Resend integration) |

Case study slugs: `mycourses`, `roomiematch`, `rit-athletics`, `rit-eats`.

---

## 4. Signature interaction 1 — Kinetic hero (home only)

Massive display text `DESIGN / THAT FEELS / INEVITABLE.` with **THAT** as an italic-orange accent. Each letter is an individually transformable `<span>`.

**Physics (match `01-kinetic-hero` exactly):** per `mousemove`, for each letter compute distance to cursor. Within a **240px** radius: `f = 1 − dist/240`; translate `(−dx·f·0.18, −dy·f·0.18)`; `scale = 1 + f·0.22` (max 1.22×); `rotate = (dx/240)·f·−8deg`; set `font-style: italic` when `f > 0.5`. Run in a `requestAnimationFrame` loop; cursor position itself is lerp-smoothed at `0.18`. Re-measure letter rects on resize.

**Copy below hero (sub):** "I'm Palash — a UX designer and HCI researcher turning *thermal illusions* into wearables at RIT. I make digital things feel less anxious." (`*…*` = Instrument Serif italic.)

**Corner nav (no top bar on home):** TL name + "UX/UI · HCI · RIT"; TR Work/About/Resume; BL "© 2026 · Rochester, NY / Available May 2026"; BR "Get in touch →" (accent). Pulsing accent dot on the TL identity.

**Accessibility:** the `<h1>` carries `aria-label="Design that feels inevitable."`; the per-letter spans are `aria-hidden`. The decorative split must not change the heading's semantics for screen readers.

**Degradation:** touch → static large headline, no physics, native scroll, no `cursor:none`. `prefers-reduced-motion` → static headline (no transforms, no RAF). Mobile font scale `clamp(60px, 12.5vw, …)`.

---

## 5. Signature interaction 2 — Horizontal scroll-jacked work (home)

**Order:** kinetic hero → **calm intro slate** (give it a beat — do not jump straight from hero to horizontal) → horizontal section. Intro slate copy: **"Selected work · 04 projects"** (per written brief; the reference's "told *sideways*" is an alternative the user may swap in).

**Mechanics (match `03-horizontal-scroll`):** a `~500vh` wrapper drives the scroll; inside, a `position: sticky; height: 100vh` viewport holds a horizontal track translated by scroll progress: `translateX(−progress · (panels−1)·100vw)`. Four panels, one per case study, in order: MyCourses 2.0, RoomieMatch, RIT Athletics, RIT EATS.

**Per panel:** project number `0N / 04`; large 4:5 thumbnail (left); right column = mono meta row + Instrument Serif title with italic-orange accent word + one-line problem statement (italic phrase) + "Read the case study →". Thumbnails use the hover-distortion filter (§7.3).

**Progress UI:** fixed 280px hairline rail + accent fill at the bottom, plus a mono label showing current panel ("01 / 04 — MyCourses 2.0").

**Implementation:** Framer Motion `useScroll`/`useTransform` against the wrapper target, with Lenis driving smooth scroll. **No GSAP** (see §9).

**Degradation:** touch → native horizontal swipe carousel (scroll-snap), no jack. `prefers-reduced-motion` → vertical stack of the four panels, normal scroll, no horizontal translate. Both must keep all content reachable.

---

## 6. Page composition

- **Home:** §4 → §5 intro slate → §5 horizontal section → **About teaser** (short researcher-meets-designer paragraph + portrait + link to /about) → **Now strip** (§8) → **Contact CTA** ("Got something *worth building?*" + "Get in touch →") → footer.
- **/work:** eyebrow "Selected work · 04 projects" (mono) + Instrument Serif page title (e.g., "Things I've *built.*") + 2-col distortion grid (`04` anatomy: thumb, meta row with `0N / 04`, serif title w/ accent, one-line desc).
- **/about:** narrative page leaning into "HCI researcher turning thermal illusions into wearables, currently designing things that feel inevitable." Sections (text-first, no mascot, no PortraitsFilm): intro, what I research, how I work, selected background/experience, beliefs. Reuse existing about data files where still relevant; drop portraits-film.
- **/resume:** keep web layout + print styles + PDF link; restyle to v2 system.
- **/contact:** keep form + API; restyle to v2; success state is a typographic confirmation (NO celebrating mascot).

---

## 7. Cross-site interaction systems

### 7.1 Unified custom cursor
Single global component. States:
- **Default:** 10px orange dot, `mix-blend-mode: difference`, lerp-smoothed (~0.22).
- **Link hover:** scales to ~50px.
- **Project-card / thumbnail hover:** expands + shows label "View →".
- **Draggable area** (if any future use): shows label "Drag".
- **Touch devices:** cursor disabled entirely; all hover affordances convert to visible focus/active states. Respect `prefers-reduced-motion` (no lerp jitter; can snap).

### 7.2 Magnetic buttons
Primary CTAs (Contact, Resume, "Get in touch →") pull subtly toward the cursor when within ~80px. Reuse/replace the existing `useMagnetic` hook. Off on touch + reduced-motion.

### 7.3 Hover distortion (thumbnails)
SVG `filter#distort`: `feTurbulence fractalNoise baseFrequency 0.015 0.03 numOctaves 2 seed 2`, animating `baseFrequency` `0.015 0.03 → 0.04 0.06 → …` over 3s; `feDisplacementMap scale 40 (R/G)`. Applied only on `:hover` with `scale(1.04)`, ramped via `transition: filter 0.4s, transform 0.6s`. Used in the horizontal section and `/work` grid. No Three.js. Off on touch + reduced-motion (hover → none).

### 7.4 Page transitions
Real transition between home and case studies (and across routes): fade the page to cream, then reveal the new page with a slight upward translate, **~500ms total**. Implement with Framer Motion `AnimatePresence` driven by App Router `template.tsx` (re-mounts per navigation) + a cream curtain overlay. Not a bare route change. Disabled/*instant* under `prefers-reduced-motion`.

### 7.5 Smooth scroll
Lenis site-wide, mounted once in the layout, integrated with Framer Motion's scroll (`useScroll` reads the smoothed position). Disabled under `prefers-reduced-motion` (native scroll). Must not break anchor links or the horizontal section.

---

## 8. "Now" strip (redesign, replaces old widget)
A thin horizontal info strip — **three columns: Building / Reading / Available** — in Bricolage Grotesque uppercase/small-caps (letter-spaced), **no card backgrounds**, hairline separators only. Pull values from a small data file. Replaces the Ship-1 "Now" card and the StatusMarquee ticker (both removed).

---

## 9. Tech decisions & rationale

- **One animation library: Framer Motion.** Already in the codebase; powers reveals, magnetic buttons, page transitions (AnimatePresence), and the horizontal scroll-jack (`useScroll`/`useTransform`). **GSAP is not used** — it would add bundle weight against the Lighthouse ≥85 budget, and the reference interactions need only RAF + scroll-progress math.
- **Kinetic hero = vanilla RAF** (ported from the reference), not a library — zero bundle cost, exact feel.
- **Lenis** for smooth scroll (explicitly requested), integrated with Framer Motion.
- **Page transitions = Framer Motion + App Router template**, not the experimental View Transitions API (avoids Next experimental flags / cross-browser gaps).

---

## 10. Case study template — 7 sections (non-negotiable)

Every case study renders the same spine, in order:

1. **Hero** — project name, role, timeline, team size, one-line outcome (with a metric if available).
2. **The problem** — what was broken, who it affected, why it mattered; include a data point or user quote.
3. **Research** — methods used, sample size, 3–5 key insights (max), each with evidence (quote or stat + source).
4. **Constraints & decisions** — what was worked around, what was deliberately ignored and why.
5. **The solution** — walk through key screens/flows showing how each insight mapped to a design decision.
6. **Outcome / what I'd do next** — measurable result if available + what to improve.
7. **Next project link** — at the bottom.

**Missing-data convention (CRITICAL):** wherever a real number, quote, or fact is not available, render a visible **`TODO: needs data from Palash`** marker AND leave an HTML/MDX comment in source. **Never fabricate statistics, quotes, sample sizes, or outcomes.** This applies to the refactor of RoomieMatch, RIT Athletics, and RIT EATS especially.

**Rendering:** one set of MDX components (Hero, Problem, Research+Insight+Evidence, Constraints, Solution+ScreenWalkthrough, Outcome, NextProject) replacing the Ship-1 case-study components. Template enforces section order and the TODO marker styling.

---

## 11. Case study content

- **MyCourses** — already follows the spine in prose; port content into the new template; wire real images from `public/case-studies/mycourses/`.
- **RoomieMatch, RIT Athletics, RIT EATS** — author MDX into the 7-section spine. Use only facts present in existing material or provided by Palash; everything unknown gets a `TODO: needs data from Palash` marker. Wire images from the corresponding `public/case-studies/<slug>/` folders (curate from the 156 pulled assets; do not invent screens).

---

## 12. Easter egg — Konami thermal mode
Key sequence `↑ ↑ ↓ ↓ ← → ← → B A` toggles **thermal mode**: backgrounds shift to a heat-map gradient and the cursor leaves a brief warm trail. Nods to the thermal-wearable capstone. Toggle **persists for the session** (sessionStorage). Reduced-motion → gradient shift without the trail. Must be fully removable/ignorable (no impact when unused).

---

## 13. Kill list (remove from current build)
- All custom illustrations / the `components/character/` mascot system (broken, parked).
- The asterisk logo ("✱ Palash Nagar") everywhere.
- The "Selected work · 3 projects" eyebrow *style* (replaced by the horizontal-section + new mono eyebrows).
- Any italicized-accent-word-in-heading pattern **outside** the kinetic hero and project titles.
- The Ship-1 "Now" card widget and the `StatusMarquee` ticker (replaced by §8 strip).
- `IntroReveal` (PALASH letter reveal) and `PortraitsFilm` (superseded by the kinetic hero + text-first about).
- The old Warm Atelier tokens/fonts (Fraunces + Inter) and old `CustomCursor`/case-study components.
- `PlaceholderImage`'s broken-image behavior (rebuild around curated real images).

---

## 14. Performance, accessibility & degradation
- **Lighthouse mobile performance ≥ 85.** No heavy WebGL. Self-hosted fonts. Lazy-load below-the-fold images; `next/image` everywhere with correct `sizes`.
- **Mobile-first.** Every signature interaction degrades (kinetic hero → static; horizontal → vertical/snap; distortion/magnetic/cursor → off on touch).
- **`prefers-reduced-motion`** disables all non-essential motion (physics, scroll-jack translate, distortion animation, page-transition movement, thermal trail).
- **A11y:** keyboard reachable; visible focus states (since cursor effects vanish on touch/keyboard); kinetic hero heading exposes clean text via `aria-label`; color contrast checked against cream (orange `#E94E1B` on cream passes for large text/UI; verify body sizes).

---

## 15. Component & file structure (high level)
**New/added:**
- `app/globals.css` `@theme` — rewrite tokens (cream/ink/orange/muted/line) + fonts.
- `app/layout.tsx` — Instrument Serif + Bricolage Grotesque + Space Mono via `next/font`; mount grain, cursor, Lenis, page-transition template.
- `components/fx/Grain.tsx`, `Cursor.tsx`, `Magnetic.tsx`, `Distortion.tsx` (SVG filter + wrapper), `SmoothScroll.tsx` (Lenis), `PageTransition` (template.tsx), `ThermalMode.tsx` (easter egg).
- `components/home/KineticHero.tsx`, `IntroSlate.tsx`, `HorizontalWork.tsx`, `AboutTeaser.tsx`, `NowStrip.tsx`, `ContactCta.tsx`.
- `components/work/WorkGrid.tsx` (distortion grid).
- `components/case-study/*` — new 7-section template components.
- `data/now.ts`, `data/projects.ts` (panel/grid metadata + problem one-liners).
- `content/case-studies/{mycourses,roomiematch,rit-athletics,rit-eats}.mdx`.

**Removed:** `components/character/*`, `components/marquee/*`, `components/motion/IntroReveal.tsx`, `components/motion/PortraitsFilm.tsx`, old `components/cursor/CustomCursor.tsx`, old case-study components, old Now widget, Fraunces/Inter wiring, `PlaceholderImage` broken behavior.

**Kept/refactored:** MDX pipeline (`lib/mdx.ts`), contact API + form, `/resume` + PDF, `app/robots.ts` + `app/sitemap.ts`, image-pull script + assets, test infra.

---

## 16. Testing
- Unit (Vitest + RTL): cursor state machine, magnetic math, kinetic-hero physics helper (pure function), Konami detector, case-study template renders all 7 sections + TODO marker, contact API (keep existing).
- Manual/Lighthouse: mobile perf ≥ 85, reduced-motion + touch degradation, keyboard nav, page transitions.

---

## 17. Non-goals
- No mascot/character art. No WebGL hero. No GSAP. No draggable-canvas homepage (02 is reference only). No CMS. No new backend. No analytics work. No blog build-out beyond what exists. No invented case-study data.
