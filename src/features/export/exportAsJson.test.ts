import { describe, expect, it, vi } from "vitest";
import type { DrawingDbRecord } from "../persistence/drawingTypes";
import type { LocalDrawElement } from "../elements/elementTypes";
import { editorStateToDrawingRecord, exportAsLocalDraw } from "./exportAsJson";
import type { EditorState } from "../editor/editorTypes";
import { initialEditorState } from "../editor/editorReducer";

const rectangle: LocalDrawElement = {
  id: "rect-1",
  type: "rectangle",
  x: 0,
  y: 0,
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

const sampleRecord: DrawingDbRecord = {
  id: "drawing-1",
  name: "Service map",
  description: "Core services",
  tags: ["architecture"],
  elements: [rectangle],
  viewport: {
    zoom: 1.5,
    scrollX: 40,
    scrollY: 60,
  },
  metadata: {
    createdAt: "2026-06-28T10:00:00.000Z",
    updatedAt: "2026-06-28T11:00:00.000Z",
  },
};

describe("exportAsJson", () => {
  it("builds a drawing record from editor state", () => {
    const state: EditorState = {
      ...initialEditorState,
      elements: [rectangle],
      currentDrawing: {
        id: "drawing-1",
        name: "Service map",
        createdAt: "2026-06-28T10:00:00.000Z",
        updatedAt: "2026-06-28T11:00:00.000Z",
      },
      viewport: {
        ...initialEditorState.viewport,
        zoom: 1.5,
        scrollX: 40,
        scrollY: 60,
      },
    };

    const record = editorStateToDrawingRecord(state, {
      description: "Core services",
      tags: ["architecture"],
    });

    expect(record.id).toBe("drawing-1");
    expect(record.name).toBe("Service map");
    expect(record.description).toBe("Core services");
    expect(record.tags).toEqual(["architecture"]);
    expect(record.elements).toEqual([rectangle]);
    expect(record.viewport).toEqual({
      zoom: 1.5,
      scrollX: 40,
      scrollY: 60,
    });
  });

  it("downloads a valid LocalDrawFile v1 payload (REQ-001)", () => {
    const createObjectURL = vi.fn(() => "blob:localdraw");
    const revokeObjectURL = vi.fn();
    const click = vi.fn();

    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    });

    vi.spyOn(document, "createElement").mockReturnValue({
      click,
      href: "",
      download: "",
      rel: "",
    } as HTMLAnchorElement);

    exportAsLocalDraw(sampleRecord);

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe("application/json");
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:localdraw");

    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
});
