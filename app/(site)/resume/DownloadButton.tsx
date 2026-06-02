"use client";

// Screen-only "Download PDF" control. Triggers the browser's print dialog, which
// (via the print stylesheet in resume.module.css) renders just the résumé sheet
// to a single A4 page. Hidden in print. Carries data-cursor="link" so the site's
// custom cursor treats it like other interactive elements.

import styles from "./resume.module.css";

export function DownloadButton() {
  return (
    <button
      type="button"
      className={styles.downloadBtn}
      onClick={() => window.print()}
      data-cursor="link"
      aria-label="Download résumé as PDF"
    >
      ↓ Download PDF
    </button>
  );
}
