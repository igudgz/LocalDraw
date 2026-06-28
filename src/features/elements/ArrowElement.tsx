import type { ArrowElement as ArrowElementType } from "./elementTypes";

type ArrowElementProps = {
  element: ArrowElementType;
};

export function ArrowElement({ element }: ArrowElementProps) {
  return (
    <line
      x1={element.startX}
      y1={element.startY}
      x2={element.endX}
      y2={element.endY}
      opacity={element.opacity}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
    />
  );
}
