import { describe, expect, it } from "vitest";
import type { LocalDrawElement } from "../elements/elementTypes";
import { exportAsSvg } from "./exportAsSvg";
import { elementToSvgMarkup, getElementsBounds } from "./elementSvgMarkup";

const rectangle: LocalDrawElement = {
  id: "rect-1",
  type: "rectangle",
  x: 10,
  y: 20,
  width: 120,
  height: 80,
  rotation: 0,
  strokeColor: "#18202c",
  backgroundColor: "#ffffff",
  strokeWidth: 2,
  opacity: 1,
  createdAt: "2026-06-28T10:00:00.000Z",
  updatedAt: "2026-06-28T10:00:00.000Z",
};

const text: LocalDrawElement = {
  id: "text-1",
  type: "text",
  x: 30,
  y: 50,
  width: 80,
  height: 24,
  rotation: 0,
  strokeColor: "#18202c",
  backgroundColor: "transparent",
  strokeWidth: 1,
  opacity: 1,
  text: "Hello & world",
  fontSize: 16,
  fontFamily: "Inter, sans-serif",
  createdAt: "2026-06-28T10:00:00.000Z",
  updatedAt: "2026-06-28T10:00:00.000Z",
};

describe("exportAsSvg", () => {
  it("generates a valid SVG document with rendered elements (REQ-004)", () => {
    const svg = exportAsSvg([rectangle, text]);

    expect(svg.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain("<rect ");
    expect(svg).toContain("<text ");
    expect(svg).toContain("Hello &amp; world");
    expect(svg.trimEnd().endsWith("</svg>")).toBe(true);
  });

  it("computes export bounds with padding", () => {
    const bounds = getElementsBounds([rectangle]);

    expect(bounds.x).toBeLessThan(rectangle.x);
    expect(bounds.y).toBeLessThan(rectangle.y);
    expect(bounds.width).toBeGreaterThan(rectangle.width);
    expect(bounds.height).toBeGreaterThan(rectangle.height);
  });

  it("escapes XML in element markup", () => {
    const markup = elementToSvgMarkup(text);

    expect(markup).toContain("Hello &amp; world");
    expect(markup).not.toContain("Hello & world");
  });
});
