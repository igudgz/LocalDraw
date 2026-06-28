import type { StyleDefaults } from "../editor/editorTypes";
import type { RectangleElement } from "../elements/elementTypes";
import type { CanvasPoint } from "../selection/selectionUtils";
import { createId } from "../../shared/utils/ids";

export const rectangleToolId = "rectangle";

const MIN_RECTANGLE_SIZE = 1;

export type RectangleDrawSession = {
  pointerId: number;
  startPoint: CanvasPoint;
};

export type NormalizedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function createRectangleDrawSession(
  pointerId: number,
  startPoint: CanvasPoint,
): RectangleDrawSession {
  return {
    pointerId,
    startPoint,
  };
}

export function normalizeRectangleBounds(
  startPoint: CanvasPoint,
  endPoint: CanvasPoint,
): NormalizedRect {
  const x = Math.min(startPoint.x, endPoint.x);
  const y = Math.min(startPoint.y, endPoint.y);
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);

  return { x, y, width, height };
}

export function getRectanglePreviewBounds(
  session: RectangleDrawSession,
  currentPoint: CanvasPoint,
): NormalizedRect {
  return normalizeRectangleBounds(session.startPoint, currentPoint);
}

export function shouldCommitRectangle(bounds: NormalizedRect): boolean {
  return (
    bounds.width >= MIN_RECTANGLE_SIZE && bounds.height >= MIN_RECTANGLE_SIZE
  );
}

export function createRectangleElement(
  bounds: NormalizedRect,
  styleDefaults: StyleDefaults,
): RectangleElement {
  const now = new Date().toISOString();

  return {
    id: createId("rectangle"),
    type: "rectangle",
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    rotation: 0,
    strokeColor: styleDefaults.strokeColor,
    backgroundColor: styleDefaults.backgroundColor,
    strokeWidth: styleDefaults.strokeWidth,
    opacity: styleDefaults.opacity,
    createdAt: now,
    updatedAt: now,
  };
}
