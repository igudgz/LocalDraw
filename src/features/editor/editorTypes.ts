import type { LocalDrawElement } from "../elements/elementTypes";

export type EditorTool =
  | "select"
  | "hand"
  | "rectangle"
  | "ellipse"
  | "arrow"
  | "text";

export type ViewportState = {
  zoom: number;
  scrollX: number;
  scrollY: number;
  showGrid: boolean;
};

export type StyleDefaults = {
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  opacity: number;
  fontSize: number;
  fontFamily: string;
};

export type EditorHistoryState = {
  past: EditorStateSnapshot[];
  future: EditorStateSnapshot[];
};

export type EditorStateSnapshot = {
  elements: LocalDrawElement[];
  selectedElementIds: string[];
  activeTool: EditorTool;
  viewport: ViewportState;
};

export type CurrentDrawingState = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type EditorInteraction = "idle" | "dragging";

export type EditorUiState = {
  interaction: EditorInteraction;
};

export type EditorState = {
  elements: LocalDrawElement[];
  selectedElementIds: string[];
  activeTool: EditorTool;
  viewport: ViewportState;
  styleDefaults: StyleDefaults;
  history: EditorHistoryState;
  currentDrawing: CurrentDrawingState;
  ui: EditorUiState;
};
