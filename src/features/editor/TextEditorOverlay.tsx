import { useEffect, useRef } from "react";
import { getElementBounds } from "../elements/elementGeometry";
import type { TextElement } from "../elements/elementTypes";
import type { KeyboardEvent } from "react";

type TextEditorOverlayProps = {
  element: TextElement;
  draftText: string;
  scrollX: number;
  scrollY: number;
  zoom: number;
  onDraftChange: (value: string) => void;
  onCommit: () => void;
};

export function TextEditorOverlay({
  element,
  draftText,
  onCommit,
  onDraftChange,
  scrollX,
  scrollY,
  zoom,
}: TextEditorOverlayProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const bounds = getElementBounds(element);

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.focus();
    input.select();
  }, [element.id]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onCommit();
    }
  };

  return (
    <textarea
      ref={inputRef}
      className="text-editor-overlay"
      aria-label="Edit text"
      value={draftText}
      rows={1}
      style={{
        left: (bounds.x - scrollX) * zoom,
        top: (bounds.y - scrollY) * zoom,
        width: Math.max(element.width, element.fontSize * 2) * zoom,
        minHeight: element.height * zoom,
        color: element.strokeColor,
        fontFamily: element.fontFamily,
        fontSize: element.fontSize * zoom,
        lineHeight: `${element.height * zoom}px`,
        opacity: element.opacity,
      }}
      onBlur={onCommit}
      onChange={(event) => onDraftChange(event.target.value)}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
    />
  );
}
