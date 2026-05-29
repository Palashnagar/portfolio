import { nextCursor, type CursorState } from "@/lib/cursor";

test("default → link grows; → card shows View; reset returns to default", () => {
  expect(nextCursor("default", { kind: "link" }).size).toBeGreaterThan(nextCursor("default", null as any).size);
  const card = nextCursor("default", { kind: "card" });
  expect(card.label).toBe("View →");
  expect(nextCursor(card.name, { kind: "reset" }).name).toBe("default");
});
