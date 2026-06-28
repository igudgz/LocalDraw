import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { EditorAction } from "./editorActions";
import { editorReducer, initialEditorState } from "./editorReducer";
import type { EditorState } from "./editorTypes";

type EditorContextValue = {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
};

const EditorContext = createContext<EditorContextValue | null>(null);

type EditorProviderProps = {
  children: ReactNode;
};

export function EditorProvider({ children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

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
