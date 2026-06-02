export interface ToolGroup {
  group: "Design" | "Research" | "Build";
  items: string[];
}

export const toolkit: ToolGroup[] = [
  { group: "Design", items: ["Figma", "Framer", "Adobe XD", "Spline", "Procreate", "Illustrator"] },
  { group: "Research", items: ["Maze", "Dovetail", "Notion", "Otter"] },
  { group: "Build", items: ["HTML / CSS", "React (basics)", "Cursor", "Claude Code"] },
];
