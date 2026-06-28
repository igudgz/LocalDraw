import type {
  ArrowElement,
  EllipseElement,
  LocalDrawElement,
  RectangleElement,
  TextElement,
} from "../elements/elementTypes";

const BASE_ELEMENT = {
  x: 0,
  y: 0,
  width: 120,
  height: 80,
  rotation: 0,
  strokeColor: "#18202c",
  backgroundColor: "#ffffff",
  strokeWidth: 2,
  opacity: 1,
  createdAt: "2026-06-28T00:00:00.000Z",
  updatedAt: "2026-06-28T00:00:00.000Z",
} as const;

export function rectangle(
  id: string,
  overrides: Partial<Omit<RectangleElement, "id" | "type">> = {},
): RectangleElement {
  return {
    ...BASE_ELEMENT,
    id,
    type: "rectangle",
    ...overrides,
  };
}

export function ellipse(
  id: string,
  overrides: Partial<Omit<EllipseElement, "id" | "type">> = {},
): EllipseElement {
  return {
    ...BASE_ELEMENT,
    id,
    type: "ellipse",
    ...overrides,
  };
}

export function arrow(
  id: string,
  overrides: Partial<Omit<ArrowElement, "id" | "type">> = {},
): ArrowElement {
  return {
    ...BASE_ELEMENT,
    id,
    type: "arrow",
    startX: 0,
    startY: 0,
    endX: 100,
    endY: 0,
    ...overrides,
  };
}

export function textElement(
  id: string,
  text: string,
  overrides: Partial<Omit<TextElement, "id" | "type" | "text">> = {},
): TextElement {
  return {
    ...BASE_ELEMENT,
    id,
    type: "text",
    text,
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    ...overrides,
  };
}

export function diagramElements(
  ...elements: LocalDrawElement[]
): LocalDrawElement[] {
  return elements;
}
