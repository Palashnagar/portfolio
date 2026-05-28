export interface ToolGroup {
  group: "Design" | "Research" | "Build";
  items: string[];
}

export const toolkit: ToolGroup[] = [
  { group: "Design", items: ["Figma", "Framer", "Procreate", "Illustrator"] },
  { group: "Research", items: ["Maze", "Dovetail", "Notion", "Otter"] },
  { group: "Build", items: ["Arduino", "HTML / CSS", "React (basics)", "Cursor"] },
];
