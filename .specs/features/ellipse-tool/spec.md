# Spec - ellipse-tool

Fase TLC: Specify (sempre obrigatoria). Local: `.specs/features/ellipse-tool/spec.md`.

## Feature ID

ellipse-tool

## Fase do roadmap

Fase 4: Ferramenta de elipse (ROADMAP.md)

## Scope sizing

Sizing escolhido: Small
Justificativa: Espelha retângulo (Fase 3); <=3 arquivos principais (`ellipseTool.ts`, `EditorViewport.tsx`, `app.css`) mais tipos já existentes.

## Contexto

Fases 0–3 concluídas (bootstrap, viewport, seleção, retângulo). Elipse usa o mesmo padrão click-drag com preview e commit no pointer up.

## Objetivo

Permitir criar elipses no canvas via ferramenta Oval, com preview durante arraste, persistência no estado do editor, seleção e movimentação via ferramenta Select existente.

## Requisitos (IDs rastreaveis)

| ID | Requisito | Criterio de aceite verificavel |
|----|-----------|--------------------------------|
| REQ-001 | Ferramenta ellipse na toolbar | Botão Oval ativa `activeTool === "ellipse"` (aria-pressed) |
| REQ-002 | Desenho click-drag | Pointer down/move/up cria sessão com preview elíptico tracejado |
| REQ-003 | Commit no estado | Elipse com bounds normalizados é adicionada via `add-element` quando width/height >= 1px |
| REQ-004 | Renderização SVG | `EllipseElement` renderiza elipse com estilos de `styleDefaults` |
| REQ-005 | Seleção e movimento | Após criar, auto-selecionar; usuário pode trocar para Select e mover |

## Fora de escopo

* Persistência, import/export, parser, technical-doc
* Resize (Fase 7), estilos (Fase 8), undo/redo (Fase 9), atalhos (Fase 13)
* Texto dentro da elipse

## Restricoes do projeto

* Nao usar `@excalidraw/excalidraw`, codigo ou componentes oficiais do Excalidraw
* Nao adicionar biblioteca pronta de whiteboard/editor visual
* Manter SVG-first no MVP

## Referencias

* `ROADMAP.md` Fase 4
* Jira: AB-9 (Epic AB-4)
* Padrao: `src/features/tools/rectangleTool.ts`, `EditorViewport.tsx` (rectangle)
