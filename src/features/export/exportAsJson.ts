import type { DrawingDbRecord } from "../persistence/drawingTypes";
import { downloadBlob, sanitizeFileName } from "../../shared/utils/download";
import { serializeDrawingRecord } from "../persistence/localDrawSerializer";

export { editorStateToDrawingRecord } from "../persistence/drawingBridge";

export function exportAsLocalDraw(record: DrawingDbRecord): void {
  const file = serializeDrawingRecord(record);
  const json = JSON.stringify(file, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const fileName = `${sanitizeFileName(record.name)}.localdraw`;

  downloadBlob(blob, fileName);
}
