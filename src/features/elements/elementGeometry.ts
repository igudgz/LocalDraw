import type { EllipseElement, RectangleElement } from "./elementTypes";

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function elementCenter(bounds: Bounds): { x: number; y: number } {
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
}

export function isPointInRectangle(
  px: number,
  py: number,
  rect: RectangleElement,
): boolean {
  return (
    px >= rect.x &&
    px <= rect.x + rect.width &&
    py >= rect.y &&
    py <= rect.y + rect.height
  );
}

export function isPointInEllipse(
  px: number,
  py: number,
  ellipse: EllipseElement,
): boolean {
  const cx = ellipse.x + ellipse.width / 2;
  const cy = ellipse.y + ellipse.height / 2;
  const rx = ellipse.width / 2;
  const ry = ellipse.height / 2;

  if (rx === 0 || ry === 0) {
    return false;
  }

  const dx = (px - cx) / rx;
  const dy = (py - cy) / ry;

  return dx * dx + dy * dy <= 1;
}

export function isPointInShape(
  px: number,
  py: number,
  element: RectangleElement | EllipseElement,
): boolean {
  switch (element.type) {
    case "rectangle":
      return isPointInRectangle(px, py, element);
    case "ellipse":
      return isPointInEllipse(px, py, element);
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}
