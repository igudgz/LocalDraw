import { Editor } from "../features/editor/Editor";
import {
  EditorProvider,
  useEditorState,
  useEditorSession,
} from "../features/editor/EditorContext";
import { PropertiesPanel } from "../features/editor/PropertiesPanel";
import { ProjectPanel } from "../features/projects/ProjectPanel";
import { TechnicalDocPanel } from "../features/technical-doc/TechnicalDocPanel";

function AppShell() {
  const state = useEditorState();
  const { projects } = useEditorSession();

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
      <Editor />
      {state.selectedElementIds.length > 0 ? (
        <PropertiesPanel />
      ) : (
        <TechnicalDocPanel />
      )}
    </main>
  );
}

export function App() {
  return (
    <EditorProvider>
      <AppShell />
    </EditorProvider>
  );
}
