export function TechnicalDocPanel() {
  return (
    <aside className="technical-doc-panel" aria-label="Right analysis panel">
      <div className="panel-heading">
        <h2>Analysis</h2>
        <p>Diagram summary</p>
      </div>
      <ul className="metadata-list" aria-label="Initial editor state summary">
        <li>
          <strong>Elements</strong>
          0
        </li>
        <li>
          <strong>Open questions</strong>
          0
        </li>
      </ul>
    </aside>
  );
}
