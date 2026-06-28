# Jira Board Template

## Board Name

LocalDraw Development

## Jira Cloud/Site

TBD

## Project Key

TBD

## Board Type

Kanban / TBD

## Required Columns

| Column | Purpose |
| --- | --- |
| Ready for development | Task planejada, aceita pelo PM Agent e pronta para Implementation Agent. |
| in development | Task em execucao pelo Implementation Agent. |
| review | Task pronta para Review Agent e QA Agent. |
| done | Task aprovada por review, QA, metricas e gates automaticos. |

## Workflow Rules

* PM Agent cria ou confirma cards em `Ready for development`.
* Implementation Agent pode mover para `in development` quando iniciar a task.
* Review Agent pode mover para `review` quando a implementacao estiver pronta para revisao.
* QA Agent ou PM Agent pode mover para `done` quando todos os gates passarem.
* Cards bloqueados devem voltar para `Ready for development` ou `in development`, conforme decisao do PM Agent.

## Agent Permissions

* Agentes podem mover cards usando transicoes disponiveis do Jira.
* Agentes devem listar transicoes antes de mover cards.
* Agentes devem registrar toda movimentacao no relatorio correspondente.
* Agentes nao podem deletar cards, Epics, boards, projetos, comentarios ou historico remoto sem aprovacao humana explicita.

## Setup Status

TBD

## Notes

Se a ferramenta disponivel nao permitir criar ou configurar board diretamente, registrar o bloqueio tecnico e pedir aprovacao humana para configuracao manual ou alternativa.
