import type { StyleDefaults } from "../editor/editorTypes";
import type { Bounds } from "../elements/elementGeometry";
import type { EllipseElement } from "../elements/elementTypes";
import { createId } from "../../shared/utils/ids";

export const ellipseToolId = "ellipse";

export type NormalizedEllipseBounds = Bounds;

export function createEllipseElement(
  bounds: Bounds,
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
