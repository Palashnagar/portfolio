import { render } from "@testing-library/react";
import { Grain } from "@/components/fx/Grain";

test("grain is decorative and non-interactive", () => {
  const { container } = render(<Grain />);
  const el = container.firstChild as HTMLElement;
  expect(el).toHaveAttribute("aria-hidden", "true");
  expect(el.className).toMatch(/pointer-events-none/);
});
