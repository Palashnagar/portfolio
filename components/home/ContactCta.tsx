// Homepage closer (spec §6, copy from 03-horizontal-scroll outro). Serif line
// with italic-orange accent + a single magnetic CTA. Server component — the
// magnetic behaviour lives in the <Magnetic> client primitive.

import Link from "next/link";
import { Magnetic } from "@/components/fx/Magnetic";

export default function ContactCta() {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center text-center"
      style={{ padding: "80px 6vw" }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "clamp(48px, 8vw, 120px)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        Got something
        <br />
        <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
          worth building?
        </em>
      </h2>

      <Magnetic className="mt-8">
        <Link
          href="/contact"
          style={{
            display: "inline-block",
            fontSize: "14px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
            textDecoration: "none",
            borderBottom: "1px solid var(--accent)",
            paddingBottom: "4px",
          }}
        >
          Get in touch →
        </Link>
      </Magnetic>
    </section>
  );
}
