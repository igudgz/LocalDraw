import type { Bounds } from "../elements/elementGeometry";
import type { LocalDrawElement } from "../elements/elementTypes";

const DEFAULT_EXPORT_BOUNDS: Bounds = {
  x: 0,
  y: 0,
  width: 800,
  height: 600,
};

const EXPORT_PADDING = 16;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getElementBounds(element: LocalDrawElement): Bounds {
  switch (element.type) {
    case "rectangle":
    case "ellipse":
    case "text":
      return {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      };
    case "arrow": {
      const minX = Math.min(
        element.x,
        element.startX,
        element.endX,
        element.x + element.width,
      );
      const minY = Math.min(
        element.y,
        element.startY,
        element.endY,
        element.y + element.height,
      );
      const maxX = Math.max(
        element.x,
        element.startX,
        element.endX,
        element.x + element.width,
      );
      const maxY = Math.max(
        element.y,
        element.startY,
        element.endY,
        element.y + element.height,
      );

      return {
        x: minX,
        y: minY,
        width: Math.max(maxX - minX, 1),
        height: Math.max(maxY - minY, 1),
      };
    }
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}

export function getElementsBounds(elements: LocalDrawElement[]): Bounds {
  if (elements.length === 0) {
    return DEFAULT_EXPORT_BOUNDS;
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const element of elements) {
    const bounds = getElementBounds(element);
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  }

  return {
    x: minX - EXPORT_PADDING,
    y: minY - EXPORT_PADDING,
    width: Math.max(maxX - minX + EXPORT_PADDING * 2, 1),
    height: Math.max(maxY - minY + EXPORT_PADDING * 2, 1),
  };
}

export function elementToSvgMarkup(element: LocalDrawElement): string {
  switch (element.type) {
    case "rectangle":
      return `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" fill="${escapeXml(element.backgroundColor)}" opacity="${element.opacity}" stroke="${escapeXml(element.strokeColor)}" stroke-width="${element.strokeWidth}" />`;
    case "ellipse":
      return `<ellipse cx="${element.x + element.width / 2}" cy="${element.y + element.height / 2}" rx="${element.width / 2}" ry="${element.height / 2}" fill="${escapeXml(element.backgroundColor)}" opacity="${element.opacity}" stroke="${escapeXml(element.strokeColor)}" stroke-width="${element.strokeWidth}" />`;
    case "arrow":
      return `<line x1="${element.startX}" y1="${element.startY}" x2="${element.endX}" y2="${element.endY}" opacity="${element.opacity}" stroke="${escapeXml(element.strokeColor)}" stroke-width="${element.strokeWidth}" />`;
    case "text":
      return `<text x="${element.x}" y="${element.y}" fill="${escapeXml(element.strokeColor)}" font-family="${escapeXml(element.fontFamily)}" font-size="${element.fontSize}" opacity="${element.opacity}">${escapeXml(element.text)}</text>`;
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}

export function elementsToSvgMarkup(elements: LocalDrawElement[]): string {
  const bounds = getElementsBounds(elements);
  const body = elements.map(elementToSvgMarkup).join("\n  ");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}" width="${Math.ceil(bounds.width)}" height="${Math.ceil(bounds.height)}">`,
    `  <rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" fill="#fbfcfe" />`,
    `  ${body}`,
    "</svg>",
  ].join("\n");
}
