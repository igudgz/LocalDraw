import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from "react";
import { useDrawingPersistence } from "../persistence/useDrawingPersistence";
import { useDrawingProjects } from "../projects/useDrawingProjects";
import type { EditorAction } from "./editorActions";
import { editorReducer, initialEditorState } from "./editorReducer";
import type { EditorState } from "./editorTypes";

type EditorContextValue = {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  flushSave: () => Promise<void>;
  hydrated: boolean;
  projects: ReturnType<typeof useDrawingProjects>;
};

const EditorContext = createContext<EditorContextValue | null>(null);

type EditorProviderProps = {
  children: ReactNode;
};

export function EditorProvider({ children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);
  const refreshSummariesRef = useRef<(() => Promise<void>) | null>(null);

  const { flushSave, hydrated } = useDrawingPersistence(state, dispatch, {
    onSaved: () => {
      void refreshSummariesRef.current?.();
    },
  });

  const projects = useDrawingProjects(state, dispatch, flushSave, hydrated);
  refreshSummariesRef.current = projects.refreshSummaries;

  const value = useMemo(
    () => ({ state, dispatch, flushSave, hydrated, projects }),
    [state, flushSave, hydrated, projects],
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

function useEditorContext(): EditorContextValue {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("Editor hooks must be used within EditorProvider");
  }

  return context;
}

export function useEditorState(): EditorState {
  return useEditorContext().state;
}

export function useEditorDispatch(): Dispatch<EditorAction> {
  return useEditorContext().dispatch;
}

export function useEditorElements() {
  return useEditorState().elements;
}

export function useEditorSession() {
  const { flushSave, hydrated, projects } = useEditorContext();
  return { flushSave, hydrated, projects };
}
