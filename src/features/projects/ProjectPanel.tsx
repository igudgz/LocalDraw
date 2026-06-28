import { ProjectList } from "./ProjectList";

export function ProjectPanel() {
  return (
    <aside className="project-panel" aria-label="Left sidebar">
      <div className="panel-heading">
        <h1>LocalDraw</h1>
        <p>Local drawings</p>
      </div>
      <ProjectList />
    </aside>
  );
}
