# LocalDraw - PM-Driven Orchestration

## Objetivo

Este documento define o fluxo de orquestracao de desenvolvimento do LocalDraw.

O PM Agent e o orquestrador principal do projeto. Ele planeja o batch, cria ou le tasks, delega execucao para agentes especializados, acompanha evidencias, valida gates automaticos e consolida o resultado final para revisao humana.

O PM Agent nao deve tentar implementar tudo sozinho. Implementacao, revisao, QA e metricas devem ser delegados para os agentes responsaveis.

## Modelo operacional

Fluxo padrao:

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

O usuario humano deve revisar preferencialmente apenas o resultado final do batch. O PM Agent deve interromper a execucao e pedir revisao humana somente quando houver uma condicao obrigatoria de parada ou uma decisao humana pendente.

## Metodologia spec-driven (TLC) integrada

O LocalDraw adota a skill `tlc-spec-driven` como metodologia interna de cada feature, mantendo o modelo de papeis como loop externo. O modelo de papeis decide quem executa; o TLC decide como cada feature evolui em fases auto-dimensionadas.

Mapa entre papeis e fases TLC:

```text
PM Agent          -> Specify, Design, Tasks (planejamento auto-dimensionado)
Implementation    -> Execute (task atomica -> gate -> commit atomico)
Review + QA       -> Verifier (autor != verificador, evidence-or-zero)
Metrics + PM      -> Lessons + STATE handoff
```

### Auto-sizing

Antes de iniciar uma feature, o PM Agent define o sizing, que determina a profundidade do fluxo:

| Sizing | Quando | Specify | Design | Tasks | Execute |
|--------|--------|---------|--------|-------|---------|
| Small | <=3 arquivos, uma frase | inline | pular | pular | implementar + verificar inline |
| Medium | feature clara, <10 tasks | spec breve | inline | implicitas | implementar + verificar |
| Large | multi-componente | spec + REQ IDs | arquitetura | breakdown + dependencias | verificar por task |
| Complex | ambiguidade, dominio novo | spec + discuss | research + arquitetura | breakdown + paralelizacao | UAT interativo |

Regras:

* Specify e Execute sao sempre obrigatorios.
* Design e pulado quando nao ha decisao de arquitetura nem novo padrao.
* Tasks e pulado quando ha <=3 passos obvios.
* Safety valve: se a listagem inline do Execute revelar >5 passos ou dependencias complexas, criar `tasks.md` formal.

### Estrutura `.specs/`

Artefatos de spec vivem em `.specs/`; evidencia de execucao em batch continua em `.agent/runs/` (ver `AD-002` em `.specs/STATE.md`).

```text
.specs/
  STATE.md                       # decisoes (AD-NNN) + handoff
  LESSONS.md                     # playbook de licoes (Verifier alimenta)
  features/<feature>/
    spec.md                      # Specify (sempre)
    context.md                   # decisoes de gray areas (so quando discuss roda)
    design.md                    # Design (Large/Complex)
    tasks.md                     # Tasks (Large/Complex)
    validation.md                # relatorio do Verifier
```

Templates correspondentes em `.agent/templates/`: `spec.md`, `design.md`, `tasks.md`, `validation.md`.

### Regras de execucao (nao negociaveis)

* Testes derivam dos criterios de aceite da spec e afirmam o resultado definido na spec; nunca espelham a implementacao.
* O gate (testes verdes) decide a conclusao da task, nao auto-avaliacao.
* Um commit atomico por task. Nunca agrupar tasks; nunca enfraquecer, pular ou apagar testes para passar.
* A execucao do commit segue a politica do repositorio: commit sob solicitacao humana (ver `AD-003`). A disciplina de 1 task = 1 commit e obrigatoria; o disparo do commit nao e automatico.
* Apos a ultima task, o Verifier roda sempre (autor != verificador), sem prompt.

### Verifier (sempre ativo)

Concluida a ultima task, Review Agent e QA Agent atuam como Verifier independente:

1. Spec-anchored outcome check: cada teste afirma o resultado definido na spec; sinalizar gaps de precisao.
2. Discrimination sensor (mutation): injetar falhas em estado de rascunho e confirmar que os testes as matam; mutantes sobreviventes viram fix tasks. Quando inviavel, registrar `Nao executado` com justificativa.
3. Escrever `.specs/features/<feature>/validation.md` (PASS/FAIL, evidencia por criterio, sensor, diff range).
4. Loop fix -> re-verify limitado a 3 iteracoes antes de escalar ao humano.
5. Distilar licoes: cada falha fundamentada vira entrada em `.specs/LESSONS.md`; PASS limpo nao registra nada.

### Coding guidelines

Agentes de desenvolvimento (Implementation, e Review na parte de codigo) seguem a skill `coding-guidelines`: pensar antes de codar, simplicidade primeiro, mudancas cirurgicas e execucao orientada a objetivo verificavel. Cada linha alterada deve rastrear ao pedido.

## Gate Jira antes do GitHub

Antes de criar, publicar ou organizar o projeto no GitHub, o PM Agent deve garantir que o trabalho exista no Jira.

O PM Agent deve:

* Confirmar o Jira cloud/site e o project key.
* Garantir que exista um Epic Jira para o pacote principal do LocalDraw.
* Criar tasks Jira vinculadas ao Epic antes de iniciar implementacao.
* Garantir que exista um board Jira para acompanhar o fluxo.
* Garantir que o board tenha exatamente estas quatro colunas operacionais:
  * `Ready for development`
  * `in development`
  * `review`
  * `done`
* Registrar o Epic key, task keys e board usado no `batch-summary.md`.
* Nao iniciar criacao/publicacao no GitHub enquanto Epic, tasks e board nao estiverem definidos ou enquanto houver decisao humana pendente sobre Jira.

Quando a ferramenta disponivel nao permitir criar ou configurar board diretamente, o PM Agent deve registrar o bloqueio tecnico e preparar a configuracao esperada com `.agent/templates/jira-board.md`.

## Politica de cards Jira

Agentes podem movimentar cards Jira entre colunas conforme a necessidade do fluxo, desde que usem transicoes disponiveis do Jira e registrem a evidencia.

Movimentacao esperada:

* PM Agent cria ou confirma cards em `Ready for development`.
* Implementation Agent pode mover a task para `in development` ao iniciar.
* Review Agent pode mover a task para `review` quando a implementacao estiver pronta para revisao.
* QA Agent ou PM Agent pode mover a task para `done` quando review, QA e gates automaticos passarem.
* Se QA ou review bloquear, o PM Agent decide se o card volta para `Ready for development` ou `in development`, conforme o tipo de retrabalho.

Nenhum agente pode deletar cards, Epics, boards, projetos, issues, comentarios ou historico remoto sem aprovacao humana explicita. A aprovacao deve citar o alvo exato a deletar.

## Responsabilidades do PM Agent

O PM Agent deve:

* Planejar o batch de desenvolvimento.
* Ler tasks existentes ou criar `task.md` quando ainda nao existir.
* Garantir que cada task esteja conectada ao roadmap.
* Garantir Epic, tasks e board Jira antes de GitHub quando houver trabalho remoto.
* Preparar dispatches claros para os agentes principais.
* Delegar implementacao ao Implementation Agent.
* Delegar revisao ao Review Agent.
* Delegar validacao ao QA Agent.
* Delegar registro operacional ao Metrics Agent.
* Avaliar gates automaticos de continuidade.
* Decidir continuar, parar ou abrir follow-up.
* Consolidar o batch em `batch-summary.md`.
* Registrar bloqueios reais sem transferir ao usuario revisoes intermediarias desnecessarias.

O PM Agent pode usar subagents quando isso reduzir risco, melhorar validacao ou permitir investigacao especializada. Subagents devem responder perguntas especificas e nao assumir a ownership da task.

## Sequencia padrao por task

1. PM Agent le ou cria `task.md`.
2. PM Agent dispara Implementation Agent.
3. Implementation Agent implementa e gera `implementation-report.md`.
4. PM Agent dispara Review Agent.
5. Review Agent revisa e gera `review-report.md`.
6. PM Agent dispara QA Agent.
7. QA Agent valida e gera `qa-report.md`.
8. PM Agent dispara Metrics Agent.
9. Metrics Agent registra `token-report.md`.
10. PM Agent avalia gates automaticos.
11. PM Agent decide continuar, parar ou abrir follow-up.

## Gates automaticos de continuidade

O PM Agent pode continuar para a proxima task do batch quando todos os gates abaixo forem verdadeiros:

* A task atual foi implementada.
* Os criterios de aceite foram atendidos.
* O build passa, se existir.
* O lint passa, se existir.
* Os testes passam, se existirem.
* O Review Agent nao marcou `Critical`.
* O QA Agent nao bloqueou.
* O Metrics Agent gerou relatorio.
* Jira Epic e task keys foram registrados, quando a execucao usa Jira.
* A task Jira esta na coluna correta do board, quando a execucao usa Jira.
* Nao houve mudanca de escopo.
* Nao houve dependencia proibida.
* Nao houve decisao humana pendente.

Quando um gate nao se aplica porque o projeto ainda nao possui build, lint ou testes, o agente deve registrar `Nao aplicavel` ou `Nao existente`, nao inventar verificacao.

## Condicoes obrigatorias de parada

O PM Agent deve parar o batch e pedir decisao humana quando ocorrer qualquer uma destas condicoes:

* Build quebrado sem correcao clara.
* Testes quebrados sem correcao clara.
* Review Agent marcou `Critical`.
* QA Agent marcou `Needs Changes` por bloqueio real.
* Necessidade de alterar escopo do produto.
* Necessidade de mudar arquitetura global.
* Necessidade de mudar o formato `.localdraw`.
* Necessidade de instalar biblioteca grande.
* Necessidade de usar biblioteca pronta de whiteboard/editor visual.
* Ambiguidade com alto risco de retrabalho.
* Risco de implementar algo fora do roadmap.
* Necessidade de deletar card, Epic, board, projeto ou outro artefato remoto.
* Falta de permissao para criar Epic, task ou board Jira obrigatorios para o batch.
* Ferramenta disponivel nao permite configurar o board e nao ha alternativa aprovada.

Tambem sao paradas obrigatorias as restricoes permanentes do projeto:

* Usar `@excalidraw/excalidraw`.
* Usar codigo oficial do Excalidraw.
* Usar componentes oficiais do Excalidraw.
* Implementar IA antes da fase prevista.
* Implementar features fora do roadmap sem aprovacao humana.

## Uso de agentes principais

### Implementation Agent

Recebe um dispatch do PM Agent e implementa apenas a task recebida. Deve gerar `implementation-report.md` e parar ao concluir a task, sem avancar sozinho para outra.

### Review Agent

Recebe task, diff, implementation report e contexto de docs. Deve revisar escopo, arquitetura, codigo, testes, dependencias e riscos. Deve gerar `review-report.md`.

### QA Agent

Recebe task, implementation report, review report e contexto de docs. Deve validar criterios de aceite, funcionalidade, usabilidade e regressao. Deve gerar `qa-report.md`.

### Metrics Agent

Recebe os relatorios da task e registra agentes usados, subagents usados, iteracoes, arquivos alterados, comandos executados, retrabalho e tokens oficiais quando disponiveis. Deve gerar `token-report.md` e nunca inventar numeros de tokens.

## Uso de subagents

Agentes principais podem chamar subagents quando uma pergunta especializada reduzir risco ou melhorar a qualidade da validacao. O dispatch deve usar `.agent/templates/subagent-dispatch.md`.

Exemplos de subagents uteis:

* `architecture-review`
* `scope-review`
* `test-review`
* `dependency-review`
* `acceptance-check`
* `usability-check`
* `regression-check`
* `geometry-check`
* `pointer-events-check`
* `state-management-check`

Subagents devem:

* Responder a pergunta especifica recebida.
* Registrar achados objetivos.
* Declarar limites da analise.
* Nao implementar mudancas sem autorizacao explicita do agente pai.
* Nao expandir escopo da task.

## Evidencia obrigatoria

Cada execucao precisa gerar evidencia suficiente para o PM Agent consolidar o batch:

* `task.md`
* `implementation-report.md`
* `review-report.md`
* `qa-report.md`
* `token-report.md`
* `batch-summary.md` ao final do batch

Quando algum relatorio nao puder ser criado, o PM Agent deve registrar o motivo no batch summary e decidir se isso bloqueia continuidade.

## Politica de revisao humana

O usuario humano normalmente revisa apenas o pacote final consolidado pelo PM Agent.

O PM Agent nao deve pedir revisao humana entre tasks quando os gates automaticos foram atendidos. Deve pedir revisao humana somente quando houver bloqueio real, decisao de escopo, decisao de arquitetura, dependencia proibida ou risco relevante de retrabalho.
