import { useMemo, useState } from "react";
import { useEditorElements } from "../editor/EditorContext";
import { parseDiagram } from "./diagramParser";
import { generateMarkdown } from "./markdownGenerator";
import type { ParsedDiagram } from "./technicalDocTypes";

type PreviewTab = "json" | "markdown";

export function TechnicalDocPanel() {
  const elements = useEditorElements();
  const [parsedDiagram, setParsedDiagram] = useState<ParsedDiagram | null>(
    null,
  );
  const [previewTab, setPreviewTab] = useState<PreviewTab>("markdown");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const markdown = useMemo(
    () => (parsedDiagram ? generateMarkdown(parsedDiagram) : ""),
    [parsedDiagram],
  );

  const handleAnalyze = () => {
    setParsedDiagram(parseDiagram(elements));
    setPreviewTab("markdown");
    setCopyStatus("idle");
  };

  const handleCopy = async () => {
    if (!markdown) {
      return;
    }

    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  const handleDownload = () => {
    if (!markdown) {
      return;
    }

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "technical-doc.md";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="technical-doc-panel" aria-label="Right analysis panel">
      <div className="panel-heading">
        <h2>Analysis</h2>
        <p>Diagram summary</p>
      </div>
      <ul className="metadata-list" aria-label="Editor element summary">
        <li>
          <strong>Elements</strong>
          {elements.length}
        </li>
        <li>
          <strong>Open questions</strong>
          {parsedDiagram?.openQuestions.length ?? 0}
        </li>
      </ul>
      <button
        type="button"
        className="analyze-diagram-button"
        onClick={handleAnalyze}
      >
        Analyze Diagram
      </button>
      {parsedDiagram ? (
        <>
          <div
            className="technical-doc-preview-tabs"
            role="tablist"
            aria-label="Analysis preview tabs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={previewTab === "json"}
              className={
                previewTab === "json"
                  ? "preview-tab preview-tab-active"
                  : "preview-tab"
              }
              onClick={() => setPreviewTab("json")}
            >
              JSON
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={previewTab === "markdown"}
              className={
                previewTab === "markdown"
                  ? "preview-tab preview-tab-active"
                  : "preview-tab"
              }
              onClick={() => setPreviewTab("markdown")}
            >
              Markdown
            </button>
          </div>
          <div className="technical-doc-actions">
            <button
              type="button"
              className="technical-doc-action-button"
              onClick={handleCopy}
              disabled={!markdown}
            >
              {copyStatus === "copied"
                ? "Copied"
                : copyStatus === "error"
                  ? "Copy failed"
                  : "Copy Markdown"}
            </button>
            <button
              type="button"
              className="technical-doc-action-button"
              onClick={handleDownload}
              disabled={!markdown}
            >
              Download .md
            </button>
          </div>
          {previewTab === "json" ? (
            <pre
              className="parsed-diagram-json"
              aria-label="Parsed diagram JSON preview"
            >
              {JSON.stringify(parsedDiagram, null, 2)}
            </pre>
          ) : (
            <pre
              className="technical-doc-markdown-preview"
              aria-label="Technical doc Markdown preview"
            >
              {markdown}
            </pre>
          )}
        </>
      ) : (
        <p className="empty-note">
          Run analysis to preview structured diagram data.
        </p>
      )}
    </aside>
  );
}
