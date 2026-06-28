# Task Brief

## Task ID

AB-10

## Titulo

Fase 5: Ferramenta de texto

## Fase do roadmap

Fase 5: Ferramenta de texto

## Spec / TLC

* Feature: text-tool
* Spec: `.specs/features/text-tool/spec.md`
* Sizing: Medium
* Requisitos: REQ-001 a REQ-005

## Jira Tracking

* Epic key: AB-4
* Task key: AB-10

## Objetivo

Implementar ferramenta de texto: click cria elemento, edicao inline, render SVG, select/move.

## Escopo

* `src/features/tools/textTool.ts`
* `src/features/editor/EditorViewport.tsx` — click handler, text editing overlay
* `src/features/editor/editorActions.ts` — `update-element-text` action (minimal)
* `src/features/editor/editorReducer.ts` — handler
* `src/app/app.css` — estilos editor texto se necessario
* `TextElement.tsx` — ajustes minimos se necessario

## Fora de escopo

Persistencia, undo, atalhos, resize, estilos panel.

## Criterios de aceite

* [ ] REQ-001 Text tool ativa
* [ ] REQ-002 Click cria texto
* [ ] REQ-003 Texto editavel
* [ ] REQ-004 Render SVG
* [ ] REQ-005 Select e move

## Commit

`feat(editor): add text tool with click-to-create and inline editing`
