"use client";

// Filterable editorial grid for /explorations (port of
// design-reference/explorations-final.html). "All" shows the editorial mixed
// grid; picking a category adds `.uniform` to morph to a tidy 3-col grid — the
// DOM is never rebuilt, only classes toggle, so CSS transitions the morph.
// Chips are real buttons (aria-pressed); cards are links.

import { useState } from "react";
import styles from "./ExplorationsGrid.module.css";
import { explorations, type ExplorationType } from "@/data/explorations";

type Filter = "all" | ExplorationType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "mockup", label: "Mockups" },
  { key: "animation", label: "Animations" },
  { key: "research", label: "Research" },
  { key: "sketch", label: "Sketches" },
  { key: "exploration", label: "Explorations" },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function ExplorationsGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  // Per-category counts for the chips, derived from the data.
  const counts: Record<Filter, number> = {
    all: explorations.length,
    mockup: 0,
    animation: 0,
    research: 0,
    sketch: 0,
    exploration: 0,
  };
  explorations.forEach((e) => {
    counts[e.type] += 1;
  });

  // Only surface chips for categories that actually have items (plus "All").
  const visibleFilters = FILTERS.filter((f) => f.key === "all" || counts[f.key] > 0);

  const visible = filter === "all" ? explorations.length : counts[filter];
  const gridClass = [
    styles.grid,
    filter !== "all" ? styles.uniform : "",
    visible === 0 ? styles.empty : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={styles.filterRow}>
        <div className={styles.filterBar}>
          <span className={styles.label}>Filter</span>
          {visibleFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              data-filter={f.key}
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`${styles.chip} ${filter === f.key ? styles.active : ""}`}
            >
              <span className={styles.chipDot} aria-hidden="true" />
              {f.label} <span className={styles.count}>({counts[f.key]})</span>
            </button>
          ))}
        </div>
        <div className={styles.resultsCount}>
          Showing <strong>{visible}</strong> · sorted by recent
        </div>
      </div>

      <div className={gridClass}>
        {explorations.map((e) => {
          const hidden = filter !== "all" && e.type !== filter;
          const external = /^https?:\/\//.test(e.href);
          return (
            <a
              key={e.id}
              href={e.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              data-cursor="card"
              data-type={e.type}
              data-feature={e.feature ? "true" : undefined}
              className={`${styles.card} ${hidden ? styles.hidden : ""}`}
            >
              <div className={styles.thumb}>
                <span className={styles.badge} data-type={e.type}>
                  <span className={styles.badgeDot} aria-hidden="true" />
                  {e.badge ?? cap(e.type)}
                </span>
                {e.meta && <span className={styles.playBadge}>{e.meta}</span>}
                {e.thumbnail ? (
                  <span className={styles.art}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.thumbnail} alt="" loading="lazy" />
                  </span>
                ) : (
                  <span className={styles.art} dangerouslySetInnerHTML={{ __html: e.art }} />
                )}
              </div>
              <div className={styles.meta}>
                <span className={styles.type}>{cap(e.type)}</span>
                <span>{e.date}</span>
              </div>
              <div className={styles.title} dangerouslySetInnerHTML={{ __html: e.title }} />
              <div className={styles.desc}>{e.description}</div>
            </a>
          );
        })}
        <div className={styles.emptyState}>Nothing here yet — check back soon.</div>
      </div>
    </>
  );
}
