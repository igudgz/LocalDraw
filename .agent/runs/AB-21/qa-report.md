# QA Report — AB-21

## Task

| Field | Value |
|-------|-------|
| Task ID | AB-21 |
| Title | Fase 16: Preparacao para agente |
| Branch | `feat/mvp-batch-005-techdoc` |
| Commit | `bc11679` |
| Agent | QA Agent |
| Date | 2026-06-28 |

## Verdict

**Pass**

All automated gates pass. Acceptance criteria REQ-015 through REQ-019 are satisfied by implementation and unit tests (REQ-019 panel wiring validated by code inspection; no UI/E2E test in scope).

---

## Acceptance Criteria Checklist

| ID | Requirement | Status | Evidence |
|----|-------------|--------|----------|
| REQ-015 | Types `TechnicalDocInput` and `TechnicalDocOutput` defined | **Pass** | `technicalDocTypes.ts`: `TechnicalDocInput` (diagram, optional userContext, outputLanguage, docStyle) and `TechnicalDocOutput` (markdown, assumptions, openQuestions). Supporting types `TechnicalDocOptions`, `TechnicalDocOutputLanguage`, `TechnicalDocStyle` also defined. Used across context, service, tests, and prompt spec. |
| REQ-016 | Function transforms `ParsedDiagram` + options into agent context | **Pass** | `buildTechnicalDocInput(parsed, options)` in `technicalDocContext.ts` maps diagram + options to `TechnicalDocInput`, trims/omits blank `userContext`. Unit tests: `REQ-016: transforms ParsedDiagram and options into TechnicalDocInput`, `includes trimmed userContext when provided`, `omits userContext when blank after trim`. |
| REQ-017 | Versioned prompt base in repository | **Pass** | `src/features/technical-doc/prompts/technical-doc-v1.md` present with version `technical-doc-v1`, input/output contract description, rules (no invented tech, register uncertainties, preserve language), and section/style guidance. Intentionally not loaded at runtime (reference for AB-22). |
| REQ-018 | Local fallback (`generateTechnicalDocLocal`) uses generator without AI | **Pass** | `generateTechnicalDocLocal(input)` in `technicalDocService.ts` delegates to `generateMarkdown(input.diagram)`, copies assumptions/openQuestions. `TechnicalDocGenerator` interface + `aiTechnicalDocGeneratorStub` rejects with AB-22 blocked error. Unit tests: `REQ-018: generates TechnicalDocOutput without external calls`, `maps assumptions and openQuestions from diagram`, `AI stub rejects without calling external APIs`. |
| REQ-019 | App continues functional without IA; fallback available | **Pass** | `TechnicalDocPanel.tsx` uses `buildTechnicalDocInput` + `generateTechnicalDocLocal` (no direct `generateMarkdown` import). Analyze → Markdown preview, copy, and download remain wired. Unit test `REQ-019: local fallback returns markdown usable offline`. Validated by code inspection. |

---

## Commands Run + Results

| Command | Exit code | Result |
|---------|-----------|--------|
| `npm run lint` | 0 | Pass — `tsc -b --pretty false` completed with no errors |
| `npm run build` | 0 | Pass — TypeScript build + Vite production build succeeded (`dist/` generated) |
| `npm run test` | 0 | Pass — 25/25 tests (9 `diagramParser.test.ts` + 9 `markdownGenerator.test.ts` + 3 `technicalDocContext.test.ts` + 4 `technicalDocService.test.ts`, Vitest 3.2.6) |

---

## Functional Notes

- **Contract coverage:** REQ-015 types are exercised by context and service tests; no standalone type-only test file (acceptable — contracts validated via usage).
- **REQ-017 (prompt):** File satisfies “versioned in repository”; runtime loading deferred to AB-22 per implementation report.
- **REQ-019 (UI):** Panel local path preserves AB-20 behavior (JSON/Markdown tabs, copy/download). Manual/E2E validation not executed in this QA run; optional smoke check recommended when canvas has drawable elements.
- **Known limitations (documented):** `outputLanguage` and `docStyle` are on the contract but do not alter local fallback output yet; AI stub not exposed in UI.
- **Scope compliance:** No new dependencies. No Excalidraw or whiteboard libraries. No external API or LLM calls in service or panel.

---

## Blockers

None.

---

## Artifacts Reviewed

- `.agent/tasks/AB-21-agent-contracts/task.md`
- `.specs/features/technical-doc/spec.md`
- `.agent/runs/AB-21/implementation-report.md`
- `src/features/technical-doc/technicalDocTypes.ts`
- `src/features/technical-doc/technicalDocContext.ts`
- `src/features/technical-doc/technicalDocContext.test.ts`
- `src/features/technical-doc/technicalDocService.ts`
- `src/features/technical-doc/technicalDocService.test.ts`
- `src/features/technical-doc/prompts/technical-doc-v1.md`
- `src/features/technical-doc/TechnicalDocPanel.tsx`

## Missing Artifacts

- `.agent/runs/AB-21/review-report.md` — not present at QA time (does not block Pass).
