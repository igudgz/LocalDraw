import { useReducer, useRef } from "react";
import { Editor } from "../features/editor/Editor";
import { editorReducer, initialEditorState } from "../features/editor/editorReducer";
import { useDrawingPersistence } from "../features/persistence/useDrawingPersistence";
import { ProjectPanel } from "../features/projects/ProjectPanel";
import { useDrawingProjects } from "../features/projects/useDrawingProjects";
import { TechnicalDocPanel } from "../features/technical-doc/TechnicalDocPanel";

export function App() {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);
  const refreshSummariesRef = useRef<(() => Promise<void>) | null>(null);

  const { flushSave, hydrated } = useDrawingPersistence(state, dispatch, {
    onSaved: () => {
      void refreshSummariesRef.current?.();
    },
  });

  const projects = useDrawingProjects(state, dispatch, flushSave, hydrated);
  refreshSummariesRef.current = projects.refreshSummaries;

  return (
    <main className="app-shell" aria-label="LocalDraw editor">
      <ProjectPanel
        summaries={projects.summaries}
        activeDrawingId={state.currentDrawing.id}
        selectedDetail={projects.selectedDetail}
        onSelectDrawing={projects.selectDrawing}
        onCreateDrawing={projects.createNewDrawing}
        onDuplicateDrawing={projects.duplicateDrawing}
        onDeleteDrawing={projects.deleteDrawing}
        onRenameDrawing={projects.renameDrawing}
        onUpdateMetadata={projects.updateDrawingMetadata}
      />
      <Editor
        dispatch={dispatch}
        flushSave={flushSave}
        refreshSummaries={projects.refreshSummaries}
        state={state}
      />
      <TechnicalDocPanel />
    </main>
  );
}
