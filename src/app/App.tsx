import { useReducer } from "react";
import { Editor } from "../features/editor/Editor";
import { EditorProvider } from "../features/editor/EditorContext";
import { editorReducer, initialEditorState } from "../features/editor/editorReducer";
import { ProjectPanel } from "../features/projects/ProjectPanel";
import { TechnicalDocPanel } from "../features/technical-doc/TechnicalDocPanel";

export function App() {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);

  return (
    <EditorProvider elements={state.elements}>
      <main className="app-shell" aria-label="LocalDraw editor">
        <ProjectPanel />
        <Editor state={state} dispatch={dispatch} />
        <TechnicalDocPanel />
      </main>
    </EditorProvider>
  );
}
