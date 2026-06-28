# Spec - text-tool

## Feature ID

text-tool

## Fase do roadmap

Fase 5: Ferramenta de texto

## Scope sizing

Sizing escolhido: Medium
Justificativa: Click-to-create + edicao inline requer acao de estado e UI overlay alem do padrao click-drag.

## Objetivo

Permitir criar textos no canvas, editar conteudo, renderizar no SVG e mover via Select.

## Requisitos

| ID | Requisito | Criterio de aceite verificavel |
|----|-----------|--------------------------------|
| REQ-001 | Ferramenta Text na toolbar | Botao Text ativa `activeTool === "text"` |
| REQ-002 | Criar texto no canvas | Click no canvas cria elemento text com placeholder editavel |
| REQ-003 | Editar texto | Usuario pode editar conteudo (input/textarea overlay ou contenteditable) |
| REQ-004 | Renderizacao SVG | `TextElement` renderiza texto com fontSize/fontFamily de styleDefaults |
| REQ-005 | Selecionar e mover | Texto selecionavel e movivel via ferramenta Select |

## Fora de escopo

Persistencia, undo/redo, atalhos, resize, estilos avancados.

## Referencias

* Jira AB-10, Epic AB-4
* Padrao: rectangle/ellipse para integracao viewport
