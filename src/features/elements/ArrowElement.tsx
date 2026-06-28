import { ARROWHEAD_MARKER_ID } from "./elementGeometry";
import type { ArrowElement as ArrowElementType } from "./elementTypes";

type ArrowElementProps = {
  element: ArrowElementType;
};

export function ArrowElement({ element }: ArrowElementProps) {
  const midX = (element.startX + element.endX) / 2;
  const midY = (element.startY + element.endY) / 2;

  return (
    <g data-element-id={element.id}>
      <line
        x1={element.startX}
        y1={element.startY}
        x2={element.endX}
        y2={element.endY}
        opacity={element.opacity}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        markerEnd={`url(#${ARROWHEAD_MARKER_ID})`}
      />
      {element.label ? (
        <text
          x={midX}
          y={midY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={element.strokeColor}
          fontSize={14}
          opacity={element.opacity}
        >
          {element.label}
        </text>
      ) : null}
    </g>
  );
}
