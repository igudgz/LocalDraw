import { useReducer, useRef } from "react";
import { editorReducer, initialEditorState } from "../editor/editorReducer";
import { useDrawingPersistence } from "./useDrawingPersistence";
import { useDrawingProjects } from "../projects/useDrawingProjects";

export function useDrawingSession() {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);
  const refreshSummariesRef = useRef<(() => Promise<void>) | null>(null);

  const { flushSave, hydrated } = useDrawingPersistence(state, dispatch, {
    onSaved: () => {
      void refreshSummariesRef.current?.();
    },
  });

  const projects = useDrawingProjects(state, dispatch, flushSave, hydrated);
  refreshSummariesRef.current = projects.refreshSummaries;

  return {
    state,
    dispatch,
    flushSave,
    hydrated,
    projects,
  };
}
