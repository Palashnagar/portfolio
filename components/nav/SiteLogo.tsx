"use client";

// The site logo — one morphing element (design-reference/intro-logo.html). The
// full "Palash Nagar" and the parked "PN" are the SAME DOM node: P and N are
// .accent letters, every other letter (and the space) is a .middle letter that
// collapses to zero width when parked. Phase comes from IntroProvider; the CSS
// module does the morph. Clicking during the intro skips it; the parked logo
// navigates home. Keyboard-focusable, with focus mirroring hover.

import { useRouter } from "next/navigation";
import styles from "./SiteLogo.module.css";
import { useIntro } from "./intro-context";

export function SiteLogo() {
  const router = useRouter();
  const { phase, roleVisible, ready, skip } = useIntro();

  const rootClass = [
    styles.logo,
    ready ? "" : styles.notReady, // suppress transitions until the state settles
    phase === "transitioning" ? styles.transitioning : "",
    phase === "parked" ? styles.parked : "",
  ]
    .filter(Boolean)
    .join(" ");

  function activate() {
    if (phase !== "parked") {
      skip(); // skip the intro straight to parked
      return;
    }
    router.push("/"); // parked → home
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  }

  const mid = `${styles.ltr} ${styles.middle}`;
  const acc = `${styles.ltr} ${styles.accent}`;

  return (
    <div
      className={rootClass}
      role="link"
      tabIndex={0}
      aria-label="Palash Nagar — home"
      data-cursor="link"
      onClick={activate}
      onKeyDown={onKeyDown}
    >
      {/* Letter-by-letter markup (not a .map): the space is an explicit
          non-breaking space .middle letter, and P / N need explicit .accent
          classes so the italic glyphs are never clipped. */}
      <span className={styles.logoName} aria-hidden="true">
        <span className={acc}>P</span>
        <span className={mid}>a</span>
        <span className={mid}>l</span>
        <span className={mid}>a</span>
        <span className={mid}>s</span>
        <span className={mid}>h</span>
        <span className={mid}>{" "}</span>
        <span className={acc}>N</span>
        <span className={mid}>a</span>
        <span className={mid}>g</span>
        <span className={mid}>a</span>
        <span className={mid}>r</span>
      </span>

      <div
        className={`${styles.logoRole} ${roleVisible ? styles.show : ""}`}
        aria-hidden="true"
      >
        Product<span className={styles.dot} />UX Designer
      </div>
    </div>
  );
}
