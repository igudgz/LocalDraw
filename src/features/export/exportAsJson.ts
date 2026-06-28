import type { DrawingDbRecord } from "../../shared/storage/indexedDb";
import { downloadBlob, sanitizeFileName } from "../../shared/utils/download";
import type { EditorState } from "../editor/editorTypes";
import { serializeDrawingRecord } from "../persistence/localDrawSerializer";

export function drawingRecordFromEditorState(
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

export function exportAsLocalDraw(record: DrawingDbRecord): void {
  const file = serializeDrawingRecord(record);
  const json = JSON.stringify(file, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const fileName = `${sanitizeFileName(record.name)}.localdraw`;

  downloadBlob(blob, fileName);
}
