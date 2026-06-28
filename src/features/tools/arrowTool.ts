import type { StyleDefaults } from "../editor/editorTypes";
import {
  normalizeBoundsFromDrag,
  type Bounds,
} from "../elements/elementGeometry";
import type { ArrowElement } from "../elements/elementTypes";
import type { CanvasPoint } from "../selection/selectionUtils";
import { createId } from "../../shared/utils/ids";

export const arrowToolId = "arrow";

const MIN_ARROW_LENGTH = 1;

export type NormalizedArrowLine = Bounds & {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export function normalizeArrowLine(
  startPoint: CanvasPoint,
  endPoint: CanvasPoint,
): NormalizedArrowLine {
  const bounds = normalizeBoundsFromDrag(startPoint, endPoint);

  return {
    startX: startPoint.x,
    startY: startPoint.y,
    endX: endPoint.x,
    endY: endPoint.y,
    ...bounds,
  };
}

export function shouldCommitArrowLine(line: NormalizedArrowLine): boolean {
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
