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
    case "set-selection":
      return {
        ...state,
        selectedElementIds:
          action.elementId === null ? [] : [action.elementId],
      };
    case "update-element":
      return {
        ...state,
        elements: state.elements.map((element) =>
          element.id === action.elementId
            ? {
                ...element,
                x: action.x,
                y: action.y,
                updatedAt: new Date().toISOString(),
              }
            : element,
        ),
      };
    case "set-interaction":
      return {
        ...state,
        ui: {
          ...state.ui,
          interaction: action.interaction,
        },
      };
    case "add-element":
      return {
        ...state,
        elements: [...state.elements, action.element],
        currentDrawing: {
          ...state.currentDrawing,
          updatedAt: new Date().toISOString(),
        },
      };
    case "restore-drawing":
      return {
        ...state,
        elements: action.drawing.elements,
        selectedElementIds: [],
        activeTool: "select",
        viewport: {
          ...action.drawing.viewport,
          showGrid: state.viewport.showGrid,
        },
        currentDrawing: {
          id: action.drawing.id,
          name: action.drawing.name,
          createdAt: action.drawing.metadata.createdAt,
          updatedAt: action.drawing.metadata.updatedAt,
        },
        history: {
          past: [],
          future: [],
        },
        ui: {
          interaction: "idle",
        },
      };
    case "update-current-drawing":
      return {
        ...state,
        currentDrawing: {
          ...state.currentDrawing,
          ...(action.name !== undefined ? { name: action.name } : {}),
          ...(action.updatedAt !== undefined
            ? { updatedAt: action.updatedAt }
            : {}),
        },
      };
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}
