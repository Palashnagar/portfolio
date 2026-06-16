"use client";

import { useState } from "react";
import { Magnetic } from "@/components/fx/Magnetic";
import clsx from "clsx";

type State = "idle" | "submitting" | "success" | "error";

// Web3Forms access key — PUBLIC by design (it lives in client markup) and bound to
// deliver only to the address it was created for, so it is safe in the bundle.
// Web3Forms blocks server-side calls and sits behind a browser bot-check, so the
// form posts here directly from the browser. Delivers to nagar.palash683@gmail.com.
const WEB3FORMS_ACCESS_KEY = "e95f9da5-eeea-48a0-a11c-e2c431dc9532";
const PROJECT_LABELS: Record<string, string> = {
  fulltime: "Full-time",
  freelance: "Freelance / contract",
  hi: "Just saying hi",
};

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrors([]);

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const message = String(fd.get("message") ?? "");
    const projectType = String(fd.get("projectType") ?? "hi");
    const label = PROJECT_LABELS[projectType] ?? projectType;

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New portfolio message · ${label} · ${name}`,
          from_name: "Palash Nagar Portfolio",
          name,
          email, // Web3Forms uses this as the reply-to address
          project_type: label,
          message,
          botcheck: Boolean(fd.get("botcheck")), // honeypot: bots tick the hidden box
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (json.success) {
        setState("success");
      } else {
        setErrors([json.message ?? "Something went wrong. Please use the email link below."]);
        setState("error");
      }
    } catch {
      setErrors(["Network error. Please use the email link below."]);
      setState("error");
    }
  }

  // Typographic success — no mascot. Mirrors the v2 closer voice.
  if (state === "success") {
    return (
      <section
        className="flex min-h-[70vh] flex-col items-center justify-center text-center"
        style={{ padding: "120px 6vw" }}
        aria-live="polite"
      >
        <div className="mb-6 text-[11px] uppercase tracking-[0.2em] text-accent-text">Message sent</div>
        <h1
          className="text-ink"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 8vw, 110px)",
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
          }}
        >
          Thanks — <em style={{ fontStyle: "italic", color: "var(--accent)" }}>talk soon.</em>
        </h1>
        <p className="mt-7 max-w-[42ch] text-[16px] leading-[1.6] text-muted">
          I read every message and usually reply within a day.
        </p>
      </section>
    );
  }

  return (
    <>
      <header style={{ padding: "140px 6vw 40px" }}>
        <div className="mx-auto max-w-content">
          <div className="mb-6 text-[11px] uppercase tracking-[0.2em] text-accent-text">Contact</div>
          <h1
            className="max-w-[16ch] text-ink"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(44px, 8.5vw, 124px)",
              lineHeight: 0.96,
              letterSpacing: "-0.025em",
            }}
          >
            Let&apos;s <em style={{ fontStyle: "italic", color: "var(--accent)" }}>make something.</em>
          </h1>
        </div>
      </header>

      <section style={{ padding: "0 6vw 120px" }}>
        <form onSubmit={handleSubmit} className="mx-auto max-w-reading space-y-9">
          {/* Honeypot — hidden from people; bots that tick it are rejected. */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <Field label="Name" name="name" required placeholder="Your name" />
          <Field label="Email" name="email" type="email" required placeholder="you@example.com" />
          <FieldArea label="Message" name="message" required minLength={10} placeholder="A few words about your project, or just say hi." />

          <fieldset>
            <legend className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
              Project type
            </legend>
            <div className="flex flex-wrap gap-3">
              {[
                { v: "fulltime", l: "Full-time" },
                { v: "freelance", l: "Freelance / contract" },
                { v: "hi", l: "Just saying hi" },
              ].map((o) => (
                <label
                  key={o.v}
                  data-cursor="link"
                  className="cursor-none rounded-full border border-line px-4 py-2 text-[13px] uppercase tracking-[0.06em] text-ink transition-colors has-checked:border-ink has-checked:bg-ink has-checked:text-bg"
                >
                  <input
                    type="radio"
                    name="projectType"
                    value={o.v}
                    defaultChecked={o.v === "hi"}
                    className="sr-only"
                  />
                  {o.l}
                </label>
              ))}
            </div>
          </fieldset>

          {errors.length > 0 && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-lg border border-accent/40 bg-accent/5 p-4 text-accent-text"
            >
              <ul className="list-inside list-disc text-[14px]">
                {errors.map((er, i) => (
                  <li key={i}>{er}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Magnetic>
              <button
                type="submit"
                disabled={state === "submitting"}
                data-cursor="Send →"
                className={clsx(
                  "rounded-full bg-ink px-7 py-4 text-[14px] font-medium uppercase tracking-[0.08em] text-bg transition-opacity",
                  state === "submitting" && "cursor-not-allowed opacity-50",
                )}
              >
                {state === "submitting" ? "Sending…" : "Send message →"}
              </button>
            </Magnetic>

            <p className="text-[14px] text-muted">
              Prefer email?{" "}
              <a className="text-ink underline transition-colors hover:text-accent-text" href="mailto:nagar.palash683@gmail.com">
                nagar.palash683@gmail.com
              </a>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-[6px] border border-line bg-[rgba(10,10,10,0.04)] px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent focus:bg-transparent"
      />
    </div>
  );
}

function FieldArea({
  label,
  name,
  required,
  minLength,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-[6px] border border-line bg-[rgba(10,10,10,0.04)] px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent focus:bg-transparent"
      />
    </div>
  );
}
