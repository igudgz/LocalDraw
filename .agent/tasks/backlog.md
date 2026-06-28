# Backlog

## Batch atual

* Batch ID: MVP-BATCH-001
* Modo: sequential batch
* Tasks em ordem:
  * `LD-001-bootstrap`
  * `LD-002-viewport`

## Tasks planejadas

| Ordem | Task ID | Fase | Jira | Objetivo |
| --- | --- | --- | --- | --- |
| 1 | `LD-001-bootstrap` | Fase 0 | AB-5 | Criar bootstrap React + Vite + TypeScript, layout base e estado inicial do editor. |
| 2 | `LD-002-viewport` | Fase 1 | AB-6 | Criar viewport SVG com zoom e pan básicos. |

## Dependências

* `LD-002-viewport` depende de `LD-001-bootstrap`.
* Ambas as tasks dependem das restrições permanentes em `docs/PRODUCT_SPEC.md`, `docs/TECHNICAL_DOC.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/QA_STRATEGY.md` e `.agent/ORCHESTRATION.md`.
* Não há dependência aprovada de IA, persistência, exportação ou biblioteca pronta de whiteboard/editor visual neste batch.

## Status

| Task ID | Status | Notes |
| --- | --- | --- |
| `LD-001-bootstrap` | Concluído | Gates locais passaram; Jira AB-5 movido para `Concluído` e comentario `10001` criado. |
| `LD-002-viewport` | Concluído | Gates locais passaram; Jira AB-6 movido para `Concluído` e comentario `10004` criado. |

## Próxima task recomendada

`LD-002-viewport`
