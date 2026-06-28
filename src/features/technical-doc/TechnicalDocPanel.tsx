import { useEffect, useState } from "react";
import { useEditorElements } from "../editor/EditorContext";
import {
  AnalysisPreview,
  AnalysisPreviewTabs,
  MarkdownExportActions,
} from "./TechnicalDocPanelParts";
import { parseDiagram } from "./diagramParser";
import { buildTechnicalDocInput } from "./technicalDocContext";
import {
  elementsSignature,
  generateTechnicalDoc,
} from "./technicalDocService";
import type { TechnicalDocAnalysis } from "./technicalDocTypes";

const DEFAULT_DOC_OPTIONS = {
  outputLanguage: "pt-BR",
  docStyle: "detailed",
} as const;

type PreviewTab = "json" | "markdown";

export function TechnicalDocPanel() {
  const elements = useEditorElements();
  const [analysis, setAnalysis] = useState<TechnicalDocAnalysis | null>(null);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("markdown");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const currentSignature = elementsSignature(elements);

  useEffect(() => {
    if (analysis && analysis.elementsSignature !== currentSignature) {
      setAnalysis(null);
      setCopyStatus("idle");
    }
  }, [analysis, currentSignature]);

  const handleAnalyze = async () => {
    const parsed = parseDiagram(elements);
    const input = buildTechnicalDocInput(parsed, DEFAULT_DOC_OPTIONS);
    const output = await generateTechnicalDoc(input, "local");

    setAnalysis({
      input,
      output,
      elementsSignature: currentSignature,
    });
    setPreviewTab("markdown");
    setCopyStatus("idle");
  };

  const markdown = analysis?.output.markdown ?? "";
  const parsedJson = analysis
    ? JSON.stringify(analysis.input.diagram, null, 2)
    : "";

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
          {analysis?.output.openQuestions.length ?? 0}
        </li>
      </ul>
      <button
        type="button"
        className="analyze-diagram-button"
        onClick={() => {
          void handleAnalyze();
        }}
      >
        Analyze Diagram
      </button>
      {analysis ? (
        <>
          <AnalysisPreviewTabs
            previewTab={previewTab}
            onSelectTab={setPreviewTab}
          />
          <MarkdownExportActions
            markdown={markdown}
            copyStatus={copyStatus}
            onCopy={() => {
              void handleCopy();
            }}
            onDownload={handleDownload}
          />
          <AnalysisPreview
            previewTab={previewTab}
            parsedJson={parsedJson}
            markdown={markdown}
          />
        </>
      ) : (
        <p className="empty-note">
          Run analysis to preview structured diagram data.
        </p>
      )}
    </aside>
  );
}
