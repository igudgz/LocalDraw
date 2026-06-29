import type { CanvasPoint } from "../selection/selectionUtils";
import type { LocalDrawElement } from "../elements/elementTypes";
import {
  resizeElement,
  type ResizeHandleId,
} from "../elements/elementGeometry";

export type ResizeSession = {
  pointerId: number;
  elementId: string;
  handle: ResizeHandleId;
};

export function createResizeSession(
  pointerId: number,
  elementId: string,
  handle: ResizeHandleId,
): ResizeSession {
  return {
    pointerId,
    elementId,
    handle,
  };
}

export function getResizedElement(
  session: ResizeSession,
  element: LocalDrawElement,
  pointerPoint: CanvasPoint,
): LocalDrawElement {
  return resizeElement(element, session.handle, pointerPoint);
}
