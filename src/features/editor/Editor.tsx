import { useReducer } from "react";
import { useDrawingPersistence } from "../persistence/useDrawingPersistence";
import { EditorCanvas } from "./EditorCanvas";
import { EditorToolbar } from "./EditorToolbar";
import { editorReducer, initialEditorState } from "./editorReducer";

export function Editor() {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);

  useDrawingPersistence(state, dispatch);

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
