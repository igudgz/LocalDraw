import type { LocalDrawElement } from "../elements/elementTypes";

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
  switch (element.type) {
    case "rectangle":
    case "ellipse":
    case "text":
    case "arrow":
      return isPointInRect(
        point,
        element.x,
        element.y,
        element.width,
        element.height,
      );
    default: {
      const _exhaustive: never = element;
      return false;
    }
  }
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
