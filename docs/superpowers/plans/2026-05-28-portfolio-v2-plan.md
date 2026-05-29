# Portfolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio on the v2 design system with two signature interactions (kinetic hero + horizontal scroll-jacked work), a unified cursor, grain, page transitions, a 7-section case-study spine, and a Konami thermal easter egg — replacing the Ship-1 "Warm Atelier" build.

**Architecture:** Foundation primitives first (tokens, fonts, grain, cursor, Lenis, magnetic, distortion, page transitions) added alongside the old build so it keeps compiling; then pages rebuilt one at a time onto the new system; then old components deleted once orphaned; then case studies; then easter egg + QA.

**Tech Stack:** Next.js 16 (App Router) · TS strict · Tailwind v4 inline `@theme` · Framer Motion · Lenis · vanilla RAF (hero) · MDX (next-mdx-remote/rsc) · Vitest + RTL · Resend · Vercel.

**Spec:** `docs/superpowers/specs/2026-05-28-portfolio-v2-design.md`
**Visual source of truth (committed):** `/design-reference/{01-kinetic-hero,02-draggable-canvas,03-horizontal-scroll,04-hover-distortion}.html` — exact colors, motion constants, and filter params live here. Tasks reference them instead of duplicating CSS.

**Branch:** `v2-redesign` (already created). Each task ends in a commit. After all tasks: superpowers:finishing-a-development-branch.

**Global rules for every implementer:**
- Read the spec section named in the task + the referenced `/design-reference` file before coding.
- Keep the build green (`npm run build`) and tests green (`npm test`) after each task.
- All motion respects `prefers-reduced-motion`; all cursor/hover/magnetic effects are disabled on touch (pointer:coarse). Provide visible focus states.
- **Never fabricate case-study data.** Missing facts render a `TODO: needs data from Palash` marker + an MDX comment.
- Pure logic (physics, magnetic, cursor state, Konami) lives in tested helper functions because jsdom has no layout.

---

## Phase 0 — Foundation

### Task 1: Design tokens + fonts

**Files:**
- Modify: `app/globals.css` (`@theme` block + `:root` mirror + reduced-motion reset)
- Modify: `app/layout.tsx` (fonts via `next/font/google`, metadata)
- Modify: `lib/tokens.ts` (typed exports)

- [ ] **Step 1: Rewrite the `@theme` tokens** in `app/globals.css`. Replace the Warm Atelier palette/fonts with:

```css
@import "tailwindcss";

@theme {
  --color-bg: #F5F1EA;
  --color-ink: #0A0A0A;
  --color-accent: #E94E1B;
  --color-muted: #8A867F;
  --color-line: rgba(10, 10, 10, 0.14);

  --font-display: var(--font-instrument), serif;
  --font-body: var(--font-bricolage), sans-serif;

  --container-content: 75rem;
  --container-reading: 42rem;

  --ease-out-soft: cubic-bezier(0.2, 0.8, 0.2, 1);
}

:root {
  --bg: #F5F1EA; --ink: #0A0A0A; --accent: #E94E1B; --muted: #8A867F; --line: rgba(10,10,10,0.14);
}

html { scroll-behavior: smooth; background: var(--bg); }
body { background: var(--bg); color: var(--ink); font-family: var(--font-body); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

- [ ] **Step 2: Wire fonts** in `app/layout.tsx`:

```tsx
import { Instrument_Serif, Bricolage_Grotesque } from "next/font/google";

const instrument = Instrument_Serif({ weight: ["400"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const bricolage = Bricolage_Grotesque({ weight: ["300","400","500","700"], subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
```
Apply `className={`${instrument.variable} ${bricolage.variable}`}` on `<html>`. Update `metadata` title/description to the researcher-meets-designer voice. Remove all Fraunces/Inter imports.

- [ ] **Step 3: Update `lib/tokens.ts`** to export the new `colors` (bg/ink/accent/muted/line) and keep `motion` easings (`easeOutSoft = [0.2,0.8,0.2,1] as const`).

- [ ] **Step 4: Build + verify.** Run `npm run build`. Expected: compiles (old pages may look wrong — fine, they're replaced soon). Run `npm test` — existing tests still green (update any token-name assertions).

- [ ] **Step 5: Commit** `git commit -m "feat(v2): cream/ink/orange tokens + Instrument Serif & Bricolage fonts"`

---

### Task 2: Grain overlay

**Files:** Create `components/fx/Grain.tsx`; Test `tests/grain.test.tsx`

- [ ] **Step 1: Write failing test** — Grain renders a fixed, pointer-events:none, aria-hidden element.

```tsx
import { render } from "@testing-library/react";
import { Grain } from "@/components/fx/Grain";
test("grain is decorative and non-interactive", () => {
  const { container } = render(<Grain />);
  const el = container.firstChild as HTMLElement;
  expect(el).toHaveAttribute("aria-hidden", "true");
  expect(el.className).toMatch(/pointer-events-none/);
});
```
Run: `npm test grain` → FAIL (module missing).

- [ ] **Step 2: Implement** `components/fx/Grain.tsx` as a `"use client"`-free server component. Use the exact SVG data-URI from any `/design-reference` file's `.grain` rule (baseFrequency 0.9, numOctaves 3, rect opacity 0.65). Element: `fixed inset-0 pointer-events-none z-[100]` with inline `style={{ opacity: 0.18, mixBlendMode: "multiply", backgroundImage: "url(...)" }}` and `aria-hidden="true"`. Under reduced-motion the grain is static anyway (no animation) so no special-casing needed.

- [ ] **Step 3: Test passes.** `npm test grain` → PASS.

- [ ] **Step 4: Commit** `git commit -m "feat(v2): site-wide SVG grain overlay"`

---

### Task 3: Unified custom cursor

**Files:** Create `lib/cursor.ts` (pure state), `components/fx/Cursor.tsx`; Test `tests/cursor.test.ts`

- [ ] **Step 1: Failing test for pure state machine** `lib/cursor.ts`:

```ts
import { nextCursor, type CursorState } from "@/lib/cursor";
test("default → link grows; → card shows View; reset returns to default", () => {
  expect(nextCursor("default", { kind: "link" }).size).toBeGreaterThan(nextCursor("default", null as any).size);
  const card = nextCursor("default", { kind: "card" });
  expect(card.label).toBe("View →");
  expect(nextCursor(card.name, { kind: "reset" }).name).toBe("default");
});
```

- [ ] **Step 2: Implement** `lib/cursor.ts`: a pure function mapping a trigger (`link | card | drag | reset`) to `{ name, size, label }` — default `{name:"default", size:10, label:""}`, link `{size:50}`, card `{size:60, label:"View →"}`, drag `{label:"Drag"}`. No DOM.

- [ ] **Step 3: Test passes.**

- [ ] **Step 4: Implement** `components/fx/Cursor.tsx` (`"use client"`): a fixed dot, `mix-blend-mode:difference`, lerp follow `0.22` in a RAF loop (port from `04-hover-distortion.html`). Uses `nextCursor`. Binds `pointermove` and delegated `mouseenter`/`mouseleave` on `[data-cursor]` elements (read `data-cursor="link|card|drag"` to pick state). **Disable entirely when `matchMedia("(pointer: coarse)")` or no fine pointer** — render `null` and restore native cursor. Hide native cursor via a `body.cursor-active { cursor: none }` class only added when enabled.

- [ ] **Step 5: Mount** in `app/layout.tsx` (below `<Grain/>`). Build green.

- [ ] **Step 6: Commit** `git commit -m "feat(v2): unified context-aware custom cursor (touch-safe)"`

---

### Task 4: Smooth scroll (Lenis)

**Files:** Add dep `lenis`; Create `components/fx/SmoothScroll.tsx`

- [ ] **Step 1: Install** `npm i lenis`.
- [ ] **Step 2: Implement** `components/fx/SmoothScroll.tsx` (`"use client"`): instantiate Lenis on mount, RAF loop, `destroy()` on unmount. **Skip (no smoothing) when `prefers-reduced-motion`.** Wrap `children` (pass-through). Expose nothing else.
- [ ] **Step 3: Mount** as a provider around `{children}` in `app/layout.tsx`.
- [ ] **Step 4: Verify** scroll works, anchor links still jump. Build green.
- [ ] **Step 5: Commit** `git commit -m "feat(v2): Lenis smooth scroll (reduced-motion aware)"`

---

### Task 5: Magnetic primitive

**Files:** Create `lib/magnetic.ts` (pure), `components/fx/Magnetic.tsx`; Test `tests/magnetic.test.ts`

- [ ] **Step 1: Failing test** for `magneticOffset(pointer, rect, radius, strength)`:

```ts
import { magneticOffset } from "@/lib/magnetic";
test("returns 0 outside radius, pulls toward pointer inside", () => {
  const rect = { left: 0, top: 0, width: 100, height: 40 } as DOMRect;
  expect(magneticOffset({ x: 999, y: 999 }, rect, 80, 0.4)).toEqual({ x: 0, y: 0 });
  const o = magneticOffset({ x: 60, y: 20 }, rect, 80, 0.4);
  expect(o.x).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Implement** `lib/magnetic.ts`: compute center from rect, distance to pointer; if `> radius` return `{x:0,y:0}`; else return `{ x: (pointer.x-cx)*strength, y: (pointer.y-cy)*strength }`.
- [ ] **Step 3: Test passes.**
- [ ] **Step 4: Implement** `components/fx/Magnetic.tsx` (`"use client"`): wraps a child (CTA), tracks `pointermove`, applies `transform` via Framer Motion spring using `magneticOffset` (radius 80, strength ~0.35). Disabled on touch + reduced-motion (renders child unchanged). `data-cursor="link"`.
- [ ] **Step 5: Commit** `git commit -m "feat(v2): magnetic button primitive"`

---

### Task 6: Hover distortion

**Files:** Create `components/fx/Distortion.tsx` (filter defs + wrapper)

- [ ] **Step 1: Implement** `components/fx/Distortion.tsx` exporting (a) `<DistortionDefs/>` — the inline `<svg>` `filter#distort` copied verbatim from `04-hover-distortion.html` (feTurbulence 0.015 0.03 animating to 0.04 0.06 over 3s + feDisplacementMap scale 40), mounted once globally; (b) `<DistortThumb>` — a wrapper applying `filter:url(#distort)` + `scale(1.04)` on hover via class, with `transition: filter 0.4s, transform 0.6s var(--ease-out-soft)`. **No hover effect on touch/reduced-motion** (guard the hover class). Children = `next/image` or inline SVG.
- [ ] **Step 2: Mount** `<DistortionDefs/>` in `app/layout.tsx`.
- [ ] **Step 3: Build green. Commit** `git commit -m "feat(v2): SVG hover-distortion filter + thumbnail wrapper"`

---

### Task 7: Page transitions

**Files:** Create `app/template.tsx`; Create `components/fx/PageTransition.tsx`

- [ ] **Step 1: Implement** `components/fx/PageTransition.tsx` (`"use client"`): a Framer Motion wrapper using a cream curtain + content `initial={{opacity:0, y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}` with `~0.5s` total via `var(--ease-out-soft)`. Curtain = full-screen `--bg` panel that covers then lifts. Under `prefers-reduced-motion`, render children with no animation.
- [ ] **Step 2: Use** it in `app/template.tsx` wrapping `{children}` (App Router remounts `template.tsx` per navigation → triggers the transition).
- [ ] **Step 3: Verify** navigating between `/` and `/work/mycourses` shows the fade-to-cream + upward reveal. Build green.
- [ ] **Step 4: Commit** `git commit -m "feat(v2): real page transitions via App Router template + Framer Motion"`

---

### Task 8: Chrome — corner nav, header, footer

**Files:** Create `components/nav/CornerNav.tsx`, `components/nav/Header.tsx`, modify `components/footer/Footer.tsx`; rewrite `app/(site)/layout.tsx`

- [ ] **Step 1: CornerNav** (`components/nav/CornerNav.tsx`) — the home-only TL/TR/BL/BR corner layout from `01-kinetic-hero.html` (identity + pulsing dot, Work/About/Resume, location/availability, "Get in touch →"). Real links. `data-cursor="link"`.
- [ ] **Step 2: Header** (`components/nav/Header.tsx`) — the fixed top header from `03/04` for inner pages (identity left, Work/About/Resume/Contact right). No asterisk anywhere.
- [ ] **Step 3: Footer** — restyle to v2 (cream/ink, Bricolage uppercase meta, keep external links with `rel="noopener"` + skip-link target `#main-content`).
- [ ] **Step 4: Rewrite** `app/(site)/layout.tsx` to mount `<Header/>` (inner pages) + `<Footer/>` and `<main id="main-content">`. (Home overrides with `<CornerNav/>`.) Remove old `Nav`, `StatusMarquee`, old `CustomCursor` imports.
- [ ] **Step 5: Build green. Commit** `git commit -m "feat(v2): corner nav, header, footer chrome"`

---

## Phase 1 — Homepage signature interactions

### Task 9: Kinetic hero

**Files:** Create `lib/kinetic.ts` (pure), `components/home/KineticHero.tsx`; Test `tests/kinetic.test.ts`

- [ ] **Step 1: Failing test** for `letterTransform(letterCenter, pointer, radius)`:

```ts
import { letterTransform } from "@/lib/kinetic";
test("no transform beyond radius; pulls + scales within", () => {
  expect(letterTransform({x:0,y:0},{x:500,y:500},240)).toEqual({ tx:0, ty:0, scale:1, rot:0, italic:false });
  const t = letterTransform({x:0,y:0},{x:30,y:0},240); // close on x
  expect(t.scale).toBeGreaterThan(1);
  expect(t.tx).toBeLessThan(0); // letter pulled toward +x pointer => negative dx*f*0.18? matches reference sign
  expect(t.italic).toBe(true);
});
```

- [ ] **Step 2: Implement** `lib/kinetic.ts` `letterTransform`: replicate the reference math exactly — `dx=pointer.x-cx, dy=pointer.y-cy, dist=hypot, f=1-dist/radius` when `dist<radius` else all-neutral; `tx=-dx*f*0.18, ty=-dy*f*0.18, scale=1+f*0.22, rot=(dx/radius)*f*-8, italic=f>0.5`.
- [ ] **Step 3: Test passes.**
- [ ] **Step 4: Implement** `components/home/KineticHero.tsx` (`"use client"`): renders `<h1 aria-label="Design that feels inevitable.">` with three `.line` spans; split into per-letter `<span aria-hidden>`; mark "THAT" letters italic-accent (orange). RAF loop reads pointer (lerp 0.18 cursor) and applies `letterTransform` per letter (measure rects per-frame for scroll-safety; copy structure from `01-kinetic-hero.html`). Eyebrow "Portfolio · 2026" + sub-copy with italic "thermal illusions". **Touch / reduced-motion → static headline** (no RAF, no transforms; THAT still italic-orange).
- [ ] **Step 5: Build green.** (Hero used by home in Task 14.) **Commit** `git commit -m "feat(v2): kinetic hero (tested physics, a11y label, degrades static)"`

---

### Task 10: Intro slate

**Files:** Create `components/home/IntroSlate.tsx`

- [ ] **Step 1: Implement** a full-viewport calm slate between hero and horizontal section: Instrument Serif "Selected work · 04 projects" (per spec §5) + "Scroll to begin ↓" bounce hint (`03` styling). Give it a beat (100vh). Reduced-motion → no bounce.
- [ ] **Step 2: Build green. Commit** `git commit -m "feat(v2): intro slate buffer before horizontal section"`

---

### Task 11: Horizontal scroll-jacked work + project data

**Files:** Create `data/projects.ts`, `components/home/HorizontalWork.tsx`

- [ ] **Step 1: `data/projects.ts`** — array of 4 projects (slug, num `01`–`04`, title, accent word, meta `[year, context, "CASE STUDY"]`, one-line problem with italic phrase marker, thumb image path under `/case-studies/<slug>/`). Copy the four problem one-liners from `03-horizontal-scroll.html`.
- [ ] **Step 2: Implement** `components/home/HorizontalWork.tsx` (`"use client"`): a `~500vh` wrapper; `position:sticky` 100vh viewport; horizontal track translated by Framer Motion `useScroll({target, offset})` → `useTransform(progress, [0,1], ["0vw", "-300vw"])`. Four panels (panel anatomy from `03`): `0N/04`, 4:5 `<DistortThumb>` thumbnail (real image), meta row, serif title w/ accent, problem line, "Read the case study →" link (`data-cursor="card"`). Fixed 280px progress rail + accent fill + mono label bound to progress.
- [ ] **Step 3: Degradation** — touch → CSS scroll-snap horizontal carousel (no jack); `prefers-reduced-motion` → vertical stack of the 4 panels. Detect via `useReducedMotion` + pointer media query; render the alternate layout.
- [ ] **Step 4: Build green. Commit** `git commit -m "feat(v2): horizontal scroll-jacked work section + project data"`

---

## Phase 2 — Homepage remainder + work index

### Task 12: About teaser, Now strip, Contact CTA

**Files:** Create `data/now.ts`, `components/home/AboutTeaser.tsx`, `components/home/NowStrip.tsx`, `components/home/ContactCta.tsx`

- [ ] **Step 1: `data/now.ts`** — `{ building, reading, available }` strings (researcher voice). Mark any unknown with a `TODO` note in comment (not fabricated).
- [ ] **Step 2: AboutTeaser** — short researcher-meets-designer paragraph + portrait image (`next/image`, real file or a clean typographic block if none) + "More about me →" link.
- [ ] **Step 3: NowStrip** — thin 3-column strip (Building / Reading / Available), Bricolage uppercase small-caps, hairline separators, **no card backgrounds** (spec §8).
- [ ] **Step 4: ContactCta** — "Got something *worth building?*" (serif, italic-orange accent) + `<Magnetic>` "Get in touch →" CTA.
- [ ] **Step 5: Build green. Commit** `git commit -m "feat(v2): about teaser, Now strip, contact CTA"`

---

### Task 13: Rebuild homepage

**Files:** Rewrite `app/(site)/page.tsx`

- [ ] **Step 1: Compose** `KineticHero → IntroSlate → HorizontalWork → AboutTeaser → NowStrip → ContactCta`. Mount `<CornerNav/>` for home. Remove ALL Ship-1 home content (italic "inevitable." hero, "Selected work · 3 projects" eyebrow, old Now, pointing mascot).
- [ ] **Step 2: Verify** home scroll flow on desktop + mobile (responsive). Build green; `npm test` green.
- [ ] **Step 3: Commit** `git commit -m "feat(v2): rebuild homepage on v2 system"`

---

### Task 14: Work index grid

**Files:** Create `components/work/WorkGrid.tsx`; Rewrite `app/(site)/work/page.tsx`

- [ ] **Step 1: WorkGrid** — 2-col grid (anatomy from `04-hover-distortion.html`): each card = `<DistortThumb>` (real image), meta row (`year · CASE STUDY` + `0N/04`), serif title w/ accent, one-line desc. `data-cursor="card"`. Single col on mobile.
- [ ] **Step 2: Rewrite** `/work` page: mono eyebrow "Selected work · 04 projects" + serif page title ("Things I've *built.*") + `<WorkGrid/>` driven by `data/projects.ts`.
- [ ] **Step 3: Build green. Commit** `git commit -m "feat(v2): /work distortion grid"`

---

## Phase 3 — Case studies

### Task 15: Case-study template components

**Files:** Create `components/case-study/{Hero,Problem,Research,Insight,Evidence,Constraints,Solution,Screen,Outcome,NextProject,Todo}.tsx`; Test `tests/case-study.test.tsx`

- [ ] **Step 1: Failing test** — a sample case-study composed of the 7 sections renders all section landmarks in order and the `Todo` marker is visible + labelled.

```tsx
import { render, screen } from "@testing-library/react";
import { Todo } from "@/components/case-study/Todo";
test("Todo marker is visible and labelled", () => {
  render(<Todo>sample size</Todo>);
  expect(screen.getByText(/needs data from Palash/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Implement** each section component on the v2 system (matching the Research wireframe shown + approved): `Hero` (name/role/timeline/team/outcome), `Problem` (with `Evidence` slot), `Research` (methods + sample-size chips, wraps 3–5 `Insight`, each `Insight` pairs statement + `Evidence`), `Constraints`, `Solution` (wraps `Screen` walkthrough items mapping insight→decision), `Outcome`, `NextProject` (link to next slug). `Todo` renders `TODO: needs data from Palash — {children}` in orange, role="note".
- [ ] **Step 3: Tests pass.**
- [ ] **Step 4: Commit** `git commit -m "feat(v2): 7-section case-study template components + Todo marker"`

---

### Task 16: Case-study route + MDX mapping

**Files:** Rewrite `app/(site)/work/[slug]/page.tsx`; Modify `lib/mdx.ts` if needed

- [ ] **Step 1: Map** the new components into MDXRemote `components={{...}}`. Keep `options={{ blockJS: false }}` (required for JSX attr expressions). `generateStaticParams` from `listCaseStudySlugs()`; `generateMetadata` per study.
- [ ] **Step 2: Page transition** applies automatically (Task 7). `data-cursor` on the next-project link.
- [ ] **Step 3: Build green. Commit** `git commit -m "feat(v2): case-study route on new template"`

---

### Task 17: MyCourses content (port)

**Files:** Rewrite `content/case-studies/mycourses.mdx`; ensure images under `public/case-studies/mycourses/`

- [ ] **Step 1: Re-author** MyCourses into the 7-section spine using the existing prose (it already follows the pattern). Wire 4–8 curated real screenshots from `public/case-studies/mycourses/` (pick the clearest from the 36 pulled; rename to semantic names if helpful). Use the panel copy already in `03` as the hero/problem seed. Any missing metric → `Todo`.
- [ ] **Step 2: Verify** `/work/mycourses` renders all 7 sections + images. Build green.
- [ ] **Step 3: Commit** `git commit -m "content(v2): MyCourses on 7-section spine"`

---

### Task 18: RoomieMatch content (refactor)

**Files:** Create `content/case-studies/roomiematch.mdx`; curate `public/case-studies/roomiematch/`

- [ ] **Step 1: Author** the 7-section spine. Use only known facts (problem framing from `03`: "Random roommate assignment caused 41% of complaints in Year 1" — **verify this is real; if not, wrap in `Todo`**). Every unknown (sample sizes, research methods, outcomes) → `Todo: needs data from Palash` + MDX comment `<!-- TODO -->`. Curate real screens from the 48 pulled images; do not invent screens.
- [ ] **Step 2: Verify render. Commit** `git commit -m "content(v2): RoomieMatch refactored to 7-section spine (data TODOs flagged)"`

---

### Task 19: RIT Athletics content (refactor)

**Files:** Create `content/case-studies/rit-athletics.mdx`; curate `public/case-studies/rit-athletics/`

- [ ] **Step 1: Author** 7-section spine; same TODO discipline; curate from 41 pulled images.
- [ ] **Step 2: Verify render. Commit** `git commit -m "content(v2): RIT Athletics refactored (data TODOs flagged)"`

---

### Task 20: RIT EATS content (refactor)

**Files:** Create `content/case-studies/rit-eats.mdx`; curate `public/case-studies/rit-eats/`

- [ ] **Step 1: Author** 7-section spine; same TODO discipline; curate from 31 pulled images.
- [ ] **Step 2: Verify render. Commit** `git commit -m "content(v2): RIT EATS refactored (data TODOs flagged)"`

---

## Phase 4 — Remaining pages

### Task 21: About page

**Files:** Rewrite `app/(site)/about/page.tsx`; reuse/trim `data/experience.ts`, `data/beliefs.ts`, `data/tools.ts`

- [ ] **Step 1: Rebuild** text-first: intro (researcher-meets-designer), "What I research" (thermal illusions → wearables), "How I work", background/experience, beliefs. **No mascot, no PortraitsFilm.** v2 type system. Real portrait image or clean typographic treatment.
- [ ] **Step 2: Build green. Commit** `git commit -m "feat(v2): about page (text-first, researcher voice)"`

---

### Task 22: Resume + Contact restyle

**Files:** Modify `app/(site)/resume/page.tsx`, `app/(site)/contact/page.tsx`, `components/.../ContactForm.tsx`

- [ ] **Step 1: Resume** — restyle to v2; keep print styles + PDF link.
- [ ] **Step 2: Contact** — restyle form to v2; keep API + Resend; success state = typographic confirmation (**no celebrating mascot**); CTA uses `<Magnetic>`.
- [ ] **Step 3: `npm test` (contact API tests) green. Build green. Commit** `git commit -m "feat(v2): resume + contact restyle (mascot removed)"`

---

## Phase 5 — Easter egg, cleanup, QA

### Task 23: Konami thermal mode

**Files:** Create `lib/konami.ts` (pure), `components/fx/ThermalMode.tsx`; Test `tests/konami.test.ts`

- [ ] **Step 1: Failing test** for `konamiStep(buffer, key)` → returns updated buffer + `matched: boolean`:

```ts
import { konamiStep, KONAMI } from "@/lib/konami";
test("full sequence matches", () => {
  let buf: string[] = []; let matched = false;
  for (const k of KONAMI) ({ buffer: buf, matched } = konamiStep(buf, k));
  expect(matched).toBe(true);
});
test("wrong key resets progress", () => {
  const { matched } = konamiStep(["ArrowUp"], "x");
  expect(matched).toBe(false);
});
```

- [ ] **Step 2: Implement** `lib/konami.ts`: `KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]`; `konamiStep` keeps a rolling buffer (max length = sequence) and reports match.
- [ ] **Step 3: Tests pass.**
- [ ] **Step 4: Implement** `components/fx/ThermalMode.tsx` (`"use client"`): keydown listener → `konamiStep`; on match toggle `body.thermal` (heat-map gradient backgrounds + warm cursor trail). Persist in `sessionStorage`. Reduced-motion → gradient only, no trail. Mount in `app/layout.tsx`.
- [ ] **Step 5: Build green. Commit** `git commit -m "feat(v2): Konami thermal-mode easter egg (tested detector)"`

---

### Task 24: Remove orphaned Ship-1 code

**Files:** Delete `components/character/*`, `components/marquee/*`, `components/motion/IntroReveal.tsx`, `components/motion/PortraitsFilm.tsx`, old `components/cursor/CustomCursor.tsx`, old case-study components, old Now widget, dead `data/*` (status, portraits), `components/ui/PlaceholderImage.tsx` (broken behavior) and any unused `MagneticButton` superseded by `Magnetic`.

- [ ] **Step 1: Grep** for imports of each before deleting (`grep -rn "PalashCharacter\|StatusMarquee\|IntroReveal\|PortraitsFilm\|PlaceholderImage" app components`). Remove any lingering references.
- [ ] **Step 2: Delete** orphaned files + their tests (`tests/character.test.tsx`).
- [ ] **Step 3: Build green. `npm test` green** (only v2 tests remain). **Commit** `git commit -m "chore(v2): remove orphaned Ship-1 components and dead data"`

---

### Task 25: A11y + performance pass

**Files:** various, as needed

- [ ] **Step 1: Reduced-motion + touch audit** — verify kinetic hero (static), horizontal section (vertical stack / native swipe), cursor (off on touch), distortion/magnetic (off), page transition (instant), thermal trail (off). Add visible focus rings everywhere cursor effects would normally cue.
- [ ] **Step 2: Contrast** — verify `--muted` and accent on cream meet AA for their sizes; bump where needed.
- [ ] **Step 3: Lighthouse mobile** (`npx lighthouse` or Chrome) — performance ≥ 85. Lazy-load below-fold images; correct `next/image sizes`; ensure fonts `display:swap`. Trim any heavy client JS.
- [ ] **Step 4: `npm test` + `npm run build` green. Commit** `git commit -m "fix(v2): a11y, reduced-motion/touch degradation, mobile perf ≥85"`

---

### Task 26: Finish branch

- [ ] **Step 1:** Use superpowers:finishing-a-development-branch (review diff, merge `v2-redesign` → `main` or open PR per user preference, deploy to Vercel, confirm all routes 200).

---

## Self-review notes
- **Spec coverage:** tokens/fonts (T1), grain (T2), cursor (T3), Lenis (T4), magnetic (T5), distortion (T6), transitions (T7), chrome/kill-asterisk (T8), kinetic hero (T9), intro slate (T10), horizontal work (T11), home sections + Now strip (T12–13), /work grid (T14), 7-section template + TODO convention (T15–16), all 4 case studies (T17–20), about/resume/contact + mascot removal (T21–22), Konami (T23), kill-list cleanup (T24), a11y/perf (T25). All spec sections map to a task.
- **No invented data:** enforced by the `Todo` component (T15) + per-content-task discipline (T17–20).
- **Build stays green:** primitives added before old code removed; orphans deleted only in T24 after pages migrated.
- **Type consistency:** `letterTransform`, `magneticOffset`, `nextCursor`, `konamiStep` are the canonical pure helpers; components consume them by those exact names.
