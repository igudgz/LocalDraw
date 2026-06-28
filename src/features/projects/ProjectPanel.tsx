import { useEffect, useState } from "react";
import { ProjectList } from "./ProjectList";
import { formatTagsForInput, parseTagsInput } from "./tagHelpers";
import type { ProjectDetail, ProjectSummary } from "./projectTypes";

type ProjectPanelProps = {
  summaries: ProjectSummary[];
  activeDrawingId: string;
  selectedDetail: ProjectDetail | null;
  onSelectDrawing: (drawingId: string) => void;
  onCreateDrawing: () => void;
  onDuplicateDrawing: (drawingId: string) => void;
  onDeleteDrawing: (drawingId: string) => void;
  onRenameDrawing: (drawingId: string, name: string) => void;
  onUpdateMetadata: (
    drawingId: string,
    update: { description?: string; tags?: string[] },
  ) => void;
};

export function ProjectPanel({
  summaries,
  activeDrawingId,
  selectedDetail,
  onSelectDrawing,
  onCreateDrawing,
  onDuplicateDrawing,
  onDeleteDrawing,
  onRenameDrawing,
  onUpdateMetadata,
}: ProjectPanelProps) {
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    setDescription(selectedDetail?.description ?? "");
    setTagsInput(formatTagsForInput(selectedDetail?.tags ?? []));
  }, [selectedDetail]);

  function commitDescription() {
    if (!selectedDetail) {
      return;
    }

    onUpdateMetadata(selectedDetail.id, { description });
  }

  function commitTags() {
    if (!selectedDetail) {
      return;
    }

    onUpdateMetadata(selectedDetail.id, {
      tags: parseTagsInput(tagsInput),
    });
  }

  return (
    <aside className="project-panel" aria-label="Left sidebar">
      <div className="panel-heading">
        <h1>LocalDraw</h1>
        <p>Local drawings</p>
      </div>

      <ProjectList
        summaries={summaries}
        activeDrawingId={activeDrawingId}
        onSelectDrawing={onSelectDrawing}
        onCreateDrawing={onCreateDrawing}
        onDuplicateDrawing={onDuplicateDrawing}
        onDeleteDrawing={onDeleteDrawing}
        onRenameDrawing={onRenameDrawing}
      />

      {selectedDetail ? (
        <section className="project-metadata" aria-label="Drawing metadata">
          <h2>Details</h2>
          <label className="project-field">
            <span>Description</span>
            <textarea
              className="project-textarea"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onBlur={commitDescription}
            />
          </label>
          <label className="project-field">
            <span>Tags</span>
            <input
              className="project-input"
              type="text"
              value={tagsInput}
              placeholder="comma, separated, tags"
              onChange={(event) => setTagsInput(event.target.value)}
              onBlur={commitTags}
            />
          </label>
        </section>
      ) : null}
    </aside>
  );
}
