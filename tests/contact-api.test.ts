import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, validate, type ContactInput } from "@/app/api/contact/route";

describe("contact validation", () => {
  it("rejects missing email", () => {
    const result = validate({ name: "A", email: "", message: "Hi", projectType: "hi" });
    expect(result.ok).toBe(false);
  });

  it("rejects malformed email", () => {
    const result = validate({ name: "A", email: "not-an-email", message: "Hi", projectType: "hi" });
    expect(result.ok).toBe(false);
  });

  it("rejects message under 10 chars", () => {
    const result = validate({ name: "A", email: "a@b.co", message: "hi", projectType: "hi" });
    expect(result.ok).toBe(false);
  });

  it("rejects invalid projectType", () => {
    const result = validate({
      name: "A",
      email: "a@b.co",
      message: "Hello there",
      projectType: "invalid" as ContactInput["projectType"],
    });
    expect(result.ok).toBe(false);
  });

  it("accepts valid input", () => {
    const result = validate({
      name: "Alice",
      email: "alice@example.com",
      message: "Hello there I have a project for you.",
      projectType: "freelance",
    });
    expect(result.ok).toBe(true);
  });
});

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
  });

  it("returns 400 on invalid body", async () => {
    const req = new Request("http://test/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "", email: "", message: "", projectType: "hi" }),
      headers: { "content-type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 on valid body with mocked Resend", async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ id: "mock" }), { status: 200 }),
    ) as typeof fetch;

    const req = new Request("http://test/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Alice",
        email: "alice@example.com",
        message: "Hello there I have a project for you.",
        projectType: "freelance",
      }),
      headers: { "content-type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
