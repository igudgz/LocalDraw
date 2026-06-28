import type { LocalDrawElement } from "../elements/elementTypes";
import { getElementBounds } from "../elements/elementGeometry";

type SelectionBoxProps = {
  element: LocalDrawElement;
};

const SELECTION_PADDING = 4;

export function SelectionBox({ element }: SelectionBoxProps) {
  const bounds = getElementBounds(element);

  return (
    <rect
      className="selection-box"
      x={bounds.x - SELECTION_PADDING}
      y={bounds.y - SELECTION_PADDING}
      width={bounds.width + SELECTION_PADDING * 2}
      height={bounds.height + SELECTION_PADDING * 2}
      pointerEvents="none"
    />
  );
}
