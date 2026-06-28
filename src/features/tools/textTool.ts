import type { StyleDefaults } from "../editor/editorTypes";
import type { TextElement } from "../elements/elementTypes";
import type { CanvasPoint } from "../selection/selectionUtils";
import { createId } from "../../shared/utils/ids";

export const textToolId = "text";

export const DEFAULT_TEXT = "Text";

const MIN_TEXT_WIDTH_FACTOR = 2;
const CHAR_WIDTH_FACTOR = 0.6;
const LINE_HEIGHT_FACTOR = 1.2;

export function estimateTextBounds(
  text: string,
  fontSize: number,
): { width: number; height: number } {
  const width = Math.max(
    fontSize * MIN_TEXT_WIDTH_FACTOR,
    text.length * fontSize * CHAR_WIDTH_FACTOR,
  );
  const height = fontSize * LINE_HEIGHT_FACTOR;

  return { width, height };
}

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
