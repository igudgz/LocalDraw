import { describe, expect, it } from "vitest";
import { editorReducer, initialEditorState } from "../editor/editorReducer";
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

describe("editorReducer restore-drawing", () => {
  it("resets history, tool, and selection when switching drawings", () => {
    const next = editorReducer(
      {
        ...initialEditorState,
        activeTool: "rectangle",
        selectedElementIds: ["rect-1"],
        history: {
          past: [{ ...initialEditorState, elements: [] }],
          future: [{ ...initialEditorState, elements: [] }],
        },
        ui: { interaction: "dragging" },
      },
      {
        type: "restore-drawing",
        drawing: {
          id: "other-drawing",
          name: "Other",
          elements: [],
          viewport: { zoom: 1.5, scrollX: 10, scrollY: 20 },
          metadata: {
            createdAt: "2026-06-28T10:00:00.000Z",
            updatedAt: "2026-06-28T11:00:00.000Z",
          },
        },
      },
    );

    expect(next.activeTool).toBe("select");
    expect(next.selectedElementIds).toEqual([]);
    expect(next.history).toEqual({ past: [], future: [] });
    expect(next.ui.interaction).toBe("idle");
    expect(next.viewport.showGrid).toBe(initialEditorState.viewport.showGrid);
  });
});

describe("editorReducer resize-element (REQ-006, REQ-008)", () => {
  it("applies resizeElement and keeps the element selected", () => {
    const next = editorReducer(
      {
        ...initialEditorState,
        elements: [rectangle],
        selectedElementIds: [rectangle.id],
      },
      {
        type: "resize-element",
        elementId: rectangle.id,
        handle: "se",
        pointerX: 250,
        pointerY: 180,
      },
    );

    expect(next.selectedElementIds).toEqual([rectangle.id]);
    expect(next.elements[0]).toMatchObject({
      id: rectangle.id,
      x: 100,
      y: 80,
      width: 150,
      height: 100,
    });
  });

  it("still supports move after resize", () => {
    const resized = editorReducer(
      {
        ...initialEditorState,
        elements: [rectangle],
        selectedElementIds: [rectangle.id],
      },
      {
        type: "resize-element",
        elementId: rectangle.id,
        handle: "se",
        pointerX: 250,
        pointerY: 180,
      },
    );

    const moved = editorReducer(resized, {
      type: "update-element",
      elementId: rectangle.id,
      x: 120,
      y: 90,
    });

    expect(moved.elements[0]).toMatchObject({
      x: 120,
      y: 90,
      width: 150,
      height: 100,
    });
  });
});
