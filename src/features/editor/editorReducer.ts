import type { EditorAction } from "./editorActions";
import type { EditorState } from "./editorTypes";
import { estimateTextBounds } from "../tools/textTool";

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
        elements: state.elements.map((element) => {
          if (element.id !== action.elementId) {
            return element;
          }

          const deltaX = action.x - element.x;
          const deltaY = action.y - element.y;
          const updatedAt = new Date().toISOString();

          if (element.type === "arrow") {
            return {
              ...element,
              x: action.x,
              y: action.y,
              startX: element.startX + deltaX,
              startY: element.startY + deltaY,
              endX: element.endX + deltaX,
              endY: element.endY + deltaY,
              updatedAt,
            };
          }

          return {
            ...element,
            x: action.x,
            y: action.y,
            updatedAt,
          };
        }),
      };
    case "update-element-label":
      return {
        ...state,
        elements: state.elements.map((element) =>
          element.id === action.elementId && element.type === "arrow"
            ? {
                ...element,
                label: action.label || undefined,
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
    case "update-element-text":
      return {
        ...state,
        elements: state.elements.map((element) => {
          if (element.id !== action.elementId || element.type !== "text") {
            return element;
          }

          const { width, height } = estimateTextBounds(
            action.text,
            element.fontSize,
          );

          return {
            ...element,
            text: action.text,
            width,
            height,
            updatedAt: new Date().toISOString(),
          };
        }),
        currentDrawing: {
          ...state.currentDrawing,
          updatedAt: new Date().toISOString(),
        },
      };
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}

