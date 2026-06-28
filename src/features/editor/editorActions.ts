import type { EditorTool, ViewportState } from "./editorTypes";

export type EditorAction =
  | {
      type: "set-active-tool";
      tool: EditorTool;
    }
  | {
      type: "set-viewport";
      viewport: ViewportState;
    };
