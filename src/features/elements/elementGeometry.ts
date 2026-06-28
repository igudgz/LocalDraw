import type { CanvasPoint } from "../selection/selectionUtils";
import type { LocalDrawElement } from "./elementTypes";

export const ARROWHEAD_MARKER_ID = "localdraw-arrowhead";

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const MIN_TEXT_WIDTH_FACTOR = 2;
const CHAR_WIDTH_FACTOR = 0.6;
const LINE_HEIGHT_FACTOR = 1.2;

export function normalizeBoundsFromDrag(
  startPoint: CanvasPoint,
  endPoint: CanvasPoint,
): Bounds {
  const x = Math.min(startPoint.x, endPoint.x);
  const y = Math.min(startPoint.y, endPoint.y);
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);

  return { x, y, width, height };
}

export function estimateTextBounds(
  text: string,
  fontSize: number,
): { width: number; height: number } {
  const width = Math.max(
    fontSize * MIN_TEXT_WIDTH_FACTOR,
    text.length * fontSize * CHAR_WIDTH_FACTOR,
  );
  const height = fontSize * LINE_HEIGHT_FACTOR;

  return { width, height };
}

/** Top-left bounding box used for hit-testing, selection, and overlays. */
export function getElementBounds(element: LocalDrawElement): Bounds {
  switch (element.type) {
    case "rectangle":
    case "ellipse":
    case "arrow":
      return {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      };
    case "text":
      return {
        x: element.x,
        y: element.y - element.height,
        width: element.width,
        height: element.height,
      };
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}

export function translateElementTo(
  element: LocalDrawElement,
  x: number,
  y: number,
): LocalDrawElement {
  const deltaX = x - element.x;
  const deltaY = y - element.y;
  const updatedAt = new Date().toISOString();

  switch (element.type) {
    case "rectangle":
    case "ellipse":
    case "text":
      return { ...element, x, y, updatedAt };
    case "arrow":
      return {
        ...element,
        x,
        y,
        startX: element.startX + deltaX,
        startY: element.startY + deltaY,
        endX: element.endX + deltaX,
        endY: element.endY + deltaY,
        updatedAt,
      };
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}

export function boundsToEllipseCenter(bounds: Bounds) {
  return {
    cx: bounds.x + bounds.width / 2,
    cy: bounds.y + bounds.height / 2,
    rx: bounds.width / 2,
    ry: bounds.height / 2,
  };
}
