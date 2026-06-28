export type LocalDrawElement =
  | RectangleElement
  | EllipseElement
  | ArrowElement
  | TextElement;

export type BaseElement = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  opacity: number;
  createdAt: string;
  updatedAt: string;
};

export type RectangleElement = BaseElement & {
  type: "rectangle";
  text?: string;
};

export type EllipseElement = BaseElement & {
  type: "ellipse";
  text?: string;
};

export type ArrowElement = BaseElement & {
  type: "arrow";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  label?: string;
  startBindingId?: string;
  endBindingId?: string;
};

export type TextElement = BaseElement & {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
};
