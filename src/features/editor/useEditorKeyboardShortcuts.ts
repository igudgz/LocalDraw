import { useEffect, type Dispatch } from "react";
import type { LocalDrawElement } from "../elements/elementTypes";
import type { EditorAction } from "./editorActions";
import {
  useEditorDispatch,
  useEditorSession,
  useEditorState,
} from "./EditorContext";
import type { EditorState } from "./editorTypes";
import {
  cloneElementForPaste,
  deepCloneElement,
  isEditableTarget,
  toolForShortcutKey,
} from "./keyboardShortcutLogic";

type KeyboardShortcutHandlers = {
  dispatch: Dispatch<EditorAction>;
  state: EditorState;
  copiedElement: LocalDrawElement | null;
  setCopiedElement: (element: LocalDrawElement | null) => void;
  inlineEditActive: boolean;
};

export function handleEditorKeyboardShortcut(
  event: KeyboardEvent,
  handlers: KeyboardShortcutHandlers,
): void {
  const { dispatch, state, copiedElement, setCopiedElement, inlineEditActive } =
    handlers;

  if (inlineEditActive || isEditableTarget(event.target)) {
    return;
  }

  const modifier = event.ctrlKey || event.metaKey;
  const key = event.key;

  if (modifier) {
    const lowerKey = key.toLowerCase();

    if (lowerKey === "z") {
      event.preventDefault();
      if (event.shiftKey) {
        dispatch({ type: "redo" });
      } else {
        dispatch({ type: "undo" });
      }
      return;
    }

    if (lowerKey === "y") {
      event.preventDefault();
      dispatch({ type: "redo" });
      return;
    }

    if (lowerKey === "c") {
      const selectedId = state.selectedElementIds[0];
      if (!selectedId) {
        return;
      }

      const selected = state.elements.find((element) => element.id === selectedId);
      if (!selected) {
        return;
      }

      event.preventDefault();
      setCopiedElement(deepCloneElement(selected));
      return;
    }

    if (lowerKey === "v") {
      if (!copiedElement) {
        return;
      }

      event.preventDefault();
      const pasted = cloneElementForPaste(copiedElement);
      dispatch({ type: "add-element", element: pasted });
      dispatch({ type: "set-selection", elementId: pasted.id });
      return;
    }

    return;
  }

  if (key === "Delete" || key === "Backspace") {
    const selectedId = state.selectedElementIds[0];
    if (!selectedId) {
      return;
    }

    event.preventDefault();
    dispatch({ type: "delete-element", elementId: selectedId });
    return;
  }

  if (key === "Escape") {
    if (state.selectedElementIds.length === 0) {
      return;
    }

    event.preventDefault();
    dispatch({ type: "set-selection", elementId: null });
    return;
  }

  if (event.altKey || event.shiftKey) {
    return;
  }

  const tool = toolForShortcutKey(key);
  if (tool === null) {
    return;
  }

  event.preventDefault();
  dispatch({ type: "set-active-tool", tool });
}

type UseEditorKeyboardShortcutsOptions = {
  copiedElement: LocalDrawElement | null;
  setCopiedElement: (element: LocalDrawElement | null) => void;
};

export function useEditorKeyboardShortcuts({
  copiedElement,
  setCopiedElement,
}: UseEditorKeyboardShortcutsOptions): void {
  const state = useEditorState();
  const dispatch = useEditorDispatch();
  const { inlineEditActive } = useEditorSession();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      handleEditorKeyboardShortcut(event, {
        dispatch,
        state,
        copiedElement,
        setCopiedElement,
        inlineEditActive,
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    copiedElement,
    dispatch,
    inlineEditActive,
    setCopiedElement,
    state,
  ]);
}
