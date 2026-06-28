import type { LocalDrawElement } from "../elements/elementTypes";
import { getElementBounds } from "../elements/elementGeometry";

export type SelectionId = string;

export type CanvasPoint = {
  x: number;
  y: number;
};

function isPointInRect(
  point: CanvasPoint,
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  return (
    point.x >= x &&
    point.x <= x + width &&
    point.y >= y &&
    point.y <= y + height
  );
}

function isPointInElement(
  point: CanvasPoint,
  element: LocalDrawElement,
): boolean {
  const bounds = getElementBounds(element);

  return isPointInRect(
    point,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
  );
}

export function hitTestElementAtPoint(
  elements: LocalDrawElement[],
  point: CanvasPoint,
): SelectionId | null {
  for (let index = elements.length - 1; index >= 0; index -= 1) {
    const element = elements[index];

    if (isPointInElement(point, element)) {
      return element.id;
    }
  }

  return null;
}

export function findElementById(
  elements: LocalDrawElement[],
  elementId: SelectionId,
): LocalDrawElement | undefined {
  return elements.find((element) => element.id === elementId);
}
