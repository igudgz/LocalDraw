# LocalDraw - Agent Operating Guide

## Objetivo do documento

Este documento responde: "Como os agentes devem operar nesse projeto?"

Fonte principal: `ROADMAP.md` na raiz do projeto, documentos em `docs/` e `.agent/ORCHESTRATION.md`.

## Modelo de orquestracao

LocalDraw usa PM-driven orchestration.

O PM Agent e o orquestrador principal. Ele planeja batches, cria ou le tasks, delega execucao para agentes especializados, acompanha evidencias, avalia gates automaticos e consolida o resultado final para revisao humana.

O usuario normalmente revisa apenas o final do batch. O PM Agent nao deve pedir revisao humana a cada task quando os gates automaticos passam. Revisao humana intermediaria deve acontecer somente diante de bloqueio real, decisao pendente, mudanca de escopo, mudanca de arquitetura, dependencia proibida ou risco alto de retrabalho.

Fluxo esperado:

```text
Usuario
  -> PM Agent / Orchestrator
  -> Implementation Agent
  -> Review Agent
  -> QA Agent
  -> Metrics Agent
  -> PM Agent consolida o batch
  -> Usuario revisa o resultado final
```

Consultar `.agent/ORCHESTRATION.md` para sequencia por task, gates automaticos, condicoes obrigatorias de parada e uso de subagents.

## Regra de shell

Shell rule: use `rtk <external-command>` for executables. For PowerShell cmdlets/functions/aliases/script blocks, use `rtk powershell -NoProfile -Command "<PowerShell command>"`.

## Como agentes devem trabalhar

Agentes devem trabalhar a partir de tarefas pequenas, rastreaveis e verificaveis.

Antes de editar qualquer arquivo, o agente deve:

1. Ler o task brief ou a solicitacao atual.
2. Ler os documentos relevantes em `docs/`.
3. Ler `.agent/ORCHESTRATION.md` quando houver fluxo de batch ou delegacao.
4. Ler o papel correspondente em `.agent/roles/`.
5. Identificar fase do roadmap, objetivo, escopo, fora de escopo e criterios de aceite.
6. Declarar qualquer ponto `TBD` ou `A definir` em vez de assumir decisoes nao documentadas.

## Autonomia intermediaria

Agentes tem autonomia intermediaria dentro do batch.

O PM Agent pode disparar Implementation Agent, Review Agent, QA Agent e Metrics Agent sem pedir confirmacao humana entre cada etapa quando a task estiver clara e os gates automaticos forem atendidos.

Agentes principais podem usar subagents quando isso reduzir risco, melhorar validacao ou permitir investigacao especializada. Subagents devem receber uma pergunta especifica por meio de `.agent/templates/subagent-dispatch.md` e nao devem expandir o escopo.

Agentes devem parar e pedir aprovacao humana quando a proxima acao alterar escopo, stack, arquitetura principal, dependencias, formato `.localdraw` ou decisoes de produto.

## O que agentes podem decidir sozinhos

* Ajustes de documentacao dentro do escopo da task.
* Organizacao de templates e relatorios.
* Pequenas correcoes de consistencia entre documentos.
* Criacao de task briefs baseados em fases ja definidas.
* Dispatch de agentes principais conforme `.agent/templates/agent-dispatch.md`.
* Dispatch de subagents para perguntas especializadas.
* Marcar dados ausentes como `TBD`, `A definir` ou `Nao informado`.
* Escolher verificacoes locais simples para confirmar arquivos e conteudo.
* Sugerir riscos ou melhorias, desde que marcados como sugestao.

## O que exige aprovacao humana

* Criar app React/Vite quando a tarefa atual for apenas documentacao.
* Instalar dependencias.
* Alterar `package.json` para features da aplicacao.
* Alterar stack base.
* Usar `@excalidraw/excalidraw`.
* Usar componentes oficiais ou codigo oficial do Excalidraw.
* Adicionar bibliotecas prontas de whiteboard/editor visual.
* Introduzir backend remoto.
* Introduzir login, multiusuario, sync em nuvem ou telemetria.
* Alterar o formato `.localdraw` depois de usado por dados reais sem plano de migracao.
* Trocar a estrategia SVG-first no MVP.
* Mudar Definition of Done, objetivos de fase ou escopo principal.
* Criar ou alterar cards de Jira sem instrucao explicita.
* Deletar qualquer artefato remoto, incluindo cards Jira e recursos GitHub.

## Como lidar com Jira

Jira e a fonte operacional para Epics, tasks e board antes de publicacao no GitHub.

Antes de criar ou publicar o projeto no GitHub, o PM Agent deve confirmar que:

* Existe um Epic Jira para o pacote principal.
* Existem tasks Jira vinculadas ao Epic.
* Existe um board Jira para o projeto.
* O board tem as colunas `Ready for development`, `in development`, `review` e `done`.

* Usar `.agent/templates/jira-story.md` como base para stories.
* Usar `.agent/templates/jira-epic.md` para Epics.
* Usar `.agent/templates/jira-task.md` para tasks.
* Usar `.agent/templates/jira-board.md` para configuracao esperada do board.
* Nao criar, editar, mover ou comentar cards sem solicitacao explicita ou sem um dispatch do PM Agent.
* Agentes podem mover cards entre colunas quando a transicao fizer parte do fluxo aprovado.
* Antes de mover card, listar ou consultar transicoes disponiveis e usar a transicao real retornada pelo Jira.
* Registrar toda movimentacao de card nos relatorios da task.
* Nao deletar cards, Epics, boards, projetos, comentarios ou historico remoto sem aprovacao humana explicita citando o alvo exato.
* Quando criar texto para Jira, incluir referencias para `docs/PRODUCT_SPEC.md`, `docs/TECHNICAL_DOC.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md` e `docs/QA_STRATEGY.md` conforme necessario.
* Manter Summary curto e verificavel.
* Incluir objetivo, escopo, fora de escopo, criterios de aceite, QA checklist e Definition of Done.
* Nao prometer datas se nao houver informacao oficial. Usar `TBD`.

## Como lidar com task briefs

* Todo task brief deve apontar para uma fase do roadmap.
* Deve conter objetivo, escopo, fora de escopo, referencias, criterios de aceite, arquivos esperados, riscos, verificacoes e evidencia esperada.
* Tarefas devem ser pequenas o suficiente para serem implementadas e revisadas de forma isolada.
* Se a tarefa envolver UI, incluir validacao manual esperada.
* Se a tarefa envolver parser, persistencia ou exportacao, incluir validacao de dados.

## Como registrar evidencias

Todas as execucoes precisam gerar evidencia.

Evidencias devem registrar:

* Task ID ou fonte da solicitacao.
* Arquivos criados e alterados.
* Comandos executados.
* Resultado das verificacoes.
* Decisoes tomadas.
* Agentes disparados.
* Subagents usados.
* Riscos residuais.
* Pontos `TBD` ou `A definir`.
* Evidencias E2E com Playwright MCP quando a task exigir e a ferramenta estiver disponivel.

Para trabalho leve, evidencias podem ficar na resposta final. Para trabalho auditavel ou batch, criar uma pasta em `.agent/runs/<run-id>/` e usar os templates em `.agent/templates/`.

## Como registrar metricas

Metricas devem ser registradas pelo Metrics Agent quando houver execucao em batch.

* Usar `.agent/templates/token-report.md`.
* Registrar agentes usados, subagents usados, iteracoes, retrabalho, comandos e arquivos alterados quando relevante.
* Registrar tokens apenas quando a ferramenta ou plataforma informar dados oficiais.
* Nao estimar nem inventar numeros de tokens.
* Se nao houver uso oficial de tokens, registrar como `Nao informado`.

## Como evitar sair do escopo

* Ler `Fora de escopo` antes de editar.
* Trabalhar somente na fase solicitada.
* Nao antecipar fases futuras sem aprovacao.
* Nao transformar sugestoes em requisitos.
* Nao alterar documentos fonte sem preservar decisoes importantes.
* Preferir `TBD` a inferencias sem base.

## Como lidar com retrabalho

Quando houver retrabalho:

* Registrar o motivo.
* Indicar se foi causado por ambiguidade, bug, mudanca de escopo, falha de teste ou revisao.
* Atualizar relatorios afetados.
* Evitar refatoracoes oportunistas fora do escopo.
* Pedir aprovacao se o retrabalho mudar arquitetura, dependencias ou produto.

## Como finalizar uma execucao

A resposta final deve incluir:

* O que foi feito.
* Arquivos criados.
* Arquivos alterados.
* Como foi verificado.
* Pontos `TBD` ou `A definir`.
* Riscos ou inconsistencias encontradas.
* Confirmacao de escopo.

Em batches, o PM Agent deve consolidar o pacote em `.agent/templates/batch-summary.md` ou em um arquivo equivalente dentro de `.agent/runs/<run-id>/`.

Quando houver implementacao, tambem incluir testes executados e resultado.

Quando houver UI implementada, agentes devem considerar validacao E2E com Playwright MCP. Se a ferramenta nao estiver disponivel, registrar `Nao disponivel` em vez de inventar evidencia.

## Restricoes permanentes

* Nenhum agente deve usar `@excalidraw/excalidraw`.
* Nenhum agente deve usar codigo oficial do Excalidraw.
* Nenhum agente deve usar componentes oficiais do Excalidraw.
* Nenhum agente deve adicionar biblioteca pronta de whiteboard/editor visual.
* Nenhum agente deve fazer IA virar dependencia obrigatoria do MVP.
* Nenhum agente deve implementar features fora do roadmap sem aprovacao humana.
