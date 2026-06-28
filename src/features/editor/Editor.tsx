import type { Dispatch } from "react";
import { EditorCanvas } from "./EditorCanvas";
import { EditorToolbar } from "./EditorToolbar";
import type { EditorAction } from "./editorActions";
import type { EditorState } from "./editorTypes";
import { useDrawingImportExport } from "../export/useDrawingImportExport";

type EditorProps = {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  flushSave: () => Promise<void>;
  refreshSummaries: () => Promise<void>;
};

export function Editor({
  dispatch,
  flushSave,
  refreshSummaries,
  state,
}: EditorProps) {
  const importExport = useDrawingImportExport(state, dispatch, {
    flushSave,
    refreshSummaries,
  });

  return (
    <section className="editor-shell" aria-label="Drawing editor">
      <EditorToolbar
        activeTool={state.activeTool}
        fileInputRef={importExport.fileInputRef}
        importError={importExport.importError}
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
