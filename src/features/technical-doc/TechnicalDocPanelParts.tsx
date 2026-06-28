type PreviewTab = "json" | "markdown";

type AnalysisPreviewTabsProps = {
  previewTab: PreviewTab;
  onSelectTab: (tab: PreviewTab) => void;
};

export function AnalysisPreviewTabs({
  previewTab,
  onSelectTab,
}: AnalysisPreviewTabsProps) {
  return (
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
        onClick={() => onSelectTab("json")}
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
        onClick={() => onSelectTab("markdown")}
      >
        Markdown
      </button>
    </div>
  );
}

type MarkdownExportActionsProps = {
  markdown: string;
  copyStatus: "idle" | "copied" | "error";
  onCopy: () => void;
  onDownload: () => void;
};

export function MarkdownExportActions({
  markdown,
  copyStatus,
  onCopy,
  onDownload,
}: MarkdownExportActionsProps) {
  return (
    <div className="technical-doc-actions">
      <button
        type="button"
        className="technical-doc-action-button"
        onClick={onCopy}
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
        onClick={onDownload}
        disabled={!markdown}
      >
        Download .md
      </button>
    </div>
  );
}

type AnalysisPreviewProps = {
  previewTab: PreviewTab;
  parsedJson: string;
  markdown: string;
};

export function AnalysisPreview({
  previewTab,
  parsedJson,
  markdown,
}: AnalysisPreviewProps) {
  if (previewTab === "json") {
    return (
      <pre
        className="parsed-diagram-json"
        aria-label="Parsed diagram JSON preview"
      >
        {parsedJson}
      </pre>
    );
  }

  return (
    <pre
      className="technical-doc-markdown-preview"
      aria-label="Technical doc Markdown preview"
    >
      {markdown}
    </pre>
  );
}
