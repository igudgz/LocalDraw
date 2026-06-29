import { describe, expect, it, vi } from "vitest";
import type { RectangleElement } from "../elements/elementTypes";
import type { EditorAction } from "./editorActions";
import { initialEditorState } from "./editorReducer";
import {
  cloneElementForPaste,
  PASTE_OFFSET,
  toolForShortcutKey,
} from "./keyboardShortcutLogic";
import { handleEditorKeyboardShortcut } from "./useEditorKeyboardShortcuts";

const rectangle: RectangleElement = {
  id: "rect-1",
  type: "rectangle",
  x: 100,
  y: 80,
  width: 120,
  height: 60,
  rotation: 0,
  strokeColor: "#18202c",
  backgroundColor: "#ffffff",
  strokeWidth: 2,
  opacity: 1,
  createdAt: "2026-06-28T10:00:00.000Z",
  updatedAt: "2026-06-28T10:00:00.000Z",
};

function createKeyboardEvent(
  init: Partial<KeyboardEvent> & Pick<KeyboardEvent, "key">,
): KeyboardEvent {
  return {
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    preventDefault: vi.fn(),
    target: document.body,
    ...init,
  } as KeyboardEvent;
}

describe("keyboardShortcutLogic", () => {
  it("maps tool shortcut keys to editor tools", () => {
    expect(toolForShortcutKey("V")).toBe("select");
    expect(toolForShortcutKey("r")).toBe("rectangle");
    expect(toolForShortcutKey("h")).toBe("hand");
    expect(toolForShortcutKey("x")).toBeNull();
  });

  it("offsets pasted clones so they do not overlap the source", () => {
    const pasted = cloneElementForPaste(rectangle);

    expect(pasted.id).not.toBe(rectangle.id);
    expect(pasted.x).toBe(rectangle.x + PASTE_OFFSET);
    expect(pasted.y).toBe(rectangle.y + PASTE_OFFSET);
  });
});

describe("handleEditorKeyboardShortcut", () => {
  it("does not dispatch when inline text editing is active", () => {
    const dispatch = vi.fn<(action: EditorAction) => void>();
    const setCopiedElement = vi.fn();

    handleEditorKeyboardShortcut(
      createKeyboardEvent({ key: "Delete" }),
      {
        dispatch,
        state: {
          ...initialEditorState,
          selectedElementIds: [rectangle.id],
          elements: [rectangle],
        },
        copiedElement: null,
        setCopiedElement,
        inlineEditActive: true,
      },
    );

    expect(dispatch).not.toHaveBeenCalled();
  });

  it("deletes the selected element on Delete", () => {
    const dispatch = vi.fn<(action: EditorAction) => void>();
    const setCopiedElement = vi.fn();

    handleEditorKeyboardShortcut(
      createKeyboardEvent({ key: "Delete" }),
      {
        dispatch,
        state: {
          ...initialEditorState,
          selectedElementIds: [rectangle.id],
          elements: [rectangle],
        },
        copiedElement: null,
        setCopiedElement,
        inlineEditActive: false,
      },
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: "delete-element",
      elementId: rectangle.id,
    });
  });

  it("activates rectangle tool on R without modifiers", () => {
    const dispatch = vi.fn<(action: EditorAction) => void>();
    const setCopiedElement = vi.fn();

    handleEditorKeyboardShortcut(
      createKeyboardEvent({ key: "r" }),
      {
        dispatch,
        state: initialEditorState,
        copiedElement: null,
        setCopiedElement,
        inlineEditActive: false,
      },
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: "set-active-tool",
      tool: "rectangle",
    });
  });

  it("copies and pastes the selected element with local clipboard state", () => {
    const dispatch = vi.fn<(action: EditorAction) => void>();
    let copied: typeof rectangle | null = null;
    const setCopiedElement = vi.fn((element: typeof rectangle | null) => {
      copied = element;
    });

    handleEditorKeyboardShortcut(
      createKeyboardEvent({ key: "c", ctrlKey: true }),
      {
        dispatch,
        state: {
          ...initialEditorState,
          selectedElementIds: [rectangle.id],
          elements: [rectangle],
        },
        copiedElement: null,
        setCopiedElement,
        inlineEditActive: false,
      },
    );

    expect(setCopiedElement).toHaveBeenCalledWith(rectangle);

    handleEditorKeyboardShortcut(
      createKeyboardEvent({ key: "v", ctrlKey: true }),
      {
        dispatch,
        state: {
          ...initialEditorState,
          selectedElementIds: [rectangle.id],
          elements: [rectangle],
        },
        copiedElement: copied,
        setCopiedElement,
        inlineEditActive: false,
      },
    );

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "add-element" }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "set-selection" }),
    );
  });
});
