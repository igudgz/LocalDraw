# QA Report

## Story testada

* Story/Task ID: AB-16
* Titulo: Fase 11: Organização de desenhos
* Fase do roadmap: Fase 11 — Organização de desenhos
* QA Agent: QA Agent

## Jira Tracking

* Epic key: AB-4
* Task key: AB-16
* Initial column: Não alterado por QA Agent
* Final column: Não alterado por QA Agent
* Transition executed: Nenhuma

## Ambiente

* Sistema operacional: Windows 10.0.26200
* Navegador: Não utilizado nesta sessão
* Branch/commit: `feat/mvp-batch-004-persistence` @ `32596e9`
* Build/dev server: `npm run build` — produção OK; dev server não iniciado
* Playwright MCP: Não utilizado nesta sessão
* Dados usados: fake-indexeddb + localStorage nos testes unitários Vitest

## Fluxos testados

* Gates automáticos: `npm run lint`, `npm run build`, `npm test`
* REQ-001 a REQ-008: validação por testes unitários + inspeção de código dos componentes `ProjectList`, `ProjectPanel`, `useDrawingProjects` e extensões do `localProjectRepository`
* Regressão AB-15: suite de persistência (indexedDb, serializer, debounce) permanece verde (21 testes totais)

## Criterios de aceite

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| REQ-001 — Sidebar lista desenhos | Pass | `ProjectList.tsx` renderiza `summaries` via `listSummaries`; `useDrawingProjects` chama `refreshSummaries` após hidratação; `localProjectRepository.test.ts` valida `listSummaries` ordenado por `updatedAt` |
| REQ-002 — Criar novo desenho | Pass | Botão "New drawing" em `ProjectList` → `createNewDrawing`; `createDrawing()` persiste registro vazio e define active id; teste `creates an empty drawing with a new id`; `dispatch(restore-drawing)` seleciona o novo desenho |
| REQ-003 — Renomear | Pass | Rename via double-click, botão Rename e input inline com Enter/Escape/blur; `renameDrawing` chama `updateMetadata` com `name`; teste `updates metadata without replacing elements` cobre rename |
| REQ-004 — Duplicar | Pass | Botão Duplicate → `duplicateDrawing`; repository copia com novo id e sufixo `(copy)`; teste `duplicates a drawing with a copy suffix` |
| REQ-005 — Excluir | Pass | Botão Delete → `deleteDrawing`; repository remove do IndexedDB (`deleteDrawing` no CRUD test); `useDrawingProjects.deleteDrawing` seleciona próximo summary ou cria desenho vazio quando o ativo é excluído (inspeção de código) |
| REQ-006 — Descrição e tags | Pass | `ProjectPanel` textarea + input tags com commit on blur; `updateMetadata` persiste `description`/`tags` sem alterar elements; teste `updates metadata without replacing elements`; `tagHelpers.test.ts` (3 testes) |
| REQ-007 — Data última alteração | Pass | `ProjectList` exibe `formatUpdatedAt(summary.updatedAt)`; `formatUpdatedAt.test.ts` (2 testes) |
| REQ-008 — Seleção carrega editor | Pass | Click em item → `selectDrawing`: `flushSave`, `getById`, `setActiveDrawingId`, `dispatch(restore-drawing)`; `App.tsx` lift state com `useDrawingProjects`; `editorReducer` trata `restore-drawing` e `update-current-drawing` |

Resultados permitidos: `Pass`, `Fail`, `Not tested`.

## Bugs encontrados

| Severidade | Descricao | Passos para reproduzir | Evidencia |
| --- | --- | --- | --- |
| — | Nenhum bloqueante encontrado | — | — |

## Problemas de usabilidade

* Renomear exige double-click ou botão Rename — comportamento documentado na implementation-report; aceitável para MVP.
* Tags editadas como texto comma-separated no blur — sem autocomplete ou chips visuais.
* `TechnicalDocPanel` continua com contagem fixa `Elements 0` (stub) — fora do escopo AB-16.

## Regressoes possiveis

* Primeiro autosave pode persistir id placeholder `localdraw-initial-drawing` antes do usuário criar desenho nomeado (nota da implementation-report).
* Troca rápida de desenho durante autosave pendente depende de `flushSave` antes de cada operação — race residual se flush falhar silenciosamente.
* Exclusão do último desenho cria automaticamente um novo vazio — comportamento esperado, mas pode surpreender usuário.
* Suite AB-15 intacta; nenhuma regressão detectada nos 13 testes de persistência pré-existentes.

## Subagents usados

* Nenhum

## Evidencias

* Comandos executados:
  * `npm run lint` — **PASS** (`tsc -b`)
  * `npm run build` — **PASS** (vite build, 175ms)
  * `npm test` — **PASS** (6 files, 21 tests, 4.11s)
* Evidencias Playwright MCP: Não utilizado nesta sessão
* Prints/videos: Não capturados
* Logs: Sem falhas nos gates automáticos
* Arquivos relevantes:
  * `src/features/projects/ProjectList.tsx`
  * `src/features/projects/ProjectPanel.tsx`
  * `src/features/projects/useDrawingProjects.ts`
  * `src/features/projects/formatUpdatedAt.ts`
  * `src/features/projects/tagHelpers.ts`
  * `src/features/persistence/localProjectRepository.ts`
  * `src/app/App.tsx`
  * Testes: `localProjectRepository.test.ts`, `formatUpdatedAt.test.ts`, `tagHelpers.test.ts`

## Verdict

**Pass**

## Observacoes

* Discrimination sensor (mutation testing): **Não executado** — fora do tempo/escopo desta validação QA.
* REQ-005 (fallback ao excluir desenho ativo) e REQ-008 (troca de desenho no editor) validados por inspeção de código; não há teste de integração React/hook dedicado.
* Validação manual E2E da sidebar (criar → renomear → duplicar → excluir → trocar desenho) não registrada; recomendada antes de release, mas não bloqueia gates automáticos.
* `review-report.md` para AB-16 não estava disponível no momento da QA; validação baseada em implementation-report, spec e código.
* Recomendação PM: consolidar batch AB-16 após Review Agent; mover card para **Done** quando review também aprovar.
