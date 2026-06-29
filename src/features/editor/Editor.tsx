import { EditorCanvas } from "./EditorCanvas";
import { useState } from "react";
import type { LocalDrawElement } from "../elements/elementTypes";
import {
  useEditorDispatch,
  useEditorSession,
  useEditorState,
} from "./EditorContext";
import { EditorToolbar } from "./EditorToolbar";
import { useDrawingImportExport } from "../export/useDrawingImportExport";
import { useEditorKeyboardShortcuts } from "./useEditorKeyboardShortcuts";

export function Editor() {
  const state = useEditorState();
  const dispatch = useEditorDispatch();
  const { flushSave, projects } = useEditorSession();
  const [copiedElement, setCopiedElement] = useState<LocalDrawElement | null>(
    null,
  );
  useEditorKeyboardShortcuts({ copiedElement, setCopiedElement });

  const importExport = useDrawingImportExport(state, dispatch, {
    flushSave,
    refreshSummaries: projects.refreshSummaries,
  });

  return (
    <section className="editor-shell" aria-label="Drawing editor">
      <EditorToolbar
        activeTool={state.activeTool}
        fileInputRef={importExport.fileInputRef}
        toolbarError={importExport.toolbarError}
        isExportingPng={importExport.isExportingPng}
        viewport={state.viewport}
        onExportLocalDraw={() => {
          void importExport.exportLocalDraw().catch((error) => {
            console.error("Failed to export .localdraw file", error);
          });
        }}
        onExportPng={() => {
          void importExport.exportPng();
        }}
        onExportSvg={importExport.exportSvg}
        onImportInputChange={importExport.handleImportInputChange}
        onImportLocalDraw={importExport.openImportPicker}
        onSelectTool={(tool) => dispatch({ type: "set-active-tool", tool })}
        onToggleGrid={() =>
          dispatch({
            type: "set-viewport",
            viewport: { ...state.viewport, showGrid: !state.viewport.showGrid },
          })
        }
      />
      <EditorCanvas dispatch={dispatch} state={state} />
    </section>
  );
}
