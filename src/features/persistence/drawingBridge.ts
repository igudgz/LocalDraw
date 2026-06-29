import type { EditorAction } from "../editor/editorActions";
import type { EditorState } from "../editor/editorTypes";
import type { DrawingDbRecord } from "./drawingTypes";

export function editorStateToDrawingRecord(
  state: EditorState,
  existing?: Pick<DrawingDbRecord, "description" | "tags"> | null,
): DrawingDbRecord {
  const updatedAt = new Date().toISOString();

  return {
    id: state.currentDrawing.id,
    name: state.currentDrawing.name,
    description: existing?.description,
    tags: existing?.tags ?? [],
    elements: structuredClone(state.elements),
    viewport: {
      zoom: state.viewport.zoom,
      scrollX: state.viewport.scrollX,
      scrollY: state.viewport.scrollY,
    },
    metadata: {
      createdAt: state.currentDrawing.createdAt,
      updatedAt,
    },
  };
}

export function drawingRecordToRestoreAction(
  record: DrawingDbRecord,
): EditorAction {
  return {
    type: "restore-drawing",
    drawing: {
      id: record.id,
      name: record.name,
      elements: record.elements,
      viewport: record.viewport,
      metadata: record.metadata,
    },
  };
}
