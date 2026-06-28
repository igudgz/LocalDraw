import type { Dispatch } from "react";
import { EditorCanvas } from "./EditorCanvas";
import { EditorToolbar } from "./EditorToolbar";
import type { EditorAction } from "./editorActions";
import type { EditorState } from "./editorTypes";

type EditorProps = {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
};

export function Editor({ state, dispatch }: EditorProps) {
  return (
    <section className="editor-shell" aria-label="Drawing editor">
      <EditorToolbar
        activeTool={state.activeTool}
        viewport={state.viewport}
        onSelectTool={(tool) => dispatch({ type: "set-active-tool", tool })}
        onToggleGrid={() =>
          dispatch({
            type: "set-viewport",
            viewport: { ...state.viewport, showGrid: !state.viewport.showGrid },
          })
        }
      />
      <EditorCanvas dispatch={dispatch} state={state} />
    </section>
  );
}
