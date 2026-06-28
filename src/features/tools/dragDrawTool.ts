import type { StyleDefaults } from "../editor/editorTypes";
import {
  normalizeBoundsFromDrag,
  type Bounds,
} from "../elements/elementGeometry";
import type { LocalDrawElement } from "../elements/elementTypes";
import type { CanvasPoint } from "../selection/selectionUtils";
import {
  arrowToolId,
  createArrowElement,
  normalizeArrowLine,
  shouldCommitArrowLine,
  type NormalizedArrowLine,
} from "./arrowTool";
import { createEllipseElement, ellipseToolId } from "./ellipseTool";
import { createRectangleElement, rectangleToolId } from "./rectangleTool";

export type DragDrawToolId =
  | typeof rectangleToolId
  | typeof ellipseToolId
  | typeof arrowToolId;

export type DragDrawSession = {
  toolId: DragDrawToolId;
  pointerId: number;
  startPoint: CanvasPoint;
};

export type DrawPreview =
  | {
      kind: "bounds";
      bounds: Bounds;
      shape: "rectangle" | "ellipse";
    }
  | { kind: "line"; line: NormalizedArrowLine };

const MIN_BOUNDS_SIZE = 1;

export function isDragDrawToolId(toolId: string): toolId is DragDrawToolId {
  return (
    toolId === rectangleToolId ||
    toolId === ellipseToolId ||
    toolId === arrowToolId
  );
}

export function createDragDrawSession(
  toolId: DragDrawToolId,
  pointerId: number,
  startPoint: CanvasPoint,
): DragDrawSession {
  return { toolId, pointerId, startPoint };
}

export function getDrawPreview(
  session: DragDrawSession,
  currentPoint: CanvasPoint,
): DrawPreview {
  switch (session.toolId) {
    case rectangleToolId:
      return {
        kind: "bounds",
        bounds: normalizeBoundsFromDrag(session.startPoint, currentPoint),
        shape: "rectangle",
      };
    case ellipseToolId:
      return {
        kind: "bounds",
        bounds: normalizeBoundsFromDrag(session.startPoint, currentPoint),
        shape: "ellipse",
      };
    case arrowToolId:
      return {
        kind: "line",
        line: normalizeArrowLine(session.startPoint, currentPoint),
      };
    default: {
      const _exhaustive: never = session.toolId;
      return _exhaustive;
    }
  }
}

export function shouldCommitDrawPreview(preview: DrawPreview): boolean {
  switch (preview.kind) {
    case "bounds":
      return (
        preview.bounds.width >= MIN_BOUNDS_SIZE &&
        preview.bounds.height >= MIN_BOUNDS_SIZE
      );
    case "line":
      return shouldCommitArrowLine(preview.line);
    default: {
      const _exhaustive: never = preview;
      return _exhaustive;
    }
  }
}

export function createElementFromDrawSession(
  session: DragDrawSession,
  preview: DrawPreview,
  styleDefaults: StyleDefaults,
): LocalDrawElement {
  switch (session.toolId) {
    case rectangleToolId:
      if (preview.kind !== "bounds") {
        throw new Error("Rectangle draw expects bounds preview");
      }
      return createRectangleElement(preview.bounds, styleDefaults);
    case ellipseToolId:
      if (preview.kind !== "bounds") {
        throw new Error("Ellipse draw expects bounds preview");
      }
      return createEllipseElement(preview.bounds, styleDefaults);
    case arrowToolId:
      if (preview.kind !== "line") {
        throw new Error("Arrow draw expects line preview");
      }
      return createArrowElement(preview.line, styleDefaults);
    default: {
      const _exhaustive: never = session.toolId;
      return _exhaustive;
    }
  }
}
