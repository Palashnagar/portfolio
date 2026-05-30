export interface ExperienceRow {
  year: string;
  where: string;
  role: string;
  context?: string;
  kind: "work" | "edu";
}

export const experience: ExperienceRow[] = [
  {
    year: "2024 — now",
    where: "RIT",
    role: "Master's in HCI",
    context: "Capstone: thermal-illusion wearable",
    kind: "edu",
  },
  {
    year: "2025",
    where: "Excellus BCBS",
    role: "Usability Testing · Course Project",
    context: "Graduate team usability study of their member website",
    kind: "work",
  },
  {
    year: "2023 — 24",
    where: "Netlink Software",
    role: "UX Designer (Intern)",
    context: "Enterprise dashboards + design system",
    kind: "work",
  },
  {
    year: "2022",
    where: "Code Clause",
    role: "UX Designer (Intern)",
    context: "Mobile-first product design",
    kind: "work",
  },
];
