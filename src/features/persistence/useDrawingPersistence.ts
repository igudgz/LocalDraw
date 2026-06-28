import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch } from "react";
import type { EditorAction } from "../editor/editorActions";
import type { EditorState } from "../editor/editorTypes";
import { localProjectRepository } from "./localProjectRepository";

export const AUTOSAVE_DEBOUNCE_MS = 800;

export function createDebouncedCallback(
  callback: () => void,
  delayMs: number,
): {
  schedule: () => void;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return {
    schedule() {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        callback();
      }, delayMs);
    },
    cancel() {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    },
  };
}

type UseDrawingPersistenceOptions = {
  onSaved?: () => void;
};

export function useDrawingPersistence(
  state: EditorState,
  dispatch: Dispatch<EditorAction>,
  options?: UseDrawingPersistenceOptions,
): {
  flushSave: () => Promise<void>;
  hydrated: boolean;
} {
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);
  const stateRef = useRef(state);
  const onSavedRef = useRef(options?.onSaved);

  stateRef.current = state;
  onSavedRef.current = options?.onSaved;

  const flushSave = useCallback(async () => {
    await localProjectRepository.saveFromEditorState(stateRef.current);
    onSavedRef.current?.();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateFromStorage() {
      try {
        const record = await localProjectRepository.loadActiveDrawing();
        if (cancelled) {
          return;
        }

        if (record) {
          dispatch({
            type: "restore-drawing",
            drawing: {
              id: record.id,
              name: record.name,
              elements: record.elements,
              viewport: record.viewport,
              metadata: record.metadata,
            },
          });
        }
      } catch (error) {
        console.error("Failed to load drawing from IndexedDB", error);
      } finally {
        if (!cancelled) {
          hydratedRef.current = true;
          setHydrated(true);
        }
      }
    }

    void hydrateFromStorage();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    const debouncedSave = createDebouncedCallback(() => {
      void flushSave().catch((error) => {
        console.error("Failed to autosave drawing", error);
      });
    }, AUTOSAVE_DEBOUNCE_MS);

    debouncedSave.schedule();

    return () => {
      debouncedSave.cancel();
    };
  }, [state, flushSave]);

  return {
    flushSave,
    hydrated,
  };
}
