# Task Brief — AB-12

## Task ID

AB-12

## Fase do roadmap

Fase 7: Resize e edição básica

## Contexto

Batch `mvp-batch-005-resize`, worktree `LocalDraw-resize`, branch `feat/mvp-batch-005-resize`. Epic AB-4.

## Objetivo

Adicionar handles de resize e lógica de redimensionamento para rectangle, ellipse, arrow endpoints e text.

## Escopo

* `SelectionBox.tsx` — handles visuais interativos
* `elementGeometry.ts` — `resizeElement()` para todos os tipos suportados
* `editorActions.ts` — action `resize-element`
* `editorReducer.ts` — case `resize-element`
* `EditorViewport.tsx` — captura pointer events dos handles (padrão existente de select drag)
* Testes unitários em `elementGeometry.test.ts` e/ou `editorReducer.test.ts` derivados dos REQ da spec

## Fora de escopo

* Undo/redo (AB-14), estilos, atalhos (AB-18)
* `features/persistence`, `features/technical-doc`, `features/tools`, `features/projects`, `features/export`

## Referencias

* `.specs/features/resize/spec.md`
* `.agent/ORCHESTRATION.md`
* Padrões: `update-element`, `translateElementTo`, `selectTool.ts`

## Criterios de aceite

* [ ] REQ-001: Handles visíveis na seleção
* [ ] REQ-002: Retângulo redimensionável
* [ ] REQ-003: Elipse redimensionável
* [ ] REQ-004: Seta com endpoints ajustáveis
* [ ] REQ-005: Texto redimensionável
* [ ] REQ-006: Action `resize-element` no reducer
* [ ] REQ-007: Pointer events nos handles sem conflito com move
* [ ] REQ-008: Seleção e move preservados após resize

## Arquivos esperados

* `src/features/selection/SelectionBox.tsx`
* `src/features/elements/elementGeometry.ts`
* `src/features/editor/editorActions.ts`
* `src/features/editor/editorReducer.ts`
* `src/features/editor/EditorViewport.tsx`
* `src/features/elements/elementGeometry.test.ts` (novo ou estendido)
* `.specs/features/resize/validation.md` (Verifier)

## Riscos

* Conflito pointer capture entre resize handle e select drag
* Arrow bounding box desincronizado após mover endpoint
* Text baseline vs bounds top-left

## Verificacoes

* `npm run build`
* `npm test` (vitest)
* `npm run lint` se existir

## Evidencia esperada

* `.agent/runs/AB-12/implementation-report.md`
* `.agent/runs/AB-12/review-report.md`
* `.agent/runs/AB-12/qa-report.md`
* `.agent/runs/AB-12/token-report.md`
* `.agent/runs/AB-12/batch-summary.md`
