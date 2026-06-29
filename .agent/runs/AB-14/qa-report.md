# QA Report

## Story testada

* Story/Task ID: AB-14
* Titulo: Fase 9: Undo e redo
* Fase do roadmap: Fase 9 (ROADMAP.md)
* QA Agent: QA Agent (Verifier)

## Jira Tracking

* Epic key: AB-4
* Task key: AB-14
* Initial column: Ready for development
* Final column: Ready for development (nao movido — dispatch nao autorizou transicao)
* Transition executed: Nenhuma

## Ambiente

* Sistema operacional: Windows 10 (win32 10.0.26200)
* Navegador: Nao usado (validacao manual de atalhos nao executada)
* Branch/commit: `feat/mvp-batch-007-history` @ `5cace98` (alteracoes AB-14 uncommitted no worktree)
* Build/dev server: `npm test`, `npm run build` — ambos OK
* Playwright MCP: Nao disponivel para esta execucao
* Dados usados: fixtures de teste em `historyReducer.test.ts`, `editorReducer.test.ts`

## Fluxos testados

* History push/pop/clear com limite 50 (`historyReducer.test.ts`)
* Undo add-element, move, style; redo style (`editorReducer.test.ts`)
* Limite de 50 snapshots no editor reducer (`editorReducer.test.ts`)
* No-op undo quando past vazio (`editorReducer.test.ts`)
* No push de historico em style com elementId invalido (`editorReducer.test.ts`)
* Clear future ao push apos undo (`editorReducer.test.ts`)
* Regressao restore-drawing zera past/future (`editorReducer.test.ts`)
* Suite completa do projeto (98 testes) — regressao geral
* Inspecao de codigo: atalhos de teclado (`useEditorKeyboardShortcuts.ts`), lista undoable (`undoableActions.ts`), wrapper no reducer

## Criterios de aceite

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| REQ-001 push/pop/clear com limite 50 | Pass | `historyReducer.ts`: `pushSnapshot`, `popPast`, `popFuture`, `MAX_HISTORY=50`; push limpa `future`; snapshot = `LocalDrawElement[]`. 7 testes em `historyReducer.test.ts`. |
| REQ-002 actions undo/redo | Pass | `editorActions.ts` define `{ type: "undo" }` e `{ type: "redo" }`. |
| REQ-003 reducer restaura elements | Pass | `editorReducer.ts` cases undo/redo restauram `elements` via popPast/popFuture; selecao preservada no teste "undoes update-element move and keeps selection unchanged". |
| REQ-004 todas mutations listadas empilham snapshot | Pass | `UNDOABLE_ACTION_TYPES` lista 6 tipos; wrapper em `editorReducer` chama `pushSnapshot` antes de apply para `isUndoableAction`. Testes de undo cobrem add/update/style; demais tipos cobertos pelo mecanismo generico (sem teste undo dedicado para resize/label/text). |
| REQ-005 lista explicita documentada | Pass | `undoableActions.ts` com `UNDOABLE_ACTION_TYPES` e comentario de convencao para novos tipos. |
| REQ-006 atalhos Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y; skip em inputs | Pass | `useEditorKeyboardShortcuts.ts`: Ctrl/Cmd+Z (undo), Ctrl/Cmd+Shift+Z e Ctrl/Cmd+Y (redo); `isEditableTarget` ignora input/textarea/contenteditable; montado em `Editor.tsx`. Sem teste unitario do hook — evidencia por inspecao de codigo. |
| REQ-007 past <= 50 | Pass | `pushSnapshot` descarta entradas antigas; testes em `historyReducer.test.ts` e `editorReducer.test.ts` (`keeps at most 50 snapshots in past`). |
| REQ-008 restore-drawing zera historico | Pass | `editorReducer.ts` case restore-drawing define `history: { past: [], future: [] }`; teste "resets history, tool, and selection when switching drawings". |

Resultados permitidos: `Pass`, `Fail`, `Not tested`.

## Bugs encontrados

| Severidade | Descricao | Passos para reproduzir | Evidencia |
| --- | --- | --- | --- |
| — | Nenhum bug encontrado nesta execucao | — | — |

## Problemas de usabilidade

* Drag continua empilhando um snapshot por dispatch (sem coalescing) — aceito na spec; historico pode ficar longo durante movimento continuo.
* Atalhos de teclado nao validados manualmente no browser nesta execucao.

## Regressoes possiveis

* Nenhuma regressao detectada na suite completa (98/98 passando).
* `features/persistence`, `features/export`, `features/tools` nao alterados (conforme escopo).

## Subagents usados

* Nenhum

## Evidencias

* Comandos executados:
  * `npm test` — 20 files, **98 passed (98)**, duration ~8.5s
  * `npm run build` — `tsc -b && vite build` OK, built in ~203ms
* Evidencias Playwright MCP: Nao disponivel
* Prints/videos: Nenhum
* Logs: stdout dos comandos acima
* Arquivos relevantes:
  * `src/features/history/historyReducer.ts`, `historyReducer.test.ts`, `undoableActions.ts`
  * `src/features/editor/editorReducer.ts`, `editorActions.ts`, `editorReducer.test.ts`, `editorTypes.ts`
  * `src/features/editor/useEditorKeyboardShortcuts.ts`, `Editor.tsx`

## Verdict

* `Approved`

Verdict final: **Approved** (equivalente a **Pass** para o batch AB-14)

## Observacoes

* Alteracoes AB-14 estao uncommitted no worktree `LocalDraw-history`.
* `review-report.md` nao presente em `.agent/runs/AB-14/` nesta execucao.
* Discrimination sensor (mutation testing) nao executado — ver `validation.md`.
* Follow-up sugerido (nao bloqueante): testes unitarios para `useEditorKeyboardShortcuts` e undo dedicado para resize/label/text; validacao manual de atalhos no browser.
