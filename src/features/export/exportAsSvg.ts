import type { LocalDrawElement } from "../elements/elementTypes";
import { downloadBlob, sanitizeFileName } from "../../shared/utils/download";
import { elementsToSvgMarkup } from "./elementSvgMarkup";

export function exportAsSvg(elements: LocalDrawElement[]): string {
  return elementsToSvgMarkup(elements);
}

export function downloadSvgExport(
  elements: LocalDrawElement[],
  drawingName: string,
): void {
  const svg = exportAsSvg(elements);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const fileName = `${sanitizeFileName(drawingName)}.svg`;

  downloadBlob(blob, fileName);
}
