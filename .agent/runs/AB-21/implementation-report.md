# Implementation Report

## Task

* Task ID: AB-21
* Titulo: Fase 16: Preparacao para agente
* Fase do roadmap: Fase 16
* Agent: Implementation Agent
* Branch: feat/mvp-batch-005-techdoc

## Jira Tracking

* Epic key: AB-4
* Task key: AB-21
* Initial column: Nao informado
* Final column: Nao informado (sem transicao Jira nesta execucao)
* Transition executed: Nenhuma

## O que foi feito

* Tipos `TechnicalDocInput`, `TechnicalDocOutput`, `TechnicalDocOptions`, `TechnicalDocOutputLanguage` e `TechnicalDocStyle` em `technicalDocTypes.ts` (REQ-015).
* `buildTechnicalDocInput(parsed, options)` em `technicalDocContext.ts` transforma `ParsedDiagram` + opcoes em contexto estruturado para agente (REQ-016).
* Prompt base versionado `prompts/technical-doc-v1.md` com regras: nao inventar tecnologia, registrar incertezas, preservar idioma (REQ-017).
* `technicalDocService.ts`:
  * `generateTechnicalDocLocal(input)` — fallback local via `generateMarkdown`, mapeia `assumptions`/`openQuestions` do diagrama (REQ-018).
  * Interface `TechnicalDocGenerator` + stub `aiTechnicalDocGeneratorStub` (rejeita com erro AB-22 blocked).
* `TechnicalDocPanel` passa a usar `buildTechnicalDocInput` + `generateTechnicalDocLocal` em vez de chamar `generateMarkdown` diretamente (REQ-019).
* Testes: `technicalDocContext.test.ts` (3), `technicalDocService.test.ts` (4).

## Arquivos alterados

* `src/features/technical-doc/technicalDocTypes.ts`
* `src/features/technical-doc/TechnicalDocPanel.tsx`

## Arquivos criados

* `src/features/technical-doc/technicalDocContext.ts`
* `src/features/technical-doc/technicalDocContext.test.ts`
* `src/features/technical-doc/technicalDocService.ts`
* `src/features/technical-doc/technicalDocService.test.ts`
* `src/features/technical-doc/prompts/technical-doc-v1.md`
* `.agent/runs/AB-21/implementation-report.md`

## Decisoes tomadas

* `buildTechnicalDocInput` omite `userContext` quando vazio apos trim.
* Fallback local ignora `outputLanguage`/`docStyle` por enquanto — `generateMarkdown` permanece pt-BR/detailed; opcoes ficam no contrato para AB-22.
* Stub de IA lanca erro explicito em vez de retornar placeholder silencioso.
* Painel usa defaults `pt-BR` + `detailed` via constante local.

## Subagents usados

* Nenhum

## Como foi verificado

* Comandos executados:
  * `npm run lint`
  * `npm run build`
  * `npm run test`
* Testes executados:
  * `src/features/technical-doc/diagramParser.test.ts` (9 testes)
  * `src/features/technical-doc/markdownGenerator.test.ts` (9 testes)
  * `src/features/technical-doc/technicalDocContext.test.ts` (3 testes)
  * `src/features/technical-doc/technicalDocService.test.ts` (4 testes)
* Validacao manual: Nao executada (fora do escopo desta task)
* Resultado: lint OK, build OK, 25/25 testes passando

## Criterios de aceite

* [x] REQ-015: Contratos entrada/saida definidos
* [x] REQ-016: Transformacao ParsedDiagram + opcoes em contexto
* [x] REQ-017: Prompt base versionado no repositorio
* [x] REQ-018: Fallback local `generateTechnicalDocLocal` sem IA
* [x] REQ-019: App funcional sem IA via fallback local

## Evidencias

* Painel continua gerando preview Markdown apos Analyze via caminho de servico local.
* Contratos prontos para integracao LLM em AB-22 sem alterar fronteira parser/painel.

## Limitacoes

* `outputLanguage` e `docStyle` ainda nao alteram output do fallback local.
* Prompt versionado nao e carregado em runtime (arquivo de referencia para AB-22).
* Stub de IA nao e exposto na UI.

## Pontos TBD / A definir

* AB-22: provider LLM, chaves e implementacao real de `TechnicalDocGenerator`.
* Transicao de card Jira AB-21 apos revisao humana.

## Riscos residuais

* Usuario pode esperar que opcoes de idioma/estilo afetem preview antes de AB-22.
* Integracao LLM precisara respeitar contratos sem quebrar fallback local.

## Proximo passo sugerido

* AB-22: integracao LLM com `TechnicalDocGenerator` real (bloqueada ate aprovacao humana).

## Confirmacao de escopo

* [x] Nenhuma implementacao fora do escopo foi feita.
* [x] Nenhuma dependencia proibida foi instalada.
* [x] Nenhum componente oficial do Excalidraw foi usado.
* [x] Nenhuma biblioteca pronta de whiteboard/editor visual foi adicionada.
