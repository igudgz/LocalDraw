# Task Brief

## Task ID

AB-13

## Titulo

Fase 8: Estilos visuais — painel de propriedades

## Fase do roadmap

Fase 8: Estilos visuais (ROADMAP.md)

## Spec / TLC

* Feature: styles
* Spec: `.specs/features/styles/spec.md`
* Sizing: Medium
* Requisitos cobertos (REQ-NNN): REQ-001, REQ-002, REQ-003, REQ-004, REQ-005

## Jira Tracking

* Epic key: AB-4
* Task key: AB-13
* Board: AB board (projeto AB)
* Current column: Ready for development

## Contexto

O editor ja possui `styleDefaults` e elementos com campos de estilo. Falta UI para editar estilos do elemento selecionado e action/reducer correspondente.

## Objetivo

Criar painel de propriedades no painel direito quando um elemento estiver selecionado, permitindo editar cores, espessura, opacidade e fonte (texto).

## Escopo

* Criar `PropertiesPanel.tsx` em `src/features/editor/`
* Adicionar action `update-element-style` em `editorActions.ts`
* Adicionar case em `editorReducer.ts`
* Integrar no layout (`App.tsx`) condicionado a selecao ativa
* Testes unitarios do reducer (e UI se aplicavel)
* CSS minimo para o painel

## Fora de escopo

* Undo/redo (AB-14)
* Resize (outro worktree)
* Atalhos (AB-18)
* Nao tocar em `features/persistence`, `features/technical-doc`, `features/tools`, `features/projects`, `features/export`

## Referencias

* `.specs/features/styles/spec.md`
* `src/features/editor/editorTypes.ts`
* `src/features/elements/elementTypes.ts`
* Jira AB-13 / Epic AB-4

## Criterios de aceite

* [ ] (REQ-001) `update-element-style` atualiza campos de estilo do elemento alvo
* [ ] (REQ-002) Painel direito alterna entre PropertiesPanel e TechnicalDocPanel conforme selecao
* [ ] (REQ-003) Controles stroke/background/width/opacity para todo elemento
* [ ] (REQ-004) fontSize/fontFamily apenas para text
* [ ] (REQ-005) UI sincronizada com elemento selecionado; canvas reflete mudancas

## Arquivos esperados

* `src/features/editor/PropertiesPanel.tsx` (novo)
* `src/features/editor/editorActions.ts`
* `src/features/editor/editorReducer.ts`
* `src/features/editor/editorReducer.test.ts`
* `src/app/App.tsx`
* `src/app/app.css` (estilos do painel)

## Riscos

* Text bounds apos mudanca de fontSize — reutilizar `estimateTextBounds` se necessario
* Selecao multipla nao suportada hoje (single selection OK)

## Verificacoes esperadas

* [ ] Respeita roadmap e escopo
* [ ] Sem dependencias proibidas
* [ ] `npm run build` passa
* [ ] `npm test` passa

## Evidencia esperada

* implementation-report.md, review-report.md, qa-report.md, token-report.md
