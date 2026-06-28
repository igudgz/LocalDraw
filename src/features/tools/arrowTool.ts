import type { StyleDefaults } from "../editor/editorTypes";
import type { ArrowElement } from "../elements/elementTypes";
import type { CanvasPoint } from "../selection/selectionUtils";
import { createId } from "../../shared/utils/ids";

export const arrowToolId = "arrow";

const MIN_ARROW_LENGTH = 1;

export type ArrowDrawSession = {
  pointerId: number;
  startPoint: CanvasPoint;
};

export type NormalizedArrowLine = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function createArrowDrawSession(
  pointerId: number,
  startPoint: CanvasPoint,
): ArrowDrawSession {
  return {
    pointerId,
    startPoint,
  };
}

export function normalizeArrowLine(
  startPoint: CanvasPoint,
  endPoint: CanvasPoint,
): NormalizedArrowLine {
  const startX = startPoint.x;
  const startY = startPoint.y;
  const endX = endPoint.x;
  const endY = endPoint.y;
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  return { startX, startY, endX, endY, x, y, width, height };
}

export function getArrowPreviewLine(
  session: ArrowDrawSession,
  currentPoint: CanvasPoint,
): NormalizedArrowLine {
  return normalizeArrowLine(session.startPoint, currentPoint);
}

export function shouldCommitArrow(line: NormalizedArrowLine): boolean {
  const length = Math.hypot(line.endX - line.startX, line.endY - line.startY);
  return length >= MIN_ARROW_LENGTH;
}

export function createArrowElement(
  line: NormalizedArrowLine,
  styleDefaults: StyleDefaults,
): ArrowElement {
  const now = new Date().toISOString();

  return {
    id: createId("arrow"),
    type: "arrow",
    x: line.x,
    y: line.y,
    width: line.width,
    height: line.height,
    startX: line.startX,
    startY: line.startY,
    endX: line.endX,
    endY: line.endY,
    rotation: 0,
    strokeColor: styleDefaults.strokeColor,
    backgroundColor: styleDefaults.backgroundColor,
    strokeWidth: styleDefaults.strokeWidth,
    opacity: styleDefaults.opacity,
    createdAt: now,
    updatedAt: now,
  };
}
