import { Editor } from "../features/editor/Editor";
import { EditorProvider } from "../features/editor/EditorContext";
import { ProjectPanel } from "../features/projects/ProjectPanel";
import { TechnicalDocPanel } from "../features/technical-doc/TechnicalDocPanel";

export function App() {
  return (
    <EditorProvider>
      <main className="app-shell" aria-label="LocalDraw editor">
        <ProjectPanel />
        <Editor />
        <TechnicalDocPanel />
      </main>
    </EditorProvider>
  );
}
