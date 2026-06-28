import type { LocalDrawElement } from "../elements/elementTypes";

type SelectionBoxProps = {
  element: LocalDrawElement;
};

const SELECTION_PADDING = 4;

export function SelectionBox({ element }: SelectionBoxProps) {
  return (
    <rect
      className="selection-box"
      x={element.x - SELECTION_PADDING}
      y={element.y - SELECTION_PADDING}
      width={element.width + SELECTION_PADDING * 2}
      height={element.height + SELECTION_PADDING * 2}
      pointerEvents="none"
    />
  );
}
