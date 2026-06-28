import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { LocalDrawElement } from "../elements/elementTypes";

type EditorContextValue = {
  elements: LocalDrawElement[];
};

const EditorContext = createContext<EditorContextValue | null>(null);

type EditorProviderProps = {
  elements: LocalDrawElement[];
  children: ReactNode;
};

export function EditorProvider({ elements, children }: EditorProviderProps) {
  return (
    <EditorContext.Provider value={{ elements }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorElements(): LocalDrawElement[] {
  const context = useContext(EditorContext);
  return context?.elements ?? [];
}
