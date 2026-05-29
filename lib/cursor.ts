export interface CursorState { name: string; size: number; label: string; }
export type CursorTrigger = { kind: "link" | "card" | "drag" | "reset" } | null;

const STATES: Record<string, CursorState> = {
  default: { name: "default", size: 10, label: "" },
  link:    { name: "link",    size: 50, label: "" },
  card:    { name: "card",    size: 60, label: "View →" },
  drag:    { name: "drag",    size: 50, label: "Drag" },
};

export function nextCursor(_current: string, trigger: CursorTrigger): CursorState {
  if (!trigger || trigger.kind === "reset") return STATES.default;
  return STATES[trigger.kind] ?? STATES.default;
}
