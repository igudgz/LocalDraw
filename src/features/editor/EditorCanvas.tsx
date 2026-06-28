import { EditorViewport } from "./EditorViewport";
import type { Dispatch } from "react";
import type { EditorAction } from "./editorActions";
import type { EditorState } from "./editorTypes";

type EditorCanvasProps = {
  dispatch: Dispatch<EditorAction>;
  state: EditorState;
};

export function EditorCanvas({ dispatch, state }: EditorCanvasProps) {
  return (
    <div className="editor-canvas" aria-label="Central drawing area">
      <EditorViewport dispatch={dispatch} state={state} />
    </div>
  );
}
