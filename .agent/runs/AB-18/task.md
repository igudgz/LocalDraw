# Task Brief — AB-18

## Task ID

AB-18

## Titulo

Fase 13: Atalhos de teclado

## Fase do roadmap

Fase 13 — Atalhos de teclado (`ROADMAP.md`)

## Spec / TLC

* Feature: `keyboard-shortcuts`
* Spec: `.specs/features/keyboard-shortcuts/spec.md`
* Sizing: **Medium**
* Requisitos cobertos: REQ-001 a REQ-008

## Jira Tracking

* Epic key: AB-4
* Task key: AB-18
* Board: Agents Board (AB)
* Final column: Concluído

## Contexto

O editor LocalDraw já possui toolbar, seleção, ferramentas de desenho e undo/redo (AB-14). Atalhos de teclado completam a experiência de whiteboard para o MVP core.

## Objetivo

Implementar handler global de teclado para delete, undo/redo, copy/paste local, limpar seleção e alternar ferramentas, sem interferir em edição inline de texto.

## Escopo

* Delete/Backspace → remover elemento selecionado (`delete-element`)
* Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Ctrl/Cmd+Y → undo/redo (AB-14)
* Ctrl/Cmd+C/V → copiar/colar local com offset
* Esc → limpar seleção
* V/R/O/A/T/H → ativar ferramentas
* Guard quando `TextEditorOverlay` ou `ArrowLabelEditorOverlay` ativos

## Fora de escopo

* Reimplementar undo/redo
* Clipboard do sistema
* `features/persistence`, `technical-doc`, `projects`, `export`

## Referencias

* `ROADMAP.md` Fase 13
* `.specs/features/keyboard-shortcuts/spec.md`
* Jira AB-18

## Criterios de aceite

* [x] (REQ-001) Delete/Backspace remove elemento selecionado
* [x] (REQ-002) Ctrl/Cmd+Z desfaz
* [x] (REQ-003) Ctrl/Cmd+Shift+Z e Ctrl/Cmd+Y refazem
* [x] (REQ-004) Ctrl/Cmd+C copia localmente
* [x] (REQ-005) Ctrl/Cmd+V cola com offset
* [x] (REQ-006) Esc limpa seleção
* [x] (REQ-007) V/R/O/A/T/H ativam ferramentas
* [x] (REQ-008) Atalhos suprimidos durante edição inline

## Arquivos esperados

* `src/features/editor/useEditorKeyboardShortcuts.ts`
* `src/features/editor/keyboardShortcutLogic.ts`
* `src/features/editor/keyboardShortcuts.test.ts`
* `src/features/editor/Editor.tsx`, `EditorContext.tsx`, `EditorViewport.tsx`
* `src/features/editor/editorActions.ts`, `editorReducer.ts`
* `src/features/history/undoableActions.ts`

## Riscos

* Conflito Ctrl+V (paste) vs tecla V (select tool) — mitigado por exigir modifier para paste
* Atalhos durante input de texto — mitigado por `inlineEditActive`

## Verificacoes esperadas

* [x] Respeita roadmap Fase 13
* [x] Fora de escopo respeitado
* [x] Sem dependências proibidas
* [x] Sem Excalidraw oficial
* [x] E2E Playwright MCP (smoke atalhos)
* [x] `npm run build`, `npm test`
* [x] Dev server `npm run dev -- --port 5176 --strictPort`

## Evidencia esperada

* `.agent/runs/AB-18/` — task, dispatches, reports, batch-summary, e2e-evidence
* PR #10 (merged)

## Observacoes

Último batch do MVP core.
