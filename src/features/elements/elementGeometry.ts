import type { CanvasPoint } from "../selection/selectionUtils";
import type {
  ArrowElement,
  EllipseElement,
  LocalDrawElement,
  RectangleElement,
  TextElement,
} from "./elementTypes";

export const ARROWHEAD_MARKER_ID = "localdraw-arrowhead";
export const MIN_ELEMENT_SIZE = 1;

export type CornerHandleId = "nw" | "ne" | "sw" | "se";
export type ArrowHandleId = "start" | "end";
export type ResizeHandleId = CornerHandleId | ArrowHandleId;

export type ResizeHandle = {
  id: ResizeHandleId;
  x: number;
  y: number;
};

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

export function enforceMinBounds(bounds: Bounds, minSize = MIN_ELEMENT_SIZE): Bounds {
  return {
    x: bounds.x,
    y: bounds.y,
    width: Math.max(minSize, bounds.width),
    height: Math.max(minSize, bounds.height),
  };
}

function isCornerHandle(handle: ResizeHandleId): handle is CornerHandleId {
  return handle !== "start" && handle !== "end";
}

function isArrowHandle(handle: ResizeHandleId): handle is ArrowHandleId {
  return handle === "start" || handle === "end";
}

function getOppositeCorner(bounds: Bounds, handle: CornerHandleId): CanvasPoint {
  switch (handle) {
    case "nw":
      return { x: bounds.x + bounds.width, y: bounds.y + bounds.height };
    case "ne":
      return { x: bounds.x, y: bounds.y + bounds.height };
    case "sw":
      return { x: bounds.x + bounds.width, y: bounds.y };
    case "se":
      return { x: bounds.x, y: bounds.y };
    default: {
      const _exhaustive: never = handle;
      return _exhaustive;
    }
  }
}

function resizeBoundsFromCornerHandle(
  bounds: Bounds,
  handle: CornerHandleId,
  pointerPoint: CanvasPoint,
): Bounds {
  const anchor = getOppositeCorner(bounds, handle);
  return enforceMinBounds(normalizeBoundsFromDrag(anchor, pointerPoint));
}

function applyBoxBounds<T extends RectangleElement | EllipseElement>(
  element: T,
  bounds: Bounds,
  updatedAt: string,
): T {
  return {
    ...element,
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    updatedAt,
  };
}

function boundsFromArrowEndpoints(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): Pick<ArrowElement, "x" | "y" | "width" | "height"> {
  const bounds = normalizeBoundsFromDrag(
    { x: startX, y: startY },
    { x: endX, y: endY },
  );

  return enforceMinBounds(bounds);
}

export function getResizeHandles(element: LocalDrawElement): ResizeHandle[] {
  switch (element.type) {
    case "rectangle":
    case "ellipse":
    case "text": {
      const bounds = getElementBounds(element);

      return [
        { id: "nw", x: bounds.x, y: bounds.y },
        { id: "ne", x: bounds.x + bounds.width, y: bounds.y },
        { id: "sw", x: bounds.x, y: bounds.y + bounds.height },
        { id: "se", x: bounds.x + bounds.width, y: bounds.y + bounds.height },
      ];
    }
    case "arrow":
      return [
        { id: "start", x: element.startX, y: element.startY },
        { id: "end", x: element.endX, y: element.endY },
      ];
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}

export function resizeElement(
  element: LocalDrawElement,
  handle: ResizeHandleId,
  pointerPoint: CanvasPoint,
): LocalDrawElement {
  const updatedAt = new Date().toISOString();

  switch (element.type) {
    case "rectangle":
    case "ellipse": {
      if (!isCornerHandle(handle)) {
        return element;
      }

      const bounds = resizeBoundsFromCornerHandle(
        getElementBounds(element),
        handle,
        pointerPoint,
      );

      return applyBoxBounds(element, bounds, updatedAt);
    }
    case "text": {
      if (!isCornerHandle(handle)) {
        return element;
      }

      const bounds = resizeBoundsFromCornerHandle(
        getElementBounds(element),
        handle,
        pointerPoint,
      );

      return applyTextBounds(element, bounds, updatedAt);
    }
    case "arrow": {
      if (!isArrowHandle(handle)) {
        return element;
      }

      const startPoint =
        handle === "start"
          ? pointerPoint
          : { x: element.startX, y: element.startY };
      const endPoint =
        handle === "end"
          ? pointerPoint
          : { x: element.endX, y: element.endY };
      const box = boundsFromArrowEndpoints(
        startPoint.x,
        startPoint.y,
        endPoint.x,
        endPoint.y,
      );

      return {
        ...element,
        ...box,
        startX: startPoint.x,
        startY: startPoint.y,
        endX: endPoint.x,
        endY: endPoint.y,
        updatedAt,
      };
    }
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}

function applyTextBounds(
  element: TextElement,
  bounds: Bounds,
  updatedAt: string,
): TextElement {
  return {
    ...element,
    x: bounds.x,
    y: bounds.y + bounds.height,
    width: bounds.width,
    height: bounds.height,
    updatedAt,
  };
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

export function elementCenter(bounds: Bounds): { x: number; y: number } {
  const { cx, cy } = boundsToEllipseCenter(bounds);
  return { x: cx, y: cy };
}

export function isPointInRectangle(
  px: number,
  py: number,
  rect: RectangleElement,
): boolean {
  return (
    px >= rect.x &&
    px <= rect.x + rect.width &&
    py >= rect.y &&
    py <= rect.y + rect.height
  );
}

export function isPointInEllipse(
  px: number,
  py: number,
  ellipse: EllipseElement,
): boolean {
  const { cx, cy, rx, ry } = boundsToEllipseCenter(ellipse);

  if (rx === 0 || ry === 0) {
    return false;
  }

  const dx = (px - cx) / rx;
  const dy = (py - cy) / ry;

  return dx * dx + dy * dy <= 1;
}

export function isPointInShape(
  px: number,
  py: number,
  element: RectangleElement | EllipseElement,
): boolean {
  switch (element.type) {
    case "rectangle":
      return isPointInRectangle(px, py, element);
    case "ellipse":
      return isPointInEllipse(px, py, element);
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}
