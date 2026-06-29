# QA Report

## Story testada

* Story/Task ID: AB-17
* Titulo: Fase 12: Importacao e exportacao (.localdraw, SVG, PNG)
* Fase do roadmap: Fase 12 — Importacao e exportacao
* QA Agent: QA Agent

## Jira Tracking

* Epic key: AB-4
* Task key: AB-17
* Initial column: Nao alterado por QA Agent
* Final column: Nao alterado por QA Agent
* Transition executed: Nenhuma

## Ambiente

* Sistema operacional: Windows 10.0.26200
* Navegador: Nao utilizado nesta sessao
* Branch/commit: `feat/mvp-batch-004-persistence` @ `ae3b443`
* Build/dev server: `npm run build` — producao OK; dev server nao iniciado
* Playwright MCP: Nao utilizado nesta sessao
* Dados usados: fake-indexeddb + localStorage nos testes unitarios Vitest; mocks de DOM/canvas/Image para export

## Fluxos testados

* Gates automaticos: `npm run lint`, `npm run build`, `npm test`
* REQ-001 a REQ-007: validacao por testes unitarios + inspecao de codigo dos modulos `exportAsJson`, `localDrawImporter`, `exportAsSvg`, `exportAsPng`, `useDrawingImportExport`, `EditorToolbar` e extensao `importDrawing` em `localProjectRepository`
* Regressao AB-15/AB-16: suite de persistencia e projetos permanece verde (32 testes totais em 10 arquivos)

## Criterios de aceite

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| REQ-001 — Export .localdraw | Pass | `exportAsJson.ts` serializa via `serializeDrawingRecord`, gera blob JSON e download com extensao `.localdraw` (`sanitizeFileName(record.name).localdraw`); teste `downloads a valid LocalDrawFile v1 payload (REQ-001)` valida blob `application/json` e fluxo de download |
| REQ-002 — Import .localdraw | Pass | `localDrawImporter.ts` faz parse/validacao via `validateLocalDrawFile`; teste `parses valid .localdraw JSON (REQ-002)`; `useDrawingImportExport.ts` chama `importDrawing`, dispara `restore-drawing` e `refreshSummaries`; `importDrawing` persiste novo registro com id gerado (`crypto.randomUUID`) e `save()` atualiza active id |
| REQ-003 — Erro arquivo invalido | Pass | Testes retornam mensagens claras: `Invalid JSON in .localdraw file` e `Unsupported LocalDrawFile version`; UI exibe erro inline com `role="alert"` em `EditorToolbar.tsx`; fallback generico `Failed to import .localdraw file` no hook |
| REQ-004 — Export SVG | Pass | `exportAsSvg.ts` + `elementSvgMarkup.ts` geram documento XML/SVG com xmlns, elementos `<rect>`/`<text>` renderizados e escape XML; teste `generates a valid SVG document with rendered elements (REQ-004)` |
| REQ-005 — Export PNG | Pass | `exportAsPng.ts` renderiza SVG em canvas via `Image` + `canvas.toBlob(..., "image/png")`; teste `creates a PNG blob from rendered SVG (REQ-005)` valida blob `image/png`; toolbar desabilita botao durante export com label `Exporting PNG...` |
| REQ-006 — Import nao quebra existentes | Pass | `importDrawing` cria registro novo sem `deleteDrawing`; teste `imports a drawing as a new record without deleting existing ones (REQ-006)` confirma registro original intacto e `listSummaries()` com 2 itens |
| REQ-007 — UI minima | Pass | `EditorToolbar.tsx` expoe botoes Export .localdraw, Import, Export SVG, Export PNG; input file oculto com `accept=".localdraw,application/json"`; integrado em `Editor.tsx` via `useDrawingImportExport` |

Resultados permitidos: `Pass`, `Fail`, `Not tested`.

## Bugs encontrados

| Severidade | Descricao | Passos para reproduzir | Evidencia |
| --- | --- | --- | --- |
| — | Nenhum bloqueante encontrado | — | — |

## Problemas de usabilidade

* Import sempre cria novo desenho (nao substitui o ativo) — decisao documentada na implementation-report; alinhada ao criterio "carrega como novo" da spec.
* Erros de import/export PNG compartilham a mesma area de feedback (`importError`) — aceitavel para MVP.
* Export PNG depende de APIs browser (`Image`, `canvas.toBlob`); falha exibe mensagem generica sem detalhe tecnico.
* Validacao manual E2E dos botoes na toolbar nao executada nesta sessao.

## Regressoes possiveis

* `flushSave` antes de import pode sobrescrever estado do desenho ativo se houver mudancas pendentes no debounce — mitigado pelo flush explicito no hook.
* Export `.localdraw` usa metadados persistidos (`description`, `tags`) via `getById`; se registro ainda nao foi autosalvo, export pode omitir metadados editados recentemente.
* Suite AB-15/AB-16 intacta; nenhuma regressao detectada nos testes pre-existentes de persistencia e projetos.

## Subagents usados

* Nenhum

## Evidencias

* Comandos executados:
  * `npm run lint` — **PASS** (`tsc -b`, exit 0)
  * `npm run build` — **PASS** (vite build, 315ms, exit 0)
  * `npm test` — **PASS** (10 files, 32 tests, 8.50s, exit 0)
* Evidencias Playwright MCP: Nao utilizado nesta sessao
* Prints/videos: Nao capturados
* Logs: Sem falhas nos gates automaticos
* Arquivos relevantes:
  * `src/features/export/exportAsJson.ts`
  * `src/features/export/exportAsSvg.ts`
  * `src/features/export/exportAsPng.ts`
  * `src/features/export/useDrawingImportExport.ts`
  * `src/features/export/elementSvgMarkup.ts`
  * `src/features/persistence/localDrawImporter.ts`
  * `src/features/persistence/localProjectRepository.ts`
  * `src/features/editor/EditorToolbar.tsx`
  * `src/features/editor/Editor.tsx`
  * `src/shared/utils/download.ts`
  * Testes: `exportAsJson.test.ts`, `localDrawImporter.test.ts`, `exportAsSvg.test.ts`, `exportAsPng.test.ts`, `localProjectRepository.test.ts`

## Verdict

**Pass**

## Observacoes

* Discrimination sensor (mutation testing): **Nao executado** — fora do tempo/escopo desta validacao QA.
* REQ-001: teste unitario nao asserta explicitamente o nome do arquivo `.localdraw` no anchor de download; extensao validada por inspecao de `exportAsJson.ts`.
* REQ-002/REQ-007: fluxo completo import → sidebar → reload nao coberto por teste de integracao React; validado por testes de repository/importer + inspecao do hook e toolbar.
* `review-report.md` para AB-17 nao estava disponivel no momento da QA; validacao baseada em implementation-report, spec e codigo.
* Recomendacao PM: consolidar batch AB-17 apos Review Agent; validacao manual E2E dos botoes export/import recomendada antes de release, mas nao bloqueia gates automaticos.
