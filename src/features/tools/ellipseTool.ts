import type { StyleDefaults } from "../editor/editorTypes";
import type { EllipseElement } from "../elements/elementTypes";
import type { CanvasPoint } from "../selection/selectionUtils";
import { createId } from "../../shared/utils/ids";

export const ellipseToolId = "ellipse";

const MIN_ELLIPSE_SIZE = 1;

export type EllipseDrawSession = {
  pointerId: number;
  startPoint: CanvasPoint;
};

export type NormalizedEllipseBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function createEllipseDrawSession(
  pointerId: number,
  startPoint: CanvasPoint,
): EllipseDrawSession {
  return {
    pointerId,
    startPoint,
  };
}

export function normalizeEllipseBounds(
  startPoint: CanvasPoint,
  endPoint: CanvasPoint,
): NormalizedEllipseBounds {
  const x = Math.min(startPoint.x, endPoint.x);
  const y = Math.min(startPoint.y, endPoint.y);
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);

  return { x, y, width, height };
}

export function getEllipsePreviewBounds(
  session: EllipseDrawSession,
  currentPoint: CanvasPoint,
): NormalizedEllipseBounds {
  return normalizeEllipseBounds(session.startPoint, currentPoint);
}

export function shouldCommitEllipse(bounds: NormalizedEllipseBounds): boolean {
  return bounds.width >= MIN_ELLIPSE_SIZE && bounds.height >= MIN_ELLIPSE_SIZE;
}

export function createEllipseElement(
  bounds: NormalizedEllipseBounds,
  styleDefaults: StyleDefaults,
): EllipseElement {
  const now = new Date().toISOString();

  return {
    id: createId("ellipse"),
    type: "ellipse",
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
