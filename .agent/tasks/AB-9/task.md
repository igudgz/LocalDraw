# Task Brief

## Task ID

AB-9

## Titulo

Fase 4: Ferramenta de elipse

## Fase do roadmap

Fase 4: Ferramenta de elipse

## Spec / TLC

* Feature: ellipse-tool
* Spec: `.specs/features/ellipse-tool/spec.md`
* Sizing: Small
* Requisitos cobertos (REQ-NNN): REQ-001 a REQ-005

## Jira Tracking

* Epic key: AB-4
* Task key: AB-9
* Board: AB
* Current column: Ready for development

## Contexto

Batch MVP 003 — Ferramentas de desenho (Onda 1, Trilha A). Fases 0–3 concluídas; espelhar implementação do retângulo.

## Objetivo

Implementar ferramenta de elipse com click-drag, preview, commit no estado, renderização e integração com seleção/movimento existentes.

## Escopo

* `src/features/tools/ellipseTool.ts` — lógica completa espelhando `rectangleTool.ts`
* `src/features/editor/EditorViewport.tsx` — sessão ellipse, preview, pointer handlers
* `src/app/app.css` — cursor crosshair para `.is-ellipse-tool`
* Registro mínimo já existente em toolbar/types/ElementRenderer/EllipseElement

## Fora de escopo

* Persistência, import/export, parser, technical-doc, resize, estilos, undo/redo, atalhos
* Texto, seta (tasks AB-10/AB-11)

## Criterios de aceite

* [ ] (REQ-001) Usuário seleciona ferramenta Oval
* [ ] (REQ-002) Usuário clica e arrasta; preview elíptico tracejado visível
* [ ] (REQ-003) Elipse criada e salva no estado (`add-element`)
* [ ] (REQ-004) Elipse renderizada no SVG
* [ ] (REQ-005) Elipse auto-selecionada; movível via Select

## Arquivos esperados

* `src/features/tools/ellipseTool.ts`
* `src/features/editor/EditorViewport.tsx`
* `src/app/app.css`
* `.agent/runs/AB-9/implementation-report.md`

## Verificacoes esperadas

* `npm run build` passa
* `npm run lint` passa
* Smoke headless opcional (padrão LD-004-rectangle)

## Evidencia esperada

* implementation/review/qa/token-report em `.agent/runs/AB-9/`
* Commit atomico: `feat(editor): add ellipse tool with click-drag creation`
