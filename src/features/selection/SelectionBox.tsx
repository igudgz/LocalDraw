import type { LocalDrawElement } from "../elements/elementTypes";

type SelectionBoxProps = {
  element: LocalDrawElement;
};

const SELECTION_PADDING = 4;

function getSelectionBounds(element: LocalDrawElement) {
  if (element.type === "text") {
    return {
      x: element.x - SELECTION_PADDING,
      y: element.y - element.height - SELECTION_PADDING,
      width: element.width + SELECTION_PADDING * 2,
      height: element.height + SELECTION_PADDING * 2,
    };
  }

  return {
    x: element.x - SELECTION_PADDING,
    y: element.y - SELECTION_PADDING,
    width: element.width + SELECTION_PADDING * 2,
    height: element.height + SELECTION_PADDING * 2,
  };
}

export function SelectionBox({ element }: SelectionBoxProps) {
  const bounds = getSelectionBounds(element);

  return (
    <rect
      className="selection-box"
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      pointerEvents="none"
    />
  );
}
