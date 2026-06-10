import type { Metadata } from "next";
import styles from "./resume.module.css";
import { DownloadButton } from "./DownloadButton";

export const metadata: Metadata = {
  title: "Palash Nagar — UX/Product Designer · Résumé",
  description:
    "Résumé of Palash Nagar — UX/Product designer and HCI graduate student with 2+ years shipping research-backed digital products.",
};

// Single source of truth for the résumé's website link (masthead + footer).
// Uses the deployed portfolio domain so it never 404s.
// TODO: swap to palashnagar.com once the domain is live.
const RESUME_SITE_URL = "https://palashnagar.vercel.app";
const RESUME_SITE_LABEL = "palashnagar.vercel.app";

const DESIGN_SKILLS = ["Figma", "Framer", "Adobe XD", "Sketch", "Spline", "After Effects", "Miro"];
const RESEARCH_SKILLS = [
  "Usability Testing",
  "User Interviews",
  "Journey Mapping",
  "Heuristic Eval",
  "A/B Testing",
  "Card Sorting",
];
const DEV_SKILLS = [
  "HTML / CSS",
  "Design Systems",
  "WCAG / A11y",
  "Motion Design",
  "Interaction Design",
  "Prototyping",
];

export default function ResumePage() {
  return (
    <div className={styles.page}>
      <article className={styles.sheet}>
        {/* ============ MASTHEAD ============ */}
        <header className={styles.masthead}>
          <div className={styles.mastheadLeft}>
            <h1 className={styles.name}>
              Palash <em>Nagar</em>
            </h1>
            <p className={styles.role}>
              UX / Product Designer <span className={styles.dot}>·</span> Interaction &amp; Motion
            </p>
            <p className={styles.summary}>
              UX/Product designer and HCI graduate student with 2+ years shipping research-backed
              digital products. Comfortable across the full arc — user interviews, information
              architecture, high-fidelity UI, and <em>interaction motion</em>.
            </p>
          </div>
          <address className={styles.mastheadRight}>
            <span className={styles.avail}>Open to opportunities</span>
            <a href="mailto:nagar.palash683@gmail.com" data-cursor="link">
              nagar.palash683@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/palashnagar/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
            >
              linkedin.com/in/palashnagar
            </a>
            <a href={RESUME_SITE_URL} target="_blank" rel="noopener noreferrer" data-cursor="link">
              {RESUME_SITE_LABEL}
            </a>
            <span className={styles.loc}>Rochester, NY</span>
          </address>
        </header>

        {/* ============ BODY ============ */}
        <div className={styles.bodyGrid}>
          {/* LEFT COLUMN — Skills + Education */}
          <div>
            <section className={styles.block} aria-labelledby="resume-skills">
              <h2 className={styles.secLabel} id="resume-skills">
                <span className={styles.idx}>01</span> Skills
              </h2>

              <div className={styles.skillGroup}>
                <h3>Design</h3>
                <ul className={styles.chips}>
                  {DESIGN_SKILLS.map((s) => (
                    <li key={s} className={styles.chip}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.skillGroup}>
                <h3>Research</h3>
                <ul className={styles.chips}>
                  {RESEARCH_SKILLS.map((s) => (
                    <li key={s} className={styles.chip}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.skillGroup}>
                <h3>Dev &amp; Systems</h3>
                <ul className={styles.chips}>
                  {DEV_SKILLS.map((s) => (
                    <li key={s} className={styles.chip}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className={styles.block} aria-labelledby="resume-education">
              <h2 className={styles.secLabel} id="resume-education">
                <span className={styles.idx}>02</span> Education
              </h2>
              <ul>
                <li className={styles.eduItem}>
                  <h3 className={styles.deg}>MS Human-Computer Interaction</h3>
                  <div className={styles.school}>Rochester Institute of Technology</div>
                  <div className={styles.eduMeta}>
                    <span>2024 — Present</span>
                    <span>Rochester, NY</span>
                  </div>
                </li>
                <li className={styles.eduItem}>
                  <h3 className={styles.deg}>BS Information Technology</h3>
                  <div className={styles.school}>Bharati Vidyapeeth Deemed University</div>
                  <div className={styles.eduMeta}>
                    <span>2019 — 2023</span>
                    <span>Navi Mumbai, India</span>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN — Experience + Selected Projects */}
          <div>
            <section className={styles.block} aria-labelledby="resume-experience">
              <h2 className={styles.secLabel} id="resume-experience">
                <span className={styles.idx}>03</span> Experience
              </h2>
              <ul>
                <li className={styles.job}>
                  <div className={styles.jobHead}>
                    <h3 className={styles.jobCo}>Netlink Pvt. Ltd</h3>
                    <span className={styles.jobYears}>2023 — 2024</span>
                  </div>
                  <p className={styles.jobRole}>
                    UX Designer <span className={styles.kind}>Full-time</span>
                  </p>
                  <ul>
                    <li>
                      Designed user flows, wireframes, and responsive high-fidelity UI in Figma
                      using design tokens, variables, and reusable component libraries.
                    </li>
                    <li>
                      Conducted moderated usability testing and user interviews, applying IA, visual
                      hierarchy, and interaction design to simplify complex workflows.
                    </li>
                    <li>
                      Partnered with PMs and engineers across agile sprints, delivering precise
                      handoff via Figma Dev Mode and annotated specs.
                    </li>
                  </ul>
                </li>

                <li className={styles.job}>
                  <div className={styles.jobHead}>
                    <h3 className={styles.jobCo}>Code Clause</h3>
                    <span className={styles.jobYears}>2022</span>
                  </div>
                  <p className={styles.jobRole}>
                    UX Design Intern <span className={styles.kind}>Internship</span>
                  </p>
                  <ul>
                    <li>
                      Created UI mockups and interactive prototypes for web and mobile platforms
                      from scratch.
                    </li>
                    <li>
                      Iterated designs through rapid feedback loops based on stakeholder and
                      usability insights.
                    </li>
                    <li>
                      Participated in design critiques, refining craft and communication of design
                      decisions.
                    </li>
                  </ul>
                </li>
              </ul>
            </section>

            <section className={styles.block} aria-labelledby="resume-projects">
              <h2 className={styles.secLabel} id="resume-projects">
                <span className={styles.idx}>04</span> Selected Projects
              </h2>
              {/* RoomieMatch = 15 users (per case study); motion prototypes = 4.
                  TODO: confirm the +25% / +20% engagement figures with real data. */}
              <ul>
                <li className={styles.proj}>
                  <div className={styles.projHead}>
                    <h3 className={styles.projName}>RIT MyCourses Redesign</h3>
                    <span className={styles.projMetric}>+25% engagement</span>
                  </div>
                  <p className={styles.projDesc}>
                    End-to-end UX redesign with 30+ screens, user research, and journey mapping for
                    the student learning portal.
                  </p>
                  <div className={styles.projTags}>
                    <span className={styles.projTag}>Figma</span>
                    <span className={styles.projTag}>Research</span>
                    <span className={styles.projTag}>Prototyping</span>
                  </div>
                </li>

                <li className={styles.proj}>
                  <div className={styles.projHead}>
                    <h3 className={styles.projName}>RIT Athletics App</h3>
                    <span className={styles.projMetric}>+20% engagement</span>
                  </div>
                  <p className={styles.projDesc}>
                    Redesigned mobile UX for improved content discovery and fan experience with
                    cleaner information architecture.
                  </p>
                  <div className={styles.projTags}>
                    <span className={styles.projTag}>Mobile UX</span>
                    <span className={styles.projTag}>IA</span>
                    <span className={styles.projTag}>Framer</span>
                  </div>
                </li>

                <li className={styles.proj}>
                  <div className={styles.projHead}>
                    <h3 className={styles.projName}>RoomieMatch App</h3>
                    <span className={styles.projMetric}>validated with 15 users</span>
                  </div>
                  <p className={styles.projDesc}>
                    Trust-focused UX design for a roommate matching platform. Interactive prototypes
                    validated through user testing.
                  </p>
                  <div className={styles.projTags}>
                    <span className={styles.projTag}>Research</span>
                    <span className={styles.projTag}>Prototyping</span>
                    <span className={styles.projTag}>Mobile</span>
                  </div>
                </li>

                <li className={styles.proj}>
                  <div className={styles.projHead}>
                    <h3 className={styles.projName}>AI Interaction Explorations</h3>
                    <span className={styles.projMetric}>4 motion prototypes</span>
                  </div>
                  <p className={styles.projDesc}>
                    Motion-based prototypes using Spline and Framer exploring AI-assisted design
                    workflows with Claude and Figma MCP.
                  </p>
                  <div className={styles.projTags}>
                    <span className={styles.projTag}>Framer</span>
                    <span className={styles.projTag}>Spline</span>
                    <span className={styles.projTag}>Motion</span>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* ============ SHEET FOOTER (not the site footer; a <div> so the site
            <footer> can be hidden in print without affecting this) ============ */}
        <div className={styles.foot}>
          <span>Palash Nagar · UX / Product Designer</span>
          <span>
            <span className={styles.accent}>2026</span> · {RESUME_SITE_LABEL}
          </span>
        </div>
      </article>

      <DownloadButton />
    </div>
  );
}
