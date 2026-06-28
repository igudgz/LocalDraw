import { Editor } from "../features/editor/Editor";
import { ProjectPanel } from "../features/projects/ProjectPanel";
import { TechnicalDocPanel } from "../features/technical-doc/TechnicalDocPanel";
import { useDrawingSession } from "../features/persistence/useDrawingSession";

export function App() {
  const { state, dispatch, flushSave, projects } = useDrawingSession();

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
