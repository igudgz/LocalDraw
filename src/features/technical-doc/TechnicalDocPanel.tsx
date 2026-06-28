import { useState } from "react";
import { useEditorElements } from "../editor/EditorContext";
import { parseDiagram } from "./diagramParser";
import type { ParsedDiagram } from "./technicalDocTypes";

export function TechnicalDocPanel() {
  const elements = useEditorElements();
  const [parsedDiagram, setParsedDiagram] = useState<ParsedDiagram | null>(
    null,
  );

  const handleAnalyze = () => {
    setParsedDiagram(parseDiagram(elements));
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
        <pre
          className="parsed-diagram-json"
          aria-label="Parsed diagram JSON preview"
        >
          {JSON.stringify(parsedDiagram, null, 2)}
        </pre>
      ) : (
        <p className="empty-note">Run analysis to preview structured diagram data.</p>
      )}
    </aside>
  );
}
