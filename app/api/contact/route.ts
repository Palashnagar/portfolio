import { NextResponse } from "next/server";

const PROJECT_TYPES = ["fulltime", "freelance", "hi"] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  projectType: ProjectType;
}

export interface ValidationResult {
  ok: boolean;
  errors?: string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(input: Partial<ContactInput>): ValidationResult {
  const errors: string[] = [];
  if (!input.name || input.name.trim().length === 0) errors.push("name required");
  if (!input.email || !EMAIL_RE.test(input.email)) errors.push("valid email required");
  if (!input.message || input.message.trim().length < 10)
    errors.push("message must be at least 10 chars");
  if (!input.projectType || !PROJECT_TYPES.includes(input.projectType as ProjectType))
    errors.push("invalid projectType");
  return { ok: errors.length === 0, errors: errors.length ? errors : undefined };
}

export async function POST(req: Request) {
  let body: Partial<ContactInput>;
  try {
    body = (await req.json()) as Partial<ContactInput>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const v = validate(body);
  if (!v.ok) {
    return NextResponse.json({ ok: false, errors: v.errors }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[contact] RESEND_API_KEY missing — falling back");
    return NextResponse.json({ ok: true, delivery: "fallback" }, { status: 202 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <noreply@palashnagar.com>",
        to: "asnddev@gmail.com",
        reply_to: body.email,
        subject: `Portfolio contact · ${body.projectType} · ${body.name}`,
        text: `From: ${body.name} <${body.email}>\nProject type: ${body.projectType}\n\n${body.message}`,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "delivery failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: "network error" }, { status: 502 });
  }
}
