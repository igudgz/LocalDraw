# Spec - projects

## Feature ID

projects

## Fase do roadmap

Fase 11 — Organização de desenhos

## Scope sizing

Sizing escolhido: **Medium**
Justificativa: UI sidebar + CRUD sobre repository existente (AB-15). Sem nova camada de storage.

## Objetivo

Permitir gerenciar desenhos salvos na sidebar: listar, criar, renomear, duplicar, excluir, editar descrição/tags, mostrar última alteração, carregar desenho selecionado no editor.

## Requisitos

| ID | Requisito | Critério de aceite verificável |
|----|-----------|--------------------------------|
| REQ-001 | Lista lateral | ProjectList renderiza desenhos de listSummaries |
| REQ-002 | Criar novo | Botão cria desenho vazio e seleciona |
| REQ-003 | Renomear | Usuário edita nome inline ou via input |
| REQ-004 | Duplicar | Cópia com novo id e nome "(copy)" |
| REQ-005 | Excluir | Remove do IndexedDB; se ativo, seleciona outro |
| REQ-006 | Descrição e tags | Campos editáveis persistidos |
| REQ-007 | Última alteração | Exibe updatedAt formatado |
| REQ-008 | Seleção carrega editor | Clicar desenho carrega no editor via lift state ou callback |

## Fora de escopo

* Import/export (AB-17)
* Ferramentas, undo/redo, estilos, resize
* Alteração elementTypes ou .localdraw format

## Referências

* ROADMAP.md Fase 11
* Jira AB-16 (Epic AB-4)
* Depende de AB-15 persistence layer
