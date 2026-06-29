import { describe, expect, it } from "vitest";
import {
  getElementBounds,
  getResizeHandles,
  MIN_ELEMENT_SIZE,
  resizeElement,
} from "./elementGeometry";
import type {
  ArrowElement,
  EllipseElement,
  RectangleElement,
  TextElement,
} from "./elementTypes";

const timestamp = "2026-06-28T10:00:00.000Z";

const baseStyle = {
  rotation: 0,
  strokeColor: "#18202c",
  backgroundColor: "#ffffff",
  strokeWidth: 2,
  opacity: 1,
  createdAt: timestamp,
  updatedAt: timestamp,
};

const rectangle: RectangleElement = {
  id: "rect-1",
  type: "rectangle",
  x: 100,
  y: 80,
  width: 120,
  height: 60,
  ...baseStyle,
};

const ellipse: EllipseElement = {
  id: "ellipse-1",
  type: "ellipse",
  x: 50,
  y: 40,
  width: 80,
  height: 40,
  ...baseStyle,
};

const arrow: ArrowElement = {
  id: "arrow-1",
  type: "arrow",
  x: 10,
  y: 20,
  width: 90,
  height: 70,
  startX: 10,
  startY: 20,
  endX: 100,
  endY: 90,
  ...baseStyle,
};

const text: TextElement = {
  id: "text-1",
  type: "text",
  x: 40,
  y: 100,
  width: 80,
  height: 24,
  text: "Label",
  fontSize: 16,
  fontFamily: "Inter, sans-serif",
  ...baseStyle,
};

describe("resizeElement rectangle (REQ-002)", () => {
  it("updates x, y, width, and height when dragging the south-east handle", () => {
    const resized = resizeElement(rectangle, "se", { x: 250, y: 180 });

    expect(resized).toMatchObject({
      x: 100,
      y: 80,
      width: 150,
      height: 100,
    });
    expect(resized.width).toBeGreaterThanOrEqual(MIN_ELEMENT_SIZE);
    expect(resized.height).toBeGreaterThanOrEqual(MIN_ELEMENT_SIZE);
  });

  it("moves the north-west corner when dragging the north-west handle", () => {
    const resized = resizeElement(rectangle, "nw", { x: 120, y: 90 });

    expect(resized).toMatchObject({
      x: 120,
      y: 90,
      width: 100,
      height: 50,
    });
  });

  it("never produces negative width or height", () => {
    const resized = resizeElement(rectangle, "se", { x: 50, y: 50 });

    expect(resized.width).toBeGreaterThanOrEqual(MIN_ELEMENT_SIZE);
    expect(resized.height).toBeGreaterThanOrEqual(MIN_ELEMENT_SIZE);
  });

  it("enforces a minimum size of 1px when the pointer collapses the shape", () => {
    const resized = resizeElement(rectangle, "se", { x: 100, y: 80 });

    expect(resized.width).toBe(MIN_ELEMENT_SIZE);
    expect(resized.height).toBe(MIN_ELEMENT_SIZE);
  });
});

describe("resizeElement ellipse (REQ-003)", () => {
  it("applies the same bounds behavior as a rectangle", () => {
    const resized = resizeElement(ellipse, "ne", { x: 160, y: 20 });

    expect(resized).toMatchObject({
      x: 50,
      y: 20,
      width: 110,
      height: 60,
    });
  });
});

describe("resizeElement arrow (REQ-004)", () => {
  it("moves the start endpoint and recalculates the bounding box", () => {
    const resized = resizeElement(arrow, "start", { x: 0, y: 0 }) as ArrowElement;

    expect(resized.startX).toBe(0);
    expect(resized.startY).toBe(0);
    expect(resized.endX).toBe(100);
    expect(resized.endY).toBe(90);
    expect(resized).toMatchObject({
      x: 0,
      y: 0,
      width: 100,
      height: 90,
    });
  });

  it("moves the end endpoint and recalculates the bounding box", () => {
    const resized = resizeElement(arrow, "end", { x: 140, y: 10 }) as ArrowElement;

    expect(resized.startX).toBe(10);
    expect(resized.startY).toBe(20);
    expect(resized.endX).toBe(140);
    expect(resized.endY).toBe(10);
    expect(resized).toMatchObject({
      x: 10,
      y: 10,
      width: 130,
      height: 10,
    });
  });

  it("exposes start and end handles instead of corner handles", () => {
    const handles = getResizeHandles(arrow).map((handle) => handle.id);

    expect(handles).toEqual(["start", "end"]);
  });
});

describe("resizeElement text (REQ-005)", () => {
  it("updates width and height while keeping bounds aligned with the baseline", () => {
    const resized = resizeElement(text, "se", { x: 160, y: 130 }) as TextElement;

    expect(resized.width).toBe(120);
    expect(resized.height).toBe(54);
    expect(resized.y).toBe(130);

    const bounds = getElementBounds(resized);
    expect(bounds).toMatchObject({
      x: 40,
      y: 76,
      width: 120,
      height: 54,
    });
  });

  it("enforces minimum text dimensions", () => {
    const resized = resizeElement(text, "nw", { x: 39, y: 99 }) as TextElement;

    expect(resized.width).toBeGreaterThanOrEqual(MIN_ELEMENT_SIZE);
    expect(resized.height).toBeGreaterThanOrEqual(MIN_ELEMENT_SIZE);
  });
});

describe("getResizeHandles (REQ-001 support)", () => {
  it("returns four corner handles for rectangle-like elements", () => {
    const handles = getResizeHandles(rectangle).map((handle) => handle.id);

    expect(handles).toEqual(["nw", "ne", "sw", "se"]);
  });
});
