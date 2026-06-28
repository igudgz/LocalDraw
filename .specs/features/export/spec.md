# Spec - export

## Feature ID

export

## Fase do roadmap

Fase 12 — Importação e exportação

## Scope sizing

Sizing escolhido: **Large**

## Objetivo

Exportar/importar `.localdraw`, exportar SVG e PNG. Validar versão e tratar erros.

## Requisitos

| ID | Requisito | Critério de aceite verificável |
|----|-----------|--------------------------------|
| REQ-001 | Export .localdraw | Gera JSON válido LocalDrawFile v1, download com extensão .localdraw |
| REQ-002 | Import .localdraw | Parse, valida version/app, carrega como novo ou substitui desenho ativo |
| REQ-003 | Erro arquivo inválido | Mensagem clara ao usuário |
| REQ-004 | Export SVG | Arquivo SVG válido com elementos renderizados |
| REQ-005 | Export PNG | Imagem PNG válida via canvas |
| REQ-006 | Import não quebra existentes | Desenhos no IndexedDB permanecem intactos |
| REQ-007 | UI mínima | Botões/ações na toolbar ou sidebar para export/import |

## Fora de escopo

Alteração formato .localdraw, compatibilidade .excalidraw

## Referências

ROADMAP Fase 12, Jira AB-17
