import { describe, expect, it } from "vitest";
import type { LocalDrawElement } from "./elementTypes";
import { estimateTextBounds } from "./elementGeometry";
import { applyElementStylePatch } from "./applyElementStylePatch";

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
  text: "Hello",
  fontSize: 16,
  fontFamily: "Inter, sans-serif",
  createdAt: "2026-06-28T10:00:00.000Z",
  updatedAt: "2026-06-28T10:00:00.000Z",
};

describe("applyElementStylePatch", () => {
  it("updates base style fields on rectangle", () => {
    const updatedAt = "2026-06-28T12:00:00.000Z";
    const next = applyElementStylePatch(
      rectangle,
      {
        strokeColor: "#ff0000",
        backgroundColor: "#eeeeee",
        strokeWidth: 5,
        opacity: 0.5,
      },
      updatedAt,
    );

    expect(next).toMatchObject({
      strokeColor: "#ff0000",
      backgroundColor: "#eeeeee",
      strokeWidth: 5,
      opacity: 0.5,
      updatedAt,
    });
  });

  it("ignores text-only patch fields on non-text elements", () => {
    const next = applyElementStylePatch(
      rectangle,
      { fontSize: 24, fontFamily: "Arial, sans-serif" },
      "2026-06-28T12:00:00.000Z",
    );

    expect(next).toMatchObject({
      width: rectangle.width,
      height: rectangle.height,
    });
    expect(next).not.toHaveProperty("fontSize");
  });

  it("updates fontSize on text and recalculates bounds", () => {
    const updatedAt = "2026-06-28T12:00:00.000Z";
    const expectedBounds = estimateTextBounds("Hello", 24);

    const next = applyElementStylePatch(
      text,
      { fontSize: 24 },
      updatedAt,
    );

    expect(next).toMatchObject({
      fontSize: 24,
      width: expectedBounds.width,
      height: expectedBounds.height,
      updatedAt,
    });
  });

  it("updates fontFamily on text without recalculating bounds", () => {
    const updatedAt = "2026-06-28T12:00:00.000Z";

    const next = applyElementStylePatch(
      text,
      { fontFamily: "Georgia, serif" },
      updatedAt,
    );

    expect(next).toMatchObject({
      fontFamily: "Georgia, serif",
      width: text.width,
      height: text.height,
      updatedAt,
    });
  });
});
