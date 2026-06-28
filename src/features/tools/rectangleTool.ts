import type { StyleDefaults } from "../editor/editorTypes";
import type { Bounds } from "../elements/elementGeometry";
import type { RectangleElement } from "../elements/elementTypes";
import { createId } from "../../shared/utils/ids";

export const rectangleToolId = "rectangle";

export type NormalizedRect = Bounds;

export function createRectangleElement(
  bounds: Bounds,
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
