import type { EditorAction } from "../editor/editorActions";

/**
 * Action types that mutate `elements` and therefore push a history snapshot
 * before the mutation is applied.
 *
 * Convention for adding new undoable actions:
 * 1. Add the action `type` string to `UNDOABLE_ACTION_TYPES`.
 * 2. Implement the mutation in `editorReducer.ts` inside `applyEditorAction`.
 * 3. Add undo/redo coverage in `editorReducer.test.ts`.
 *
 * Actions not listed here never push history (e.g. selection, viewport, tool).
 */
export const UNDOABLE_ACTION_TYPES = [
  "add-element",
  "delete-element",
  "update-element",
  "update-element-label",
  "update-element-text",
  "resize-element",
  "update-element-style",
] as const satisfies readonly EditorAction["type"][];

export type UndoableActionType = (typeof UNDOABLE_ACTION_TYPES)[number];

const undoableActionTypeSet = new Set<string>(UNDOABLE_ACTION_TYPES);

export function isUndoableAction(
  action: EditorAction,
): action is Extract<EditorAction, { type: UndoableActionType }> {
  return undoableActionTypeSet.has(action.type);
}
