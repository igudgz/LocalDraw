import type { StyleDefaults } from "../editor/editorTypes";
import { estimateTextBounds } from "../elements/elementGeometry";
import type { TextElement } from "../elements/elementTypes";
import type { CanvasPoint } from "../selection/selectionUtils";
import { createId } from "../../shared/utils/ids";

export const textToolId = "text";

export const DEFAULT_TEXT = "Text";

export function createTextElement(
  point: CanvasPoint,
  styleDefaults: StyleDefaults,
): TextElement {
  const now = new Date().toISOString();
  const { width, height } = estimateTextBounds(
    DEFAULT_TEXT,
    styleDefaults.fontSize,
  );

  return {
    id: createId("text"),
    type: "text",
    x: point.x,
    y: point.y,
    width,
    height,
    rotation: 0,
    strokeColor: styleDefaults.strokeColor,
    backgroundColor: styleDefaults.backgroundColor,
    strokeWidth: styleDefaults.strokeWidth,
    opacity: styleDefaults.opacity,
    fontSize: styleDefaults.fontSize,
    fontFamily: styleDefaults.fontFamily,
    text: DEFAULT_TEXT,
    createdAt: now,
    updatedAt: now,
  };
}
