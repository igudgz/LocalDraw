import type { RectangleElement as RectangleElementType } from "./elementTypes";

type RectangleElementProps = {
  element: RectangleElementType;
};

export function RectangleElement({ element }: RectangleElementProps) {
  return (
    <rect
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      fill={element.backgroundColor}
      opacity={element.opacity}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
    />
  );
}
