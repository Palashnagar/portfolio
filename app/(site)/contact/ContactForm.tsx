"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { PalashCharacter } from "@/components/character/PalashCharacter";
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

  if (state === "success") {
    return (
      <main className="max-w-content mx-auto px-6 md:px-10 py-32 text-center">
        <PalashCharacter variant="celebrating" size={180} />
        <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl mt-8 leading-[1.0]">
          Thanks — <em className="text-[var(--accent)]">talk soon.</em>
        </h1>
        <p className="mt-6 opacity-75 max-w-md mx-auto">
          I read every message. Reply usually within 24 hours.
        </p>
      </main>
    );
  }

  return (
    <main>
      <section className="max-w-content mx-auto px-6 md:px-10 pt-24 pb-12">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
            Contact
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl tracking-tight leading-[1.0]">
            Let&apos;s <em>make something.</em>
          </h1>
        </Reveal>
      </section>

      <section className="max-w-reading mx-auto px-6 md:px-10 pb-32">
        <Reveal>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <FieldArea label="Message" name="message" required minLength={10} />
            <fieldset>
              <legend className="text-xs uppercase tracking-[0.18em] opacity-55 mb-3">
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
                    className="cursor-pointer px-4 py-2 border border-[var(--line)] rounded-full text-sm has-checked:bg-[var(--ink)] has-checked:text-[var(--bg)] has-checked:border-[var(--ink)] transition-colors"
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
                className="border border-red-500/30 bg-red-500/10 text-red-800 rounded-lg p-4"
              >
                <ul className="list-disc list-inside text-sm">
                  {errors.map((er, i) => (
                    <li key={i}>{er}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={state === "submitting"}
              className={clsx(
                "inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[var(--ink)] text-[var(--bg)] font-medium",
                state === "submitting" && "opacity-50 cursor-not-allowed",
              )}
              data-cursor="Send →"
            >
              {state === "submitting" ? "Sending…" : "Send message →"}
            </button>

            <p className="text-sm opacity-60">
              Prefer email?{" "}
              <a className="underline" href="mailto:asnddev@gmail.com">
                asnddev@gmail.com
              </a>
            </p>
          </form>
        </Reveal>
      </section>
    </main>
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
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.18em] opacity-55 mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full bg-transparent border-b border-[var(--line)] focus:border-[var(--accent)] outline-none py-2 text-lg"
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
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.18em] opacity-55 mb-2"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        minLength={minLength}
        rows={5}
        className="w-full bg-transparent border-b border-[var(--line)] focus:border-[var(--accent)] outline-none py-2 text-lg resize-none"
      />
    </div>
  );
}
