import type { PointerEvent } from "react";
import {
  getElementBounds,
  getResizeHandles,
  type ResizeHandleId,
} from "../elements/elementGeometry";
import type { LocalDrawElement } from "../elements/elementTypes";

const SELECTION_PADDING = 4;
const HANDLE_RADIUS = 5;
type SelectionBoxProps = {
  element: LocalDrawElement;
  onHandlePointerDown?: (
    handle: ResizeHandleId,
    event: PointerEvent<SVGCircleElement>,
  ) => void;
};

export function SelectionBox({
  element,
  onHandlePointerDown,
}: SelectionBoxProps) {
  const bounds = getElementBounds(element);
  const handles = getResizeHandles(element);

  return (
    <g className="selection-box-group">
      <rect
        className="selection-box"
        x={bounds.x - SELECTION_PADDING}
        y={bounds.y - SELECTION_PADDING}
        width={bounds.width + SELECTION_PADDING * 2}
        height={bounds.height + SELECTION_PADDING * 2}
        pointerEvents="none"
      />
      {handles.map((handle) => (
        <circle
          key={handle.id}
          className={`resize-handle resize-handle-${handle.id}`}
          cx={handle.x}
          cy={handle.y}
          r={HANDLE_RADIUS}
          data-handle={handle.id}
          pointerEvents="all"
          onPointerDown={(event) => {
            onHandlePointerDown?.(handle.id, event);
          }}
        />
      ))}
    </g>
  );
}
