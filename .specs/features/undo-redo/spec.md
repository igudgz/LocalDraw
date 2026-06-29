# Spec - undo-redo

Fase TLC: Specify (sempre obrigatoria). Local: `.specs/features/undo-redo/spec.md`.

## Feature ID

undo-redo

## Fase do roadmap

Fase 9: Undo e redo (ROADMAP.md)

## Scope sizing

Sizing escolhido: Medium
Justificativa: Feature clara com ~6 arquivos (historyReducer, editorActions, editorReducer, keyboard hook/component, testes); estende padrao de history ja presente em `editorTypes.ts` — Design inline, Tasks implicitas.

## Contexto

Fases 0–8 concluidas em main. O `editorState` ja possui `history.past` e `history.future` com tipo `EditorStateSnapshot` (elements, selectedElementIds, activeTool, viewport). O `historyReducer.ts` tem apenas `createEmptyHistory`. O `editorReducer.ts` nao possui cases UNDO/REDO nem wrapping de push para mutations. AB-12 (resize) e AB-13 (styles) ja estao em main neste worktree.

## Objetivo

Permitir desfazer e refazer alteracoes nos elementos do desenho via actions UNDO/REDO e atalhos de teclado, com historico limitado a 50 snapshots.

## Requisitos (IDs rastreaveis)

| ID | Requisito | Criterio de aceite verificavel |
|----|-----------|--------------------------------|
| REQ-001 | History push/pop/clear | `historyReducer.ts` expoe funcoes para push snapshot (limite 50), pop past (undo), pop future (redo), e clear future ao push; snapshots contem apenas `elements` (array) |
| REQ-002 | Actions UNDO e REDO | `editorActions.ts` define actions `{ type: "undo" }` e `{ type: "redo" }` |
| REQ-003 | Reducer undo/redo | `editorReducer.ts` trata undo/redo restaurando `elements` do snapshot; selecao/viewport/tool nao entram no snapshot |
| REQ-004 | Undoable mutations | Toda action que muta elements (`add-element`, `update-element`, `update-element-label`, `update-element-text`, `resize-element`, `update-element-style`) empilha snapshot antes de aplicar a mutation; lista explicita em modulo dedicado ou constante documentada |
| REQ-005 | Convencao extensivel | Novos tipos undoable sao adicionados a lista explicita `UNDOABLE_ACTION_TYPES` (ou equivalente) com comentario de convencao; actions nao listadas nao empilham historico |
| REQ-006 | Atalhos de teclado | Ctrl/Cmd+Z desfaz; Ctrl/Cmd+Shift+Z e Ctrl/Cmd+Y refazem; handler global no Editor ou App; nao dispara quando foco esta em input/textarea/contenteditable |
| REQ-007 | Limite de historico | `past` nunca excede 50 snapshots; entradas mais antigas sao descartadas |
| REQ-008 | restore-drawing limpa historico | Action `restore-drawing` continua zerando past/future (regressao) |

## Fora de escopo

* Delete element (AB-18 / Fase 13)
* Copy/paste (AB-18)
* Atalhos de ferramentas (AB-18)
* Undo de viewport, tool ou selecao
* Nao tocar em `features/persistence`, `features/technical-doc`, `features/tools`, `features/projects`, `features/export`

## Gray areas / discuss

Decisao: snapshots armazenam **somente** `elements[]` (deep clone), nao selectedElementIds/viewport/tool. Undo/redo restaura elementos; selecao permanece como esta (comportamento conservador, alinhado ao escopo minimo).

Decisao: `update-element` durante drag continua empilhando a cada dispatch (sem coalescing nesta fase); coalescing pode ser follow-up.

## Restricoes do projeto

* Nao usar `@excalidraw/excalidraw`, codigo ou componentes oficiais do Excalidraw
* Nao adicionar biblioteca pronta de whiteboard/editor visual
* Manter SVG-first no MVP
* Nao instalar dependencias novas

## Referencias

* `ROADMAP.md` Fase 9
* Jira: AB-14 (Epic AB-4)
* `src/features/history/historyTypes.ts`, `src/features/editor/editorTypes.ts`
