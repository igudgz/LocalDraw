import { useEffect, useRef } from "react";
import type { ArrowElement } from "../elements/elementTypes";
import type { KeyboardEvent } from "react";

type ArrowLabelEditorOverlayProps = {
  element: ArrowElement;
  draftLabel: string;
  scrollX: number;
  scrollY: number;
  zoom: number;
  onDraftChange: (value: string) => void;
  onCommit: () => void;
};

export function ArrowLabelEditorOverlay({
  element,
  draftLabel,
  onCommit,
  onDraftChange,
  scrollX,
  scrollY,
  zoom,
}: ArrowLabelEditorOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const midX = (element.startX + element.endX) / 2;
  const midY = (element.startY + element.endY) / 2;

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.focus();
    input.select();
  }, [element.id]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onCommit();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onCommit();
    }
  };

  return (
    <input
      ref={inputRef}
      className="arrow-label-editor-overlay"
      aria-label="Edit arrow label"
      type="text"
      value={draftLabel}
      placeholder="Label (optional)"
      style={{
        left: (midX - scrollX) * zoom,
        top: (midY - scrollY) * zoom,
        transform: "translate(-50%, -50%)",
        color: element.strokeColor,
        fontSize: 14 * zoom,
        opacity: element.opacity,
      }}
      onBlur={onCommit}
      onChange={(event) => onDraftChange(event.target.value)}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
    />
  );
}
