import { describe, expect, it } from "vitest";
import type { LocalDrawElement, RectangleElement } from "../elements/elementTypes";
import { estimateTextBounds } from "../elements/elementGeometry";
import { MAX_HISTORY } from "../history/historyReducer";
import { editorReducer, initialEditorState } from "../editor/editorReducer";
import {
  createResizeSession,
  getResizedElement,
} from "../tools/resizeTool";

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
          past: [[rectangle]],
          future: [[{ ...rectangle, x: 200 }]],
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

describe("editorReducer resize-element (REQ-006, REQ-008)", () => {
  it("applies resizeElement and keeps the element selected", () => {
    const session = createResizeSession(1, rectangle.id, "se");
    const resizedElement = getResizedElement(session, rectangle, {
      x: 250,
      y: 180,
    });

    const next = editorReducer(
      {
        ...initialEditorState,
        elements: [rectangle],
        selectedElementIds: [rectangle.id],
      },
      {
        type: "resize-element",
        elementId: rectangle.id,
        element: resizedElement,
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
    const session = createResizeSession(1, rectangle.id, "se");
    const resizedElement = getResizedElement(session, rectangle, {
      x: 250,
      y: 180,
    });

    const resized = editorReducer(
      {
        ...initialEditorState,
        elements: [rectangle],
        selectedElementIds: [rectangle.id],
      },
      {
        type: "resize-element",
        elementId: rectangle.id,
        element: resizedElement,
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

describe("editorReducer undo/redo", () => {
  it("undoes add-element by restoring the previous elements array", () => {
    const added = editorReducer(initialEditorState, {
      type: "add-element",
      element: rectangle,
    });

    expect(added.elements).toHaveLength(1);
    expect(added.history.past).toHaveLength(1);
    expect(added.history.past[0]).toEqual([]);

    const undone = editorReducer(added, { type: "undo" });

    expect(undone.elements).toEqual([]);
    expect(undone.history.past).toEqual([]);
    expect(undone.history.future).toHaveLength(1);
    expect(undone.history.future[0]).toEqual([rectangle]);
  });

  it("undoes update-element move and keeps selection unchanged", () => {
    const state = {
      ...initialEditorState,
      elements: [rectangle],
      selectedElementIds: [rectangle.id],
    };

    const moved = editorReducer(state, {
      type: "update-element",
      elementId: rectangle.id,
      x: 140,
      y: 120,
    });

    const undone = editorReducer(moved, { type: "undo" });

    expect(undone.elements[0]).toMatchObject({ x: 100, y: 80 });
    expect(undone.selectedElementIds).toEqual([rectangle.id]);
  });

  it("undoes update-element-style and redo restores the styled state", () => {
    const state = {
      ...initialEditorState,
      elements: [rectangle],
    };

    const styled = editorReducer(state, {
      type: "update-element-style",
      elementId: rectangle.id,
      strokeColor: "#ff0000",
    });

    const undone = editorReducer(styled, { type: "undo" });
    expect(undone.elements[0]?.strokeColor).toBe("#18202c");

    const redone = editorReducer(undone, { type: "redo" });
    expect(redone.elements[0]?.strokeColor).toBe("#ff0000");
  });

  it("clears future when a new undoable action runs after undo", () => {
    const first = editorReducer(initialEditorState, {
      type: "add-element",
      element: rectangle,
    });
    const second = editorReducer(first, {
      type: "add-element",
      element: { ...text, id: "text-2" },
    });
    const undone = editorReducer(second, { type: "undo" });

    expect(undone.history.future).toHaveLength(1);

    const moved = editorReducer(undone, {
      type: "update-element",
      elementId: rectangle.id,
      x: 200,
      y: 200,
    });

    expect(moved.history.future).toEqual([]);
    expect(moved.elements[0]).toMatchObject({ x: 200, y: 200 });
  });

  it(`keeps at most ${MAX_HISTORY} snapshots in past`, () => {
    let state = {
      ...initialEditorState,
      elements: [rectangle],
    };

    for (let index = 0; index < MAX_HISTORY + 3; index += 1) {
      state = editorReducer(state, {
        type: "update-element",
        elementId: rectangle.id,
        x: 101 + index,
        y: 80,
      });
    }

    expect(state.history.past).toHaveLength(MAX_HISTORY);
    expect(state.history.past[0]?.[0]).toMatchObject({ x: 103 });
  });

  it("does nothing on undo when past is empty", () => {
    const state = {
      ...initialEditorState,
      elements: [rectangle],
    };

    const next = editorReducer(state, { type: "undo" });

    expect(next).toBe(state);
  });

  it("does not push history for update-element-style with unknown elementId", () => {
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
    expect(next.history.past).toEqual([]);
  });
});
