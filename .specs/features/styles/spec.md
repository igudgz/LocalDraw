# Spec - styles

Fase TLC: Specify (sempre obrigatoria). Local: `.specs/features/styles/spec.md`.

## Feature ID

styles

## Fase do roadmap

Fase 8: Estilos visuais (ROADMAP.md)

## Scope sizing

Sizing escolhido: Medium
Justificativa: Feature clara com ~6 arquivos (PropertiesPanel, actions, reducer, App layout, CSS, testes); sem novo padrao arquitetural — Design inline, Tasks implicitas.

## Contexto

Fases 0–7 e technical-doc concluidas em main. O `editorState` ja possui `styleDefaults` usados na criacao de elementos. Elementos possuem campos de estilo em `elementTypes.ts`. O painel direito hoje exibe `TechnicalDocPanel`; quando o usuario seleciona um elemento, o painel deve mostrar propriedades editaveis desse elemento.

## Objetivo

Permitir alterar aparência basica do elemento selecionado via painel de propriedades no painel direito, atualizando o estado do editor em tempo real.

## Requisitos (IDs rastreaveis)

| ID | Requisito | Criterio de aceite verificavel |
|----|-----------|--------------------------------|
| REQ-001 | Action `update-element-style` | Reducer aceita action com `elementId` e campos opcionais (`strokeColor`, `backgroundColor`, `strokeWidth`, `opacity`, `fontSize`, `fontFamily`); atualiza apenas o elemento alvo e `updatedAt` |
| REQ-002 | Painel condicional no layout | Com selecao ativa (`selectedElementIds.length > 0`), painel direito mostra `PropertiesPanel`; sem selecao, mostra `TechnicalDocPanel` |
| REQ-003 | Controles de estilo comuns | Painel expoe stroke color, background color, stroke width e opacity para qualquer elemento selecionado |
| REQ-004 | Controles de texto | Para elemento `text`, painel expoe tambem font size e font family |
| REQ-005 | Sincronizacao UI | Controles refletem valores atuais do elemento selecionado; alterar um controle dispara `update-element-style` e o canvas re-renderiza com o novo estilo |

## Fora de escopo

* Undo/redo (AB-14 / Fase 9)
* Resize (outro worktree / Fase 7)
* Atalhos de teclado (AB-18 / Fase 13)
* Alterar `styleDefaults` globais via UI
* Modificar `features/persistence`, `features/technical-doc`, `features/tools`, `features/projects`, `features/export`

## Gray areas / discuss

Decisao: painel de propriedades **substitui** `TechnicalDocPanel` enquanto houver selecao (nao convive lado a lado). Usuario limpa selecao para voltar ao painel de analise.

## Restricoes do projeto

* Nao usar `@excalidraw/excalidraw`, codigo ou componentes oficiais do Excalidraw
* Nao adicionar biblioteca pronta de whiteboard/editor visual
* Manter SVG-first no MVP
* Nao instalar dependencias novas

## Referencias

* `ROADMAP.md` Fase 8
* Jira: AB-13 (Epic AB-4)
* `src/features/editor/editorTypes.ts`, `src/features/elements/elementTypes.ts`
