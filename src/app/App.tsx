import { Editor } from "../features/editor/Editor";
import { ProjectPanel } from "../features/projects/ProjectPanel";
import { TechnicalDocPanel } from "../features/technical-doc/TechnicalDocPanel";

export function App() {
  return (
    <main className="app-shell" aria-label="LocalDraw editor">
      <ProjectPanel />
      <Editor />
      <TechnicalDocPanel />
    </main>
  );
}
