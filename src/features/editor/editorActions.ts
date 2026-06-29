import type { LocalDrawElement } from "../elements/elementTypes";
import type {
  EditorInteraction,
  EditorTool,
  ViewportState,
} from "./editorTypes";

export type EditorAction =
  | {
      type: "set-active-tool";
      tool: EditorTool;
    }
  | {
      type: "set-viewport";
      viewport: ViewportState;
    }
  | {
      type: "set-selection";
      elementId: string | null;
    }
  | {
      type: "update-element";
      elementId: string;
      x: number;
      y: number;
    }
  | {
      type: "update-element-label";
      elementId: string;
      label: string;
    }
  | {
      type: "update-element-text";
      elementId: string;
      text: string;
    }
  | {
      type: "update-element-style";
      elementId: string;
      strokeColor?: string;
      backgroundColor?: string;
      strokeWidth?: number;
      opacity?: number;
      fontSize?: number;
      fontFamily?: string;
    }
  | {
      type: "set-interaction";
      interaction: EditorInteraction;
    }
  | {
      type: "add-element";
      element: LocalDrawElement;
    }
  | {
      type: "restore-drawing";
      drawing: {
        id: string;
        name: string;
        elements: LocalDrawElement[];
        viewport: {
          zoom: number;
          scrollX: number;
          scrollY: number;
        };
        metadata: {
          createdAt: string;
          updatedAt: string;
        };
      };
    }
  | {
      type: "update-current-drawing";
      name?: string;
      updatedAt?: string;
    };
