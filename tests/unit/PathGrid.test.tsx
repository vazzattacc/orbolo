import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PathGrid } from "@/components/PathGrid";
import type { PathCard as PathCardData } from "@/lib/paths/types";

function makePath(id: string): PathCardData {
  return {
    id,
    title: id,
    description: `Description for ${id}`,
    image: { src: `/images/paths/${id}.svg`, alt: `${id} alt text` },
    destination: `/paths/${id}`,
  };
}

describe("PathGrid", () => {
  it("renders exactly one card per entry in the paths prop", () => {
    const paths = [makePath("el-tapir"), makePath("verdant"), makePath("orbolo-bridge")];
    render(<PathGrid paths={paths} />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("renders a safe empty grid for an empty array, with no crash", () => {
    const { container } = render(<PathGrid paths={[]} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(container).toBeTruthy();
  });

  it("renders a different card count when the input array changes, with no component changes", () => {
    const { rerender } = render(<PathGrid paths={[makePath("el-tapir")]} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);

    rerender(
      <PathGrid
        paths={[makePath("el-tapir"), makePath("verdant"), makePath("orbolo-bridge"), makePath("ganaderia-a-pasto"), makePath("business-meat"), makePath("sixth-path")]}
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(6);
  });
});
