import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch } from "react";
import type { EditorAction } from "../editor/editorActions";
import type { EditorState } from "../editor/editorTypes";
import { drawingRecordToRestoreAction } from "./drawingBridge";
import {
  createDrawing,
  getById,
  loadActiveDrawing,
  saveFromEditorState,
} from "./localProjectRepository";

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

  const persistableSignature = useMemo(
    () =>
      JSON.stringify({
        drawingId: state.currentDrawing.id,
        drawingName: state.currentDrawing.name,
        drawingCreatedAt: state.currentDrawing.createdAt,
        drawingUpdatedAt: state.currentDrawing.updatedAt,
        elements: state.elements,
        viewport: {
          zoom: state.viewport.zoom,
          scrollX: state.viewport.scrollX,
          scrollY: state.viewport.scrollY,
        },
      }),
    [
      state.currentDrawing.id,
      state.currentDrawing.name,
      state.currentDrawing.createdAt,
      state.currentDrawing.updatedAt,
      state.elements,
      state.viewport.zoom,
      state.viewport.scrollX,
      state.viewport.scrollY,
    ],
  );

  const flushSave = useCallback(async () => {
    await saveFromEditorState(stateRef.current);
    onSavedRef.current?.();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateFromStorage() {
      try {
        let record = await loadActiveDrawing();
        if (cancelled) {
          return;
        }

        if (!record) {
          record = await createDrawing();
        }

        if (cancelled) {
          return;
        }

        dispatch(drawingRecordToRestoreAction(record));
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
  }, [persistableSignature, flushSave]);

  return {
    flushSave,
    hydrated,
  };
}
