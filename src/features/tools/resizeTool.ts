import type { ResizeHandleId } from "../elements/elementGeometry";

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
