# QA Report — AB-20

## Task

| Field | Value |
|-------|-------|
| Task ID | AB-20 |
| Title | Fase 15: Technical Doc sem IA |
| Branch | `feat/mvp-batch-005-techdoc` |
| Commit | `a3b2e6c` |
| Agent | QA Agent |
| Date | 2026-06-28 |

## Verdict

**Pass**

All automated gates pass. Acceptance criteria REQ-010 through REQ-014 are satisfied by implementation and unit tests (REQ-012 and REQ-013 UI wiring validated by code inspection; no UI/E2E test in scope).

---

## Acceptance Criteria Checklist

| ID | Requirement | Status | Evidence |
|----|-------------|--------|----------|
| REQ-010 | `markdownGenerator.ts` generates Markdown from `ParsedDiagram` | **Pass** | `generateMarkdown(parsed: ParsedDiagram): string` in `markdownGenerator.ts` returns non-empty string starting with `# Technical Doc`. Unit test `REQ-010: generates Markdown from ParsedDiagram`. |
| REQ-011 | Structure: Contexto, Componentes identificados, Fluxo principal, Integrações, Decisões assumidas, Riscos e limitações, Perguntas em aberto | **Pass** | All seven section headings emitted via `SECTION_HEADINGS` and `section()`. Unit tests cover headings, component placement, flow, integrations, and open questions. |
| REQ-012 | Markdown preview in right panel after analysis | **Pass** | `TechnicalDocPanel.tsx`: `handleAnalyze` sets `parsedDiagram`, defaults `previewTab` to `"markdown"`, renders `<pre className="technical-doc-markdown-preview">` with `generateMarkdown` output. Unit test `REQ-012: produces pre-formatted Markdown suitable for panel preview`. Validated by code inspection. |
| REQ-013 | Copy and download `.md` buttons | **Pass** | `TechnicalDocPanel.tsx`: **Copy Markdown** uses `navigator.clipboard.writeText(markdown)`; **Download .md** uses `Blob` + anchor download (`technical-doc.md`). Buttons disabled when no markdown. Unit test `REQ-013: produces copyable and downloadable Markdown content`. Validated by code inspection. |
| REQ-014 | Offline generation (no external calls) | **Pass** | `generateMarkdown` is a pure synchronous function with no `fetch`, network, or LLM dependencies. Unit test `REQ-014: generates Markdown offline without external calls` spies on `globalThis.fetch` and confirms zero calls. |

---

## Commands Run + Results

| Command | Exit code | Result |
|---------|-----------|--------|
| `npm run lint` | 0 | Pass — `tsc -b --pretty false` completed with no errors |
| `npm run build` | 0 | Pass — TypeScript build + Vite production build succeeded (`dist/` generated) |
| `npm run test` | 0 | Pass — 18/18 tests (9 `diagramParser.test.ts` + 9 `markdownGenerator.test.ts`, Vitest 3.2.6) |

---

## Functional Notes

- **Generator coverage:** Unit tests cover REQ-010 through REQ-014 with realistic `ParsedDiagram` fixtures built via `parseDiagram`. Section content mapping (components, flow, integrations, open questions) is verified.
- **REQ-012 / REQ-013 (UI):** Panel integration is present — JSON/Markdown tabs, Markdown default after Analyze, copy/download actions wired to generated content. Manual/E2E validation was not executed in this QA run; recommended as optional smoke check when canvas has drawable elements.
- **Scope compliance:** No new dependencies. No Excalidraw or whiteboard libraries. No external API or LLM calls in generator or panel.
- **Known limitations (documented in implementation report):** Content depends solely on `ParsedDiagram`; copy requires secure browser context for `navigator.clipboard`; download filename is fixed (`technical-doc.md`).

---

## Blockers

None.

---

## Artifacts Reviewed

- `.agent/tasks/AB-20-markdown-generator/task.md`
- `.specs/features/technical-doc/spec.md`
- `.agent/runs/AB-20/implementation-report.md`
- `src/features/technical-doc/markdownGenerator.ts`
- `src/features/technical-doc/markdownGenerator.test.ts`
- `src/features/technical-doc/TechnicalDocPanel.tsx`
- `src/app/app.css`

## Missing Artifacts

- `.agent/runs/AB-20/review-report.md` — not present at QA time (does not block Pass).
