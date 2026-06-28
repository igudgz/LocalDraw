# Spec - arrow-tool

## Feature ID

arrow-tool

## Fase do roadmap

Fase 6: Ferramenta de seta

## Scope sizing

Sizing escolhido: Small
Justificativa: Click-drag espelha retangulo; marker SVG para ponta; label opcional.

## Objetivo

Permitir criar setas click-drag com ponta visual, label editavel, selecao e movimento.

## Requisitos

| ID | Requisito | Criterio de aceite verificavel |
|----|-----------|--------------------------------|
| REQ-001 | Ferramenta Arrow na toolbar | Botao Arrow ativa `activeTool === "arrow"` |
| REQ-002 | Click-drag cria seta | Linha de start a end com preview tracejado |
| REQ-003 | Ponta visual | Marker SVG na ponta da seta |
| REQ-004 | Label editavel | Campo label opcional editavel apos criacao (double-click ou prompt inline) |
| REQ-005 | Selecionar e mover | Seta movivel via Select (atualiza x/y e start/end) |

## Fora de escopo

Binding entre elementos, resize handles, persistencia, undo.

## Referencias

* Jira AB-11, Epic AB-4
