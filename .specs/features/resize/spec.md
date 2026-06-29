# Spec - resize

Fase TLC: Specify (sempre obrigatoria). Local: `.specs/features/resize/spec.md`.

## Feature ID

AB-12

## Fase do roadmap

Fase 7 — Resize e edição básica

## Scope sizing

* `Medium` (feature clara, ~6 arquivos, <10 passos): Design inline, Tasks implicitas.

Sizing escolhido: **Medium**
Justificativa: Feature bem delimitada no roadmap; segue padrões existentes (`update-element`, `translateElementTo`, `SelectionBox`); sem nova arquitetura nem biblioteca.

## Contexto

O editor já suporta seleção e movimentação (`update-element` + `translateElementTo`). A `SelectionBox` renderiza apenas um retângulo de contorno sem handles interativos. Esta feature adiciona redimensionamento básico para retângulos, elipses, setas (endpoints) e texto.

## Objetivo

Permitir alterar tamanho dos elementos selecionados via handles visuais, atualizando o estado do editor durante o drag e preservando seleção e movimentação existentes.

## Requisitos (IDs rastreaveis)

| ID | Requisito | Criterio de aceite verificavel |
|----|-----------|--------------------------------|
| REQ-001 | Handles de resize visíveis na seleção | Com elemento selecionado e ferramenta select, `SelectionBox` exibe handles nos cantos (shapes/text) ou nos endpoints (arrow) |
| REQ-002 | Redimensionar retângulo | Arrastar handle de canto altera `x`, `y`, `width`, `height`; dimensões mínimas >= 1px; sem width/height negativos |
| REQ-003 | Redimensionar elipse | Mesmo comportamento de bounds que retângulo via `resizeElement` |
| REQ-004 | Ajustar endpoints de seta | Handles em start/end movem `startX/Y` e `endX/Y`; bounding box (`x`, `y`, `width`, `height`) recalculado |
| REQ-005 | Redimensionar texto | Handles alteram `width`/`height` com mínimo; posição top-left (`x`, `y` baseline) consistente com `getElementBounds` |
| REQ-006 | Action `resize-element` no reducer | Nova action em `editorActions.ts` e case em `editorReducer.ts` aplicando `resizeElement()` |
| REQ-007 | Pointer events nos handles | Drag em handle dispara `resize-element` via `EditorViewport` (canvas); não inicia drag de movimentação |
| REQ-008 | Seleção preservada após resize | Elemento permanece selecionado; movimentação (`update-element`) continua funcionando após resize |

## Fora de escopo

* Undo/redo (AB-14)
* Estilos visuais (outro worktree)
* Atalhos de teclado (AB-18)
* `features/persistence`, `features/technical-doc`, `features/tools`, `features/projects`, `features/export`
* Rotação via handles
* Multi-seleção resize

## Gray areas / discuss

N/A — sizing Medium; decisões seguem padrão `normalizeBoundsFromDrag` e `translateElementTo`.

Decisões inline:
* Handles de canto para rectangle/ellipse/text (8 handles ou 4 cantos — preferir 4 cantos + opcional edge para MVP).
* Dimensão mínima: 1px (consistente com commit de draw preview).
* Text resize ajusta `width`/`height` sem recalcular texto automaticamente.
* Arrow: handles apenas em start/end, não nos cantos do bounding box.

## Restricoes do projeto

* Nao usar `@excalidraw/excalidraw`, codigo ou componentes oficiais do Excalidraw.
* Nao adicionar biblioteca pronta de whiteboard/editor visual.
* Manter SVG-first no MVP.
* Nao tornar IA dependencia obrigatoria do MVP.

## Referencias

* `docs/ROADMAP.md` — Fase 7
* `src/features/elements/elementGeometry.ts` — `translateElementTo`, `normalizeBoundsFromDrag`, `getElementBounds`
* `src/features/editor/editorActions.ts` — `update-element`
* `src/features/editor/EditorViewport.tsx` — pointer session pattern
* Jira: AB-12 (Epic AB-4)
