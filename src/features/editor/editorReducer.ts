import type { EditorAction } from "./editorActions";
import type { EditorState } from "./editorTypes";

export const initialEditorState: EditorState = {
  elements: [],
  selectedElementIds: [],
  activeTool: "select",
  viewport: {
    zoom: 1,
    scrollX: 0,
    scrollY: 0,
    showGrid: true,
  },
  styleDefaults: {
    strokeColor: "#18202c",
    backgroundColor: "#ffffff",
    strokeWidth: 2,
    opacity: 1,
    fontSize: 16,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  history: {
    past: [],
    future: [],
  },
  currentDrawing: {
    id: "localdraw-initial-drawing",
    name: "Untitled drawing",
    createdAt: "2026-06-28T00:00:00.000Z",
    updatedAt: "2026-06-28T00:00:00.000Z",
  },
  ui: {
    interaction: "idle",
  },
};

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "set-active-tool":
      return {
        ...state,
        activeTool: action.tool,
      };
    case "set-viewport":
      return {
        ...state,
        viewport: action.viewport,
      };
    default:
      return state;
  }
}
