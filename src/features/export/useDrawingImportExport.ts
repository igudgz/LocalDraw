import { useCallback, useRef, useState, type ChangeEvent } from "react";
import type { Dispatch } from "react";
import type { EditorAction } from "../editor/editorActions";
import type { EditorState } from "../editor/editorTypes";
import { parseLocalDrawFile } from "../persistence/localDrawImporter";
import { localProjectRepository } from "../persistence/localProjectRepository";
import {
  drawingRecordFromEditorState,
  exportAsLocalDraw,
} from "./exportAsJson";
import { downloadPngExport } from "./exportAsPng";
import { downloadSvgExport } from "./exportAsSvg";

type UseDrawingImportExportOptions = {
  flushSave: () => Promise<void>;
  refreshSummaries: () => Promise<void>;
};

export function useDrawingImportExport(
  state: EditorState,
  dispatch: Dispatch<EditorAction>,
  options: UseDrawingImportExportOptions,
) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);

  const exportLocalDraw = useCallback(async () => {
    const existing = await localProjectRepository.getById(state.currentDrawing.id);
    const record = drawingRecordFromEditorState(state, existing);
    exportAsLocalDraw(record);
  }, [state]);

  const exportSvg = useCallback(() => {
    downloadSvgExport(state.elements, state.currentDrawing.name);
  }, [state.currentDrawing.name, state.elements]);

  const exportPng = useCallback(async () => {
    setIsExportingPng(true);

    try {
      await downloadPngExport(state.elements, state.currentDrawing.name);
    } catch (error) {
      console.error("Failed to export PNG", error);
      setImportError("Failed to export PNG");
    } finally {
      setIsExportingPng(false);
    }
  }, [state.currentDrawing.name, state.elements]);

  const openImportPicker = useCallback(() => {
    setImportError(null);
    fileInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    async (file: File | undefined) => {
      if (!file) {
        return;
      }

      setImportError(null);

      const raw = await file.text();
      const result = parseLocalDrawFile(raw);

      if (!result.ok) {
        setImportError(result.error);
        return;
      }

      await options.flushSave();

      const record = await localProjectRepository.importDrawing(result.file);
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

      await options.refreshSummaries();
    },
    [dispatch, options],
  );

  const handleImportInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";

      void handleImportFile(file).catch((error) => {
        console.error("Failed to import .localdraw file", error);
        setImportError("Failed to import .localdraw file");
      });
    },
    [handleImportFile],
  );

  return {
    fileInputRef,
    importError,
    isExportingPng,
    exportLocalDraw,
    exportSvg,
    exportPng,
    openImportPicker,
    handleImportInputChange,
  };
}
