import type { CanvasPoint } from "../selection/selectionUtils";

export const selectToolId = "select";

export type SelectDragSession = {
  pointerId: number;
  elementId: string;
  startCanvasPoint: CanvasPoint;
  elementStartX: number;
  elementStartY: number;
};

export function createSelectDragSession(
  pointerId: number,
  elementId: string,
  startCanvasPoint: CanvasPoint,
  elementStartX: number,
  elementStartY: number,
): SelectDragSession {
  return {
    pointerId,
    elementId,
    startCanvasPoint,
    elementStartX,
    elementStartY,
  };
}

export function getDraggedElementPosition(
  session: SelectDragSession,
  currentCanvasPoint: CanvasPoint,
): { x: number; y: number } {
  const deltaX = currentCanvasPoint.x - session.startCanvasPoint.x;
  const deltaY = currentCanvasPoint.y - session.startCanvasPoint.y;

  return {
    x: session.elementStartX + deltaX,
    y: session.elementStartY + deltaY,
  };
}
