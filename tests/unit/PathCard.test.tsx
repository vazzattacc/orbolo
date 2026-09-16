import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PathCard } from "@/components/PathCard";
import type { PathCard as PathCardData } from "@/lib/paths/types";

const path: PathCardData = {
  id: "verdant",
  title: "Verdant",
  description: "Local stewardship, rooted in the land.",
  image: { src: "/images/paths/verdant.svg", alt: "Verdant descriptive alt text" },
  destination: "/paths/verdant",
};

describe("PathCard", () => {
  it("renders the title and description", () => {
    render(<PathCard path={path} />);
    expect(screen.getByText("Verdant")).toBeInTheDocument();
    expect(screen.getByText("Local stewardship, rooted in the land.")).toBeInTheDocument();
  });

  it("renders an image with the configured non-empty alt text", () => {
    render(<PathCard path={path} />);
    const image = screen.getByAltText("Verdant descriptive alt text");
    expect(image).toBeInTheDocument();
  });

  it("renders as a real link to the path's destination, not a div onClick", () => {
    render(<PathCard path={path} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/paths/verdant");
  });
});
