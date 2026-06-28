# Task Brief

## Task ID

AB-11

## Titulo

Fase 6: Ferramenta de seta

## Fase do roadmap

Fase 6: Ferramenta de seta

## Spec / TLC

* Feature: arrow-tool
* Spec: `.specs/features/arrow-tool/spec.md`
* Sizing: Small
* Requisitos: REQ-001 a REQ-005

## Jira Tracking

* Epic key: AB-4
* Task key: AB-11

## Objetivo

Implementar ferramenta de seta click-drag com ponta SVG, label editavel, select/move.

## Escopo

* `src/features/tools/arrowTool.ts`
* `src/features/elements/ArrowElement.tsx` — marker arrowhead + label text
* `src/features/editor/EditorViewport.tsx` — arrow session/preview
* `editorActions.ts` / `editorReducer.ts` — `update-element-label` se necessario
* `src/app/app.css`

## Fora de escopo

Element binding, resize handles, persistencia, undo.

## Criterios de aceite

* [ ] REQ-001 Arrow tool ativa
* [ ] REQ-002 Click-drag cria seta
* [ ] REQ-003 Ponta visual
* [ ] REQ-004 Label editavel
* [ ] REQ-005 Select e move (atualiza bounds e start/end)

## Commit

`feat(editor): add arrow tool with arrowhead and editable label`
