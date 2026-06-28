import type { EllipseElement as EllipseElementType } from "./elementTypes";

type EllipseElementProps = {
  element: EllipseElementType;
};

export function EllipseElement({ element }: EllipseElementProps) {
  return (
    <ellipse
      data-element-id={element.id}
      cx={element.x + element.width / 2}
      cy={element.y + element.height / 2}
      rx={element.width / 2}
      ry={element.height / 2}
      fill={element.backgroundColor}
      opacity={element.opacity}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
    />
  );
}
