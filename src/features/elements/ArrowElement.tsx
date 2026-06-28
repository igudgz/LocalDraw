import type { ArrowElement as ArrowElementType } from "./elementTypes";

type ArrowElementProps = {
  element: ArrowElementType;
};

export function ArrowElement({ element }: ArrowElementProps) {
  const markerId = `arrowhead-${element.id}`;
  const midX = (element.startX + element.endX) / 2;
  const midY = (element.startY + element.endY) / 2;

  return (
    <g data-element-id={element.id}>
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L10,5 L0,10" fill={element.strokeColor} />
        </marker>
      </defs>
      <line
        x1={element.startX}
        y1={element.startY}
        x2={element.endX}
        y2={element.endY}
        opacity={element.opacity}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        markerEnd={`url(#${markerId})`}
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
