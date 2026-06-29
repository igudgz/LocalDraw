# Task Brief

## Task ID

AB-14

## Titulo

Fase 9: Undo e redo

## Fase do roadmap

Fase 9: Undo e redo (ROADMAP.md)

## Spec / TLC

* Feature: undo-redo
* Spec: `.specs/features/undo-redo/spec.md`
* Sizing: Medium
* Requisitos cobertos (REQ-NNN): REQ-001 a REQ-008

## Jira Tracking

* Epic key: AB-4
* Task key: AB-14
* Board: AB board (projeto AB)
* Current column: Ready for development

## Contexto

O editor ja possui `history.past`/`history.future` no estado e tipo `EditorStateSnapshot`, mas a logica de push/pop e cases UNDO/REDO ainda nao existem. AB-12 (resize) e AB-13 (styles) estao presentes em `editorActions.ts`.

## Objetivo

Implementar undo/redo para todas as mutations de elements, com limite de 50 snapshots e atalhos Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y.

## Escopo

* `src/features/history/historyReducer.ts` — push/pop/clear, limite 50
* `src/features/history/historyReducer.test.ts` — testes unitarios
* `src/features/history/undoableActions.ts` (ou similar) — lista explicita UNDOABLE_ACTION_TYPES + convencao documentada
* `src/features/editor/editorActions.ts` — actions undo/redo
* `src/features/editor/editorReducer.ts` — wrapper push + cases undo/redo
* `src/features/editor/editorReducer.test.ts` — testes undo/redo
* Atalhos em `Editor.tsx` ou `EditorCanvas.tsx` ou hook dedicado
* Atualizar `editorTypes.ts` se necessario (snapshot = elements only)

## Fora de escopo

* Delete, copy/paste, atalhos de ferramentas (AB-18)
* Nao tocar em `features/persistence`, `features/technical-doc`, `features/tools`, `features/projects`, `features/export`

## Referencias

* `.specs/features/undo-redo/spec.md`
* `src/features/history/historyTypes.ts`
* `src/features/editor/editorTypes.ts`
* Jira AB-14 / Epic AB-4

## Criterios de aceite

* [ ] (REQ-001) push/pop/clear com limite 50
* [ ] (REQ-002) actions undo/redo
* [ ] (REQ-003) reducer restaura elements
* [ ] (REQ-004) todas mutations listadas empilham snapshot
* [ ] (REQ-005) lista explicita documentada
* [ ] (REQ-006) atalhos Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y; skip em inputs
* [ ] (REQ-007) past <= 50
* [ ] (REQ-008) restore-drawing zera historico

## Arquivos esperados

* `src/features/history/historyReducer.ts`
* `src/features/history/historyReducer.test.ts`
* `src/features/history/undoableActions.ts`
* `src/features/editor/editorActions.ts`
* `src/features/editor/editorReducer.ts`
* `src/features/editor/editorReducer.test.ts`
* `src/features/editor/Editor.tsx` ou hook de teclado

## Riscos

* Drag de elemento gera muitos snapshots — aceito nesta fase (sem coalescing)
* Deep clone de elements — usar structuredClone ou spread recursivo adequado

## Verificacoes esperadas

* [ ] Respeita roadmap e escopo
* [ ] Sem dependencias proibidas
* [ ] `npm run build` passa
* [ ] `npm test` passa

## Evidencia esperada

* implementation-report.md, review-report.md, qa-report.md, token-report.md, batch-summary.md
