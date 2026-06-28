import { describe, expect, it } from "vitest";
import { editorReducer, initialEditorState } from "../editor/editorReducer";

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
