# Spec - keyboard-shortcuts

Fase TLC: Specify. Local: `.specs/features/keyboard-shortcuts/spec.md`.

## Feature ID

keyboard-shortcuts

## Fase do roadmap

Fase 13 — Atalhos de teclado (Jira AB-18)

## Scope sizing

Sizing escolhido: **Medium**
Justificativa: Handler global + action delete-element + estado local copiedElement; ~6 arquivos, testes unitários; sem nova arquitetura.

## Contexto

O editor já expõe ferramentas via toolbar e suporta undo/redo (AB-14). Atalhos de teclado melhoram produtividade e alinham com a experiência esperada de whiteboard.

## Objetivo

Atalhos globais de teclado para delete, undo/redo, copy/paste local, limpar seleção e alternar ferramentas, sem interferir em edição inline de texto.

## Requisitos (IDs rastreaveis)

| ID | Requisito | Criterio de aceite verificavel |
|----|-----------|--------------------------------|
| REQ-001 | Delete/Backspace remove elemento selecionado | Com seleção ativa, dispatch `delete-element`; elemento removido do estado |
| REQ-002 | Ctrl/Cmd+Z desfaz | Dispatch `undo`; integrado com histórico AB-14 |
| REQ-003 | Ctrl/Cmd+Shift+Z e Ctrl/Cmd+Y refazem | Dispatch `redo` |
| REQ-004 | Ctrl/Cmd+C copia elemento selecionado | Estado local `copiedElement`; não usa clipboard do sistema |
| REQ-005 | Ctrl/Cmd+V cola elemento copiado | Novo elemento com id único e offset de posição |
| REQ-006 | Esc limpa seleção | Dispatch `set-selection` com `elementId: null` |
| REQ-007 | V/R/O/A/T/H ativam ferramentas | Dispatch `set-active-tool` para select/rectangle/ellipse/arrow/text/hand |
| REQ-008 | Atalhos suprimidos durante edição inline | Quando `inlineEditActive` ou target editável, nenhum atalho dispara |

## Fora de escopo

* Reimplementar undo/redo (AB-14)
* Clipboard do sistema
* features/persistence, technical-doc, projects, export

## Restricoes do projeto

* Nao usar Excalidraw oficial
* Nao adicionar biblioteca de whiteboard pronta
* SVG-first

## Referencias

* `ROADMAP.md` Fase 13
* Jira AB-18, Epic AB-4
