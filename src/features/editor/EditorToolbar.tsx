import type { ChangeEvent, RefObject } from "react";
import type { EditorTool, ViewportState } from "./editorTypes";

const tools: Array<{ id: EditorTool; label: string }> = [
  { id: "select", label: "Select" },
  { id: "hand", label: "Hand" },
  { id: "rectangle", label: "Rect" },
  { id: "ellipse", label: "Oval" },
  { id: "arrow", label: "Arrow" },
  { id: "text", label: "Text" },
];

type EditorToolbarProps = {
  activeTool: EditorTool;
  viewport: ViewportState;
  toolbarError: string | null;
  isExportingPng: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onSelectTool: (tool: EditorTool) => void;
  onToggleGrid: () => void;
  onExportLocalDraw: () => void;
  onImportLocalDraw: () => void;
  onImportInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onExportSvg: () => void;
  onExportPng: () => void;
};

export function EditorToolbar({
  activeTool,
  fileInputRef,
  toolbarError,
  isExportingPng,
  onExportLocalDraw,
  onExportPng,
  onExportSvg,
  onImportInputChange,
  onImportLocalDraw,
  onToggleGrid,
  viewport,
  onSelectTool,
}: EditorToolbarProps) {
  return (
    <header className="editor-toolbar" aria-label="Editor toolbar">
      <div className="tool-group" role="toolbar" aria-label="Drawing tools">
        {tools.map((tool) => (
          <button
            className="tool-button"
            key={tool.id}
            type="button"
            aria-pressed={tool.id === activeTool}
            onClick={() => onSelectTool(tool.id)}
          >
            {tool.label}
          </button>
        ))}
        <button
          className="tool-button"
          type="button"
          aria-pressed={viewport.showGrid}
          onClick={onToggleGrid}
        >
          Grid
        </button>
      </div>
      <div className="tool-group export-group" role="group" aria-label="Import and export">
        <input
          ref={fileInputRef}
          accept=".localdraw,application/json"
          className="import-file-input"
          type="file"
          onChange={onImportInputChange}
        />
        <button className="tool-button" type="button" onClick={onExportLocalDraw}>
          Export .localdraw
        </button>
        <button className="tool-button" type="button" onClick={onImportLocalDraw}>
          Import
        </button>
        <button className="tool-button" type="button" onClick={onExportSvg}>
          Export SVG
        </button>
        <button
          className="tool-button"
          type="button"
          disabled={isExportingPng}
          onClick={onExportPng}
        >
          {isExportingPng ? "Exporting PNG..." : "Export PNG"}
        </button>
      </div>
      <div className="viewport-status" aria-label="Viewport state">
        <span>Zoom {Math.round(viewport.zoom * 100)}%</span>
        <span>X {Math.round(viewport.scrollX)}</span>
        <span>Y {Math.round(viewport.scrollY)}</span>
        {toolbarError ? (
          <span className="import-error" role="alert">
            {toolbarError}
          </span>
        ) : null}
      </div>
    </header>
  );
}
