import { describe, expect, it } from "vitest";
import type { LocalDrawElement } from "../elements/elementTypes";
import { initialEditorState } from "../editor/editorReducer";
import {
  drawingRecordToRestoreAction,
  editorStateToDrawingRecord,
} from "./drawingBridge";
import type { DrawingDbRecord } from "./drawingTypes";

const rectangle: LocalDrawElement = {
  id: "rect-1",
  type: "rectangle",
  x: 0,
  y: 0,
  width: 100,
  height: 50,
  rotation: 0,
  strokeColor: "#18202c",
  backgroundColor: "#ffffff",
  strokeWidth: 2,
  opacity: 1,
  createdAt: "2026-06-28T10:00:00.000Z",
  updatedAt: "2026-06-28T10:00:00.000Z",
};

describe("drawingBridge", () => {
  it("maps editor state to a drawing record", () => {
    const state = {
      ...initialEditorState,
      elements: [rectangle],
      currentDrawing: {
        id: "drawing-1",
        name: "Bridge test",
        createdAt: "2026-06-28T10:00:00.000Z",
        updatedAt: "2026-06-28T11:00:00.000Z",
      },
    };

    const record = editorStateToDrawingRecord(state, {
      description: "desc",
      tags: ["a"],
    });

    expect(record.id).toBe("drawing-1");
    expect(record.description).toBe("desc");
    expect(record.tags).toEqual(["a"]);
    expect(record.elements).toEqual([rectangle]);
  });

  it("maps a drawing record to restore-drawing action", () => {
    const record: DrawingDbRecord = {
      id: "drawing-2",
      name: "Loaded",
      tags: [],
      elements: [rectangle],
      viewport: { zoom: 2, scrollX: 5, scrollY: 10 },
      metadata: {
        createdAt: "2026-06-28T10:00:00.000Z",
        updatedAt: "2026-06-28T12:00:00.000Z",
      },
    };

    expect(drawingRecordToRestoreAction(record)).toEqual({
      type: "restore-drawing",
      drawing: {
        id: record.id,
        name: record.name,
        elements: record.elements,
        viewport: record.viewport,
        metadata: record.metadata,
      },
    });
  });
});
