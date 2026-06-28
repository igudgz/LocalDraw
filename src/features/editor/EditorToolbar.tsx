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
  onSelectTool: (tool: EditorTool) => void;
  onToggleGrid: () => void;
};

export function EditorToolbar({
  activeTool,
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
      <div className="viewport-status" aria-label="Viewport state">
        <span>Zoom {Math.round(viewport.zoom * 100)}%</span>
        <span>X {Math.round(viewport.scrollX)}</span>
        <span>Y {Math.round(viewport.scrollY)}</span>
      </div>
    </header>
  );
}
