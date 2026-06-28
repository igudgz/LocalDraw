import { useState, type FormEvent, type KeyboardEvent } from "react";
import { formatUpdatedAt } from "./formatUpdatedAt";
import type { ProjectSummary } from "./projectTypes";

type ProjectListProps = {
  summaries: ProjectSummary[];
  activeDrawingId: string;
  onSelectDrawing: (drawingId: string) => void;
  onCreateDrawing: () => void;
  onDuplicateDrawing: (drawingId: string) => void;
  onDeleteDrawing: (drawingId: string) => void;
  onRenameDrawing: (drawingId: string, name: string) => void;
};

export function ProjectList({
  summaries,
  activeDrawingId,
  onSelectDrawing,
  onCreateDrawing,
  onDuplicateDrawing,
  onDeleteDrawing,
  onRenameDrawing,
}: ProjectListProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  function startRename(summary: ProjectSummary) {
    setRenamingId(summary.id);
    setRenameValue(summary.name);
  }

  function cancelRename() {
    setRenamingId(null);
    setRenameValue("");
  }

  function commitRename(drawingId: string) {
    const trimmedName = renameValue.trim();
    if (trimmedName.length > 0) {
      onRenameDrawing(drawingId, trimmedName);
    }
    cancelRename();
  }

  function handleRenameKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    drawingId: string,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitRename(drawingId);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelRename();
    }
  }

  return (
    <section className="project-list" aria-label="Drawings">
      <div className="project-list-actions">
        <button
          className="project-action-button"
          type="button"
          onClick={() => onCreateDrawing()}
        >
          New drawing
        </button>
      </div>

      {summaries.length === 0 ? (
        <p className="empty-note">No drawings yet.</p>
      ) : (
        <ul className="project-list-items">
          {summaries.map((summary) => {
            const isActive = summary.id === activeDrawingId;
            const isRenaming = renamingId === summary.id;

            return (
              <li key={summary.id} className="project-list-item">
                {isRenaming ? (
                  <form
                    className="project-rename-form"
                    onSubmit={(event: FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      commitRename(summary.id);
                    }}
                  >
                    <input
                      aria-label="Drawing name"
                      autoFocus
                      className="project-rename-input"
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      onBlur={() => commitRename(summary.id)}
                      onKeyDown={(event) =>
                        handleRenameKeyDown(event, summary.id)
                      }
                    />
                  </form>
                ) : (
                  <button
                    className="project-list-button"
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => onSelectDrawing(summary.id)}
                    onDoubleClick={() => startRename(summary)}
                  >
                    <span className="project-list-name">{summary.name}</span>
                    <span className="project-list-updated">
                      {formatUpdatedAt(summary.updatedAt)}
                    </span>
                  </button>
                )}

                <div className="project-item-actions">
                  <button
                    className="project-icon-button"
                    type="button"
                    aria-label={`Rename ${summary.name}`}
                    onClick={() => startRename(summary)}
                  >
                    Rename
                  </button>
                  <button
                    className="project-icon-button"
                    type="button"
                    aria-label={`Duplicate ${summary.name}`}
                    onClick={() => onDuplicateDrawing(summary.id)}
                  >
                    Duplicate
                  </button>
                  <button
                    className="project-icon-button project-icon-button-danger"
                    type="button"
                    aria-label={`Delete ${summary.name}`}
                    onClick={() => onDeleteDrawing(summary.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
