import { useCallback, useEffect, useState } from "react";
import type { Dispatch } from "react";
import type { EditorAction } from "../editor/editorActions";
import type { EditorState } from "../editor/editorTypes";
import { drawingRecordToRestoreAction } from "../persistence/drawingBridge";
import {
  createDrawing,
  deleteDrawing as deleteDrawingRecord,
  duplicateDrawing as duplicateDrawingRecord,
  getById,
  listSummaries,
  setActiveDrawingId,
  updateMetadata,
} from "../persistence/localProjectRepository";
import type { DrawingDbRecord } from "../persistence/drawingTypes";
import type { ProjectDetail, ProjectSummary } from "./projectTypes";

function recordToProjectDetail(record: DrawingDbRecord): ProjectDetail {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    tags: record.tags,
    updatedAt: record.metadata.updatedAt,
  };
}

export function useDrawingProjects(
  state: EditorState,
  dispatch: Dispatch<EditorAction>,
  flushSave: () => Promise<void>,
  hydrated: boolean,
) {
  const [summaries, setSummaries] = useState<ProjectSummary[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<ProjectDetail | null>(
    null,
  );

  const refreshSummaries = useCallback(async () => {
    const list = await listSummaries();
    setSummaries(list);
  }, []);

  const loadSelectedDetail = useCallback(async (drawingId: string) => {
    const record = await getById(drawingId);
    setSelectedDetail(record ? recordToProjectDetail(record) : null);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void refreshSummaries();
  }, [hydrated, refreshSummaries]);

  useEffect(() => {
    void loadSelectedDetail(state.currentDrawing.id);
  }, [loadSelectedDetail, state.currentDrawing.id]);

  const selectDrawing = useCallback(
    async (drawingId: string) => {
      if (drawingId === state.currentDrawing.id) {
        return;
      }

      await flushSave();

      const record = await getById(drawingId);
      if (!record) {
        return;
      }

      setActiveDrawingId(record.id);
      dispatch(drawingRecordToRestoreAction(record));
      await refreshSummaries();
    },
    [dispatch, flushSave, refreshSummaries, state.currentDrawing.id],
  );

  const createNewDrawing = useCallback(async () => {
    await flushSave();
    const record = await createDrawing();
    dispatch(drawingRecordToRestoreAction(record));
    await refreshSummaries();
  }, [dispatch, flushSave, refreshSummaries]);

  const duplicateDrawing = useCallback(
    async (drawingId: string) => {
      await flushSave();
      const record = await duplicateDrawingRecord(drawingId);
      if (!record) {
        return;
      }

      dispatch(drawingRecordToRestoreAction(record));
      await refreshSummaries();
    },
    [dispatch, flushSave, refreshSummaries],
  );

  const deleteDrawing = useCallback(
    async (drawingId: string) => {
      await flushSave();
      await deleteDrawingRecord(drawingId);

      const remaining = await listSummaries();
      if (drawingId === state.currentDrawing.id) {
        const nextRecord =
          remaining.length > 0
            ? await getById(remaining[0].id)
            : await createDrawing();

        if (nextRecord) {
          dispatch(drawingRecordToRestoreAction(nextRecord));
        }
      }

      await refreshSummaries();
    },
    [dispatch, flushSave, refreshSummaries, state.currentDrawing.id],
  );

  const renameDrawing = useCallback(
    async (drawingId: string, name: string) => {
      const trimmedName = name.trim();
      if (trimmedName.length === 0) {
        return;
      }

      const updated = await updateMetadata(drawingId, {
        name: trimmedName,
      });
      if (!updated) {
        return;
      }

      if (drawingId === state.currentDrawing.id) {
        dispatch({
          type: "update-current-drawing",
          name: trimmedName,
          updatedAt: updated.metadata.updatedAt,
        });
      }

      await refreshSummaries();
      await loadSelectedDetail(drawingId);
    },
    [
      dispatch,
      loadSelectedDetail,
      refreshSummaries,
      state.currentDrawing.id,
    ],
  );

  const updateDrawingMetadata = useCallback(
    async (
      drawingId: string,
      update: { description?: string; tags?: string[] },
    ) => {
      const updated = await updateMetadata(
        drawingId,
        update,
      );
      if (!updated) {
        return;
      }

      await refreshSummaries();
      await loadSelectedDetail(drawingId);
    },
    [loadSelectedDetail, refreshSummaries],
  );

  return {
    summaries,
    selectedDetail,
    refreshSummaries,
    selectDrawing,
    createNewDrawing,
    duplicateDrawing,
    deleteDrawing,
    renameDrawing,
    updateDrawingMetadata,
  };
}
