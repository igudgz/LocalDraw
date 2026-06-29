import { describe, expect, it } from "vitest";
import { createResizeSession, getResizedElement } from "./resizeTool";
import type { RectangleElement } from "../elements/elementTypes";

const rectangle: RectangleElement = {
  id: "rect-1",
  type: "rectangle",
  x: 100,
  y: 80,
  width: 120,
  height: 60,
  rotation: 0,
  strokeColor: "#18202c",
  backgroundColor: "#ffffff",
  strokeWidth: 2,
  opacity: 1,
  createdAt: "2026-06-28T10:00:00.000Z",
  updatedAt: "2026-06-28T10:00:00.000Z",
};

describe("resizeTool", () => {
  it("getResizedElement mirrors selectTool compute-in-tool pattern", () => {
    const session = createResizeSession(1, rectangle.id, "se");
    const next = getResizedElement(session, rectangle, { x: 250, y: 180 });

    expect(next).toMatchObject({
      id: rectangle.id,
      x: 100,
      y: 80,
      width: 150,
      height: 100,
    });
  });
});
