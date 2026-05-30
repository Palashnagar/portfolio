"use client";

import { useState } from "react";
import { Magnetic } from "@/components/fx/Magnetic";
import clsx from "clsx";

type State = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrors([]);

    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      projectType: String(fd.get("projectType") ?? "hi"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok && res.status !== 202) {
        setErrors(json.errors ?? [json.error ?? "Something went wrong."]);
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrors(["Network error. Try the mailto link below."]);
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
        <div className="mb-6 text-[11px] uppercase tracking-[0.2em] text-accent">Message sent</div>
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
          <div className="mb-6 text-[11px] uppercase tracking-[0.2em] text-accent">Contact</div>
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
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <FieldArea label="Message" name="message" required minLength={10} />

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
              className="rounded-lg border border-accent/40 bg-accent/5 p-4 text-accent"
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
              <a className="text-ink underline transition-colors hover:text-accent" href="mailto:nagar.palash683@gmail.com">
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
        className="w-full border-b border-line bg-transparent py-2 text-[18px] text-ink outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}

function FieldArea({
  label,
  name,
  required,
  minLength,
}: {
  label: string;
  name: string;
  required?: boolean;
  minLength?: number;
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
        rows={5}
        className="w-full resize-none border-b border-line bg-transparent py-2 text-[18px] text-ink outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
