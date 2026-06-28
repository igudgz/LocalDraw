import { EditorCanvas } from "./EditorCanvas";
import { useEditorDispatch, useEditorState } from "./EditorContext";
import { EditorToolbar } from "./EditorToolbar";

export function Editor() {
  const state = useEditorState();
  const dispatch = useEditorDispatch();

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
