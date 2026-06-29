import { describe, expect, it } from "vitest";
import type { LocalDrawElement } from "../elements/elementTypes";
import { estimateTextBounds } from "../elements/elementGeometry";
import { editorReducer, initialEditorState } from "../editor/editorReducer";

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

describe("editorReducer update-element-style", () => {
  it("updates strokeColor, strokeWidth, and opacity on rectangle", () => {
    const state = {
      ...initialEditorState,
      elements: [rectangle],
      selectedElementIds: ["rect-1"],
    };

    const next = editorReducer(state, {
      type: "update-element-style",
      elementId: "rect-1",
      strokeColor: "#ff0000",
      strokeWidth: 5,
      opacity: 0.5,
    });

    const updated = next.elements[0];
    expect(updated).toMatchObject({
      strokeColor: "#ff0000",
      strokeWidth: 5,
      opacity: 0.5,
    });
    expect(updated?.updatedAt).not.toBe(rectangle.updatedAt);
    expect(next.currentDrawing.updatedAt).not.toBe(
      initialEditorState.currentDrawing.updatedAt,
    );
  });

  it("updates fontSize on text and recalculates bounds", () => {
    const state = {
      ...initialEditorState,
      elements: [text],
      selectedElementIds: ["text-1"],
    };
    const expectedBounds = estimateTextBounds("Hello", 24);

    const next = editorReducer(state, {
      type: "update-element-style",
      elementId: "text-1",
      fontSize: 24,
    });

    const updated = next.elements[0];
    expect(updated).toMatchObject({
      fontSize: 24,
      width: expectedBounds.width,
      height: expectedBounds.height,
    });
    expect(updated?.updatedAt).not.toBe(text.updatedAt);
  });

  it("leaves state unchanged for unknown elementId", () => {
    const state = {
      ...initialEditorState,
      elements: [rectangle],
    };

    const next = editorReducer(state, {
      type: "update-element-style",
      elementId: "missing-id",
      strokeColor: "#ff0000",
    });

    expect(next).toBe(state);
  });
});
