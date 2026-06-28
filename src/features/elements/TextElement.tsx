import type { TextElement as TextElementType } from "./elementTypes";

type TextElementProps = {
  element: TextElementType;
};

export function TextElement({ element }: TextElementProps) {
  return (
    <text
      data-element-id={element.id}
      x={element.x}
      y={element.y}
      fill={element.strokeColor}
      fontFamily={element.fontFamily}
      fontSize={element.fontSize}
      opacity={element.opacity}
    >
      {element.text}
    </text>
  );
}
