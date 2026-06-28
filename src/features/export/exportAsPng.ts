import type { LocalDrawElement } from "../elements/elementTypes";
import { downloadBlob, sanitizeFileName } from "../../shared/utils/download";
import { exportAsSvg } from "./exportAsSvg";
import { getElementsBounds } from "./elementSvgMarkup";

export async function exportAsPngBlob(
  elements: LocalDrawElement[],
): Promise<Blob> {
  const svg = exportAsSvg(elements);
  const bounds = getElementsBounds(elements);
  const width = Math.max(1, Math.ceil(bounds.width));
  const height = Math.max(1, Math.ceil(bounds.height));

  return new Promise((resolve, reject) => {
    const image = new Image();
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(svgBlob);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas context is unavailable"));
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create PNG blob"));
          return;
        }

        resolve(blob);
      }, "image/png");
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to render SVG for PNG export"));
    };

    image.src = objectUrl;
  });
}

export async function downloadPngExport(
  elements: LocalDrawElement[],
  drawingName: string,
): Promise<void> {
  const blob = await exportAsPngBlob(elements);
  const fileName = `${sanitizeFileName(drawingName)}.png`;

  downloadBlob(blob, fileName);
}
