import type { LocalDrawElement } from "../elements/elementTypes";
import { translateElementTo } from "../elements/elementGeometry";
import type { EditorTool } from "./editorTypes";
import { createId } from "../../shared/utils/ids";

export const PASTE_OFFSET = 16;

const TOOL_KEY_MAP: Record<string, EditorTool> = {
  v: "select",
  r: "rectangle",
  o: "ellipse",
  a: "arrow",
  t: "text",
  h: "hand",
};

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  );
}

export function toolForShortcutKey(key: string): EditorTool | null {
  return TOOL_KEY_MAP[key.toLowerCase()] ?? null;
}

export function cloneElementForPaste(source: LocalDrawElement): LocalDrawElement {
  const now = new Date().toISOString();
  const offsetElement = translateElementTo(
    source,
    source.x + PASTE_OFFSET,
    source.y + PASTE_OFFSET,
  );

  return {
    ...offsetElement,
    id: createId(source.type),
    createdAt: now,
    updatedAt: now,
  };
}

export function deepCloneElement(element: LocalDrawElement): LocalDrawElement {
  if (element.type === "arrow") {
    return { ...element };
  }

  return { ...element };
}
