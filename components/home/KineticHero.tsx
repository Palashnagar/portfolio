"use client";

import { useEffect, useRef } from "react";
import { letterTransform } from "@/lib/kinetic";
import AmbientScene from "@/components/home/AmbientScene";
import { useIntro } from "@/components/nav/intro-context";

// ─── Data ────────────────────────────────────────────────────────────────────

interface LineData {
  text: string;
  accentWord?: string; // word whose letters get italic-orange treatment
}

const LINES: LineData[] = [
  { text: "DESIGN" },
  { text: "THAT FEELS", accentWord: "FEELS" },
  { text: "INEVITABLE." },
];

const RADIUS = 240;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Split a line into per-character entries, marking which indices are accent. */
function buildLetters(line: LineData): Array<{ char: string; accent: boolean }> {
  const chars = line.text.split("");
  const accentStart = line.accentWord
    ? line.text.indexOf(line.accentWord)
    : -1;
  const accentEnd =
    accentStart >= 0 ? accentStart + (line.accentWord?.length ?? 0) : -1;

  return chars.map((ch, i) => ({
    char: ch === " " ? " " : ch,
    accent: accentStart >= 0 && i >= accentStart && i < accentEnd,
  }));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function KineticHero() {
  // During the homepage intro the hero (text + ambient scene) stays hidden, then
  // fades in once the sequence reveals the page, coordinated via IntroProvider.
  const { playIntro, revealed, ready } = useIntro();

  // Refs for all letter spans and their resting centers
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const restingCenters = useRef<Array<{ el: HTMLSpanElement; cx: number; cy: number; accent: boolean }>>([]);
  const mouseX = useRef(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0,
  );
  const mouseY = useRef(
    typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  );
  const rafId = useRef<number | null>(null);

  // Build flat letter data for ref assignment
  const linesData = LINES.map(buildLetters);
  // Flat array of {accent} in order, used to pair with DOM refs
  const flatAccent: boolean[] = linesData.flatMap((line) => line.map((l) => l.accent));

  useEffect(() => {
    const interactive =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!interactive) return;

    // ── Measure resting centers ────────────────────────────────────────────
    function measure() {
      // Reset transforms so getBoundingClientRect reflects resting positions
      letterRefs.current.forEach((el) => {
        if (el) el.style.transform = "";
      });

      restingCenters.current = letterRefs.current
        .map((el, i) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            el,
            cx: r.left + r.width / 2,
            cy: r.top + r.height / 2,
            accent: flatAccent[i] ?? false,
          };
        })
        .filter(Boolean) as typeof restingCenters.current;
    }

    measure();
    window.addEventListener("resize", measure);

    // ── Pointer tracking ──────────────────────────────────────────────────
    function onPointerMove(e: PointerEvent) {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    }
    window.addEventListener("pointermove", onPointerMove);

    // ── RAF loop ─────────────────────────────────────────────────────────
    function animate() {
      const mx = mouseX.current;
      const my = mouseY.current;

      restingCenters.current.forEach(({ el, cx, cy }) => {
        const t = letterTransform({ x: cx, y: cy }, { x: mx, y: my }, RADIUS);

        if (
          t.tx === 0 &&
          t.ty === 0 &&
          t.scale === 1 &&
          t.rot === 0
        ) {
          el.style.transform = "";
        } else {
          el.style.transform = `translate(${t.tx}px, ${t.ty}px) scale(${t.scale}) rotate(${t.rot}deg)`;
        }
      });

      rafId.current = requestAnimationFrame(animate);
    }

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────

  let globalIndex = 0;

  return (
    <section
      className="reveal-gated min-h-screen flex flex-col justify-center"
      style={{
        padding: "0 6vw",
        position: "relative",
        isolation: "isolate",
        opacity: playIntro && !revealed ? 0 : 1,
        transition: ready ? "opacity 0.8s ease 1.4s" : "none",
      }}
    >
      {/* Ambient mountain scene, behind the hero, scrolls away with it. */}
      <AmbientScene />

      {/* Headline */}
      <h1
        aria-label="Design that feels inevitable."
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "clamp(44px, 13vw, 200px)",
          lineHeight: 0.92,
          letterSpacing: "-0.03em",
          userSelect: "none",
        }}
      >
        {linesData.map((letters, lineIdx) => (
          <span
            key={lineIdx}
            aria-hidden
            style={{ display: "block", whiteSpace: "nowrap" }}
          >
            {letters.map(({ char, accent }) => {
              const idx = globalIndex++;
              return (
                <span
                  key={idx}
                  aria-hidden
                  ref={(el) => {
                    if (el) letterRefs.current[idx] = el;
                  }}
                  style={{
                    display: "inline-block",
                    transition: "color 0.2s ease",
                    willChange: "transform",
                    ...(accent
                      ? { fontStyle: "italic", color: "var(--accent)" }
                      : {}),
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </h1>

      {/* Sub */}
      <p
        style={{
          marginTop: "40px",
          maxWidth: "520px",
          fontSize: "17px",
          lineHeight: 1.5,
          color: "var(--ink)",
        }}
      >
        I&apos;m a UX designer who loves the overlap between research and
        intuition. These days that also means vibe coding in Framer and
        co-designing with AI like Claude Code and Codex, without losing{" "}
        <em
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "1.1em",
          }}
        >
          the human part.
        </em>
      </p>
    </section>
  );
}
