# AB-18 — QA Report

**Agent:** QA Agent  
**Task:** AB-18  
**Date:** 2026-06-28 (atualizado)  
**Status:** Pass

## Acceptance criteria

| Criterio | Result |
|----------|--------|
| Atalhos principais funcionam | Pass — unit tests + E2E smoke |
| Atalhos não quebram edição de texto | Pass — inlineEditActive guard + isEditableTarget |
| Usuário alterna ferramentas pelo teclado | Pass — V/R/H verificados em E2E |

## Automated tests

* `npm test`: 106/106 PASS
* `keyboardShortcuts.test.ts`: 6 tests PASS
* `editorReducer.test.ts`: delete + undo PASS

## E2E smoke (Playwright)

Script: `.agent/runs/AB-18/smoke-keyboard-shortcuts.mjs`  
Evidencia: `.agent/runs/AB-18/e2e-evidence.md`  
Screenshot: `.agent/runs/AB-18/smoke-keyboard-shortcuts.png`

Cenarios PASS: R, V, Delete, Ctrl+Z, Esc, H

## Dev server

* `npm run dev -- --port 5176 --strictPort` — HTTP 200
* Evidencia: `dev-server-evidence.md`

## Playwright MCP

Nao disponivel (browser fechado). Fallback script local executado com sucesso.

## Regression

* Undo/redo (AB-14): intacto
* persistence/export/projects: nao alterados

## Blockers

None.
