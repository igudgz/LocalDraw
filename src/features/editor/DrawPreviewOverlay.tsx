import type { StyleDefaults } from "./editorTypes";
import {
  ARROWHEAD_MARKER_ID,
  boundsToEllipseCenter,
} from "../elements/elementGeometry";
import type { DrawPreview } from "../tools/dragDrawTool";

export { ARROWHEAD_MARKER_ID };

type DrawPreviewOverlayProps = {
  preview: DrawPreview;
  styleDefaults: StyleDefaults;
};

export function DrawPreviewOverlay({
  preview,
  styleDefaults,
}: DrawPreviewOverlayProps) {
  const dash = "6 4";

  if (preview.kind === "bounds") {
    const { bounds, shape } = preview;

    if (shape === "ellipse") {
      const { cx, cy, rx, ry } = boundsToEllipseCenter(bounds);

      return (
        <ellipse
          className="ellipse-preview"
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={styleDefaults.backgroundColor}
          opacity={styleDefaults.opacity}
          stroke={styleDefaults.strokeColor}
          strokeWidth={styleDefaults.strokeWidth}
          strokeDasharray={dash}
          pointerEvents="none"
        />
      );
    }

    return (
      <rect
        className="rectangle-preview"
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
        fill={styleDefaults.backgroundColor}
        opacity={styleDefaults.opacity}
        stroke={styleDefaults.strokeColor}
        strokeWidth={styleDefaults.strokeWidth}
        strokeDasharray={dash}
        pointerEvents="none"
      />
    );
  }

  const { line } = preview;

  return (
    <line
      className="arrow-preview"
      x1={line.startX}
      y1={line.startY}
      x2={line.endX}
      y2={line.endY}
      stroke={styleDefaults.strokeColor}
      strokeWidth={styleDefaults.strokeWidth}
      opacity={styleDefaults.opacity}
      strokeDasharray={dash}
      pointerEvents="none"
    />
  );
}

export function SharedArrowheadMarker() {
  return (
    <marker
      id={ARROWHEAD_MARKER_ID}
      markerWidth="10"
      markerHeight="10"
      refX="9"
      refY="5"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path d="M0,0 L10,5 L0,10" fill="context-stroke" />
    </marker>
  );
}
