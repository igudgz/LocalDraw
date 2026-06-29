# AB-18 — E2E Evidence

**Date:** 2026-06-28  
**Tool:** Playwright (headless Chrome) via `smoke-keyboard-shortcuts.mjs`  
**URL:** `http://localhost:5176/`  
**Dev server:** `npm run dev -- --port 5176 --strictPort` (HTTP 200 confirmado)

## Playwright MCP (user-playwright)

**Status:** Nao disponivel — browser context fechado na sessao.  
**Fallback:** script Playwright local em `.agent/runs/AB-18/smoke-keyboard-shortcuts.mjs`

## Cursor IDE Browser (smoke parcial)

* `R` → botao Rect `aria-pressed=true` — **PASS** (browser_press_key)

## Smoke script — resultados

```
TOOL_R_PASS
DRAW_PASS count=1
TOOL_V_PASS
DELETE_PASS
UNDO_PASS
ESC_PASS
TOOL_H_PASS
SCREENSHOT_PASS
```

## Cenarios cobertos

| Atalho | Verificacao |
|--------|-------------|
| R | Rect tool ativo |
| (draw) | 1 elemento no canvas |
| V | Select tool ativo |
| Delete | elemento removido |
| Ctrl+Z | undo restaura elemento |
| Esc | selection handles ausentes |
| H | Hand tool ativo |

## Artefatos

* `smoke-keyboard-shortcuts.mjs`
* `smoke-keyboard-shortcuts.png` (screenshot final)
* `package.json` (playwright devDependency local ao run)

## Comando

```bash
cd .agent/runs/AB-18 && npm install && node smoke-keyboard-shortcuts.mjs
```

Pré-requisito: dev server em `http://localhost:5176/`.
