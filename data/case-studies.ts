export interface CaseStudyMeta {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  cover: string;
  ogImage: string;
  featured: boolean;
  shipped: boolean;
}

export const caseStudies: CaseStudyMeta[] = [
  {
    slug: "mycourses",
    title: "MyCourses 2.0",
    tagline: "Helping 19,000+ RIT students never miss an assignment again",
    role: "UX Designer",
    year: "2025",
    cover: "/case-studies/mycourses/cover.jpg",
    ogImage: "/case-studies/mycourses/og.jpg",
    featured: true,
    shipped: true,
  },
  {
    slug: "roomiematch",
    title: "RoomieMatch",
    tagline: "Mobile-first roommate matching by lifestyle compatibility",
    role: "UX Designer",
    year: "2025",
    cover: "/case-studies/roomiematch/cover.jpg",
    ogImage: "/case-studies/roomiematch/og.jpg",
    featured: true,
    shipped: false,
  },
  {
    slug: "rit-athletics",
    title: "RIT Athletics",
    tagline: "Keeping RIT Tigers fans connected on the go",
    role: "UX Designer",
    year: "2025",
    cover: "/case-studies/rit-athletics/cover.jpg",
    ogImage: "/case-studies/rit-athletics/og.jpg",
    featured: true,
    shipped: false,
  },
  {
    slug: "rit-eats",
    title: "RIT EATS",
    tagline: "Campus food ordering, redesigned",
    role: "Website Designer",
    year: "2024",
    cover: "/case-studies/rit-eats/cover.jpg",
    ogImage: "/case-studies/rit-eats/og.jpg",
    featured: false,
    shipped: false,
  },
];
