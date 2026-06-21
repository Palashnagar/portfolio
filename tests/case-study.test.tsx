import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Hero } from "@/components/case-study/Hero";
import { Problem } from "@/components/case-study/Problem";
import { Research } from "@/components/case-study/Research";
import { Insight } from "@/components/case-study/Insight";
import { Evidence } from "@/components/case-study/Evidence";
import { Constraints } from "@/components/case-study/Constraints";
import { Solution } from "@/components/case-study/Solution";
import { Screen } from "@/components/case-study/Screen";
import { Outcome } from "@/components/case-study/Outcome";
import { NextProject } from "@/components/case-study/NextProject";
import { Todo } from "@/components/case-study/Todo";

describe("Todo marker (missing-data convention)", () => {
  test("is visible, labelled with the exact phrase, and announced as a note", () => {
    render(<Todo>sample size</Todo>);
    const note = screen.getByRole("note");
    expect(note).toBeInTheDocument();
    expect(note).toHaveTextContent(
      /TODO: needs data from Palash, sample size/i,
    );
  });

  test("Screen with no image renders a Todo marker instead of fabricating one", () => {
    render(<Screen insight="x" decision="y" />);
    expect(screen.getByText(/needs data from Palash/i)).toBeInTheDocument();
  });
});

describe("7-section spine", () => {
  function renderSpine() {
    return render(
      <>
        <Hero
          title="MyCourses 2.0"
          role="UX Designer"
          year="2025"
          duration="8 weeks"
          team="Solo"
          outcome="2× confidence in submission."
        />
        <Problem title="Students drowning in notifications.">
          <p>Body copy.</p>
          <Evidence source="Maya, 2nd-year CS">
            I miss assignments because notifications bury them.
          </Evidence>
        </Problem>
        <Research
          title="What 12 interviews told me."
          methods={["12 interviews", "82-respondent survey"]}
        >
          <Insight number="01" title="Notifications cause anxiety.">
            <Evidence source="P3">phantom buzzing</Evidence>
          </Insight>
        </Research>
        <Constraints title="What I deliberately ignored.">
          <p>Scope was the assignments flow only.</p>
        </Constraints>
        <Solution title="Three flows, three insights.">
          <Screen
            src="/case-studies/mycourses/solution-today.jpg"
            alt="Today view"
            insight="Notifications cause anxiety"
            decision="One calm Today screen"
            caption="Today view"
          />
        </Solution>
        <Outcome
          title="What the second test showed."
          metrics={[{ value: "2×", label: "Confidence in submission" }]}
        >
          <p>Result copy.</p>
        </Outcome>
        <NextProject currentSlug="mycourses" />
      </>,
    );
  }

  test("renders the hero h1 first, then five section headings, then the next-project heading — in order", () => {
    renderSpine();
    const headings = screen.getAllByRole("heading");
    const names = headings.map((h) => h.textContent?.trim());

    expect(headings[0].tagName).toBe("H1");
    expect(names[0]).toMatch(/MyCourses 2\.0/);

    // h2 spine titles, in fixed order
    expect(names.slice(1)).toEqual([
      "Students drowning in notifications.",
      "What 12 interviews told me.",
      "What I deliberately ignored.",
      "Three flows, three insights.",
      "What the second test showed.",
      // NextProject heading = next project title + accent word ("Roomie Match")
      expect.stringMatching(/Roomie\s*Match/),
    ]);
  });

  test("renders every fixed spine label", () => {
    renderSpine();
    expect(screen.getByText("The problem")).toBeInTheDocument();
    expect(screen.getByText("Research")).toBeInTheDocument();
    expect(screen.getByText("Constraints & decisions")).toBeInTheDocument();
    expect(screen.getByText("The solution")).toBeInTheDocument();
    expect(screen.getByText("Outcome & next")).toBeInTheDocument();
  });

  test("hero exposes role, timeline, and team meta", () => {
    renderSpine();
    expect(screen.getByText("UX Designer")).toBeInTheDocument();
    expect(screen.getByText("8 weeks")).toBeInTheDocument();
    expect(screen.getByText("Solo")).toBeInTheDocument();
  });
});
