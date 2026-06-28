# Task Brief

## Task ID

LD-004-rectangle

## Titulo

Ferramenta de retangulo

## Fase do roadmap

Fase 3: Ferramenta de retangulo

## Jira Tracking

* Epic key: AB-4
* Task key: AB-8
* Board: Agents Board / `https://igu-dgz-board.atlassian.net`
* Current column: Ready for development

## Contexto

Apos LD-003-selection, o editor deve permitir criar retangulos por click-drag. Renderers e tipos de rectangle ja existem; falta fluxo de criacao, preview e persistencia no estado.

## Objetivo

Implementar ferramenta rectangle com click-drag, preview durante desenho, commit no estado e integracao com selecao/movimento existentes.

## Escopo

* Acao `add-element` (se ainda nao existir) e normalizacao de bounds negativos.
* Implementar `rectangleTool` com pointer down/move/up.
* Preview SVG durante arraste.
* Commit de `RectangleElement` com `createId()` e `styleDefaults`.
* Remover retangulo seed de LD-003 se ainda existir.
* Auto-selecionar retangulo recém-criado (opcional, recomendado).
* Integrar roteamento de eventos no `EditorViewport` quando `activeTool === "rectangle"`.

## Fora de escopo

* Elipse, texto, seta, resize, estilos avancados, persistencia, exportacao, undo/redo, IA.
* Bibliotecas prontas de whiteboard/editor visual.

## Referencias

* `ROADMAP.md` - Fase 3
* Jira: Epic `AB-4`, Task `AB-8`
* Depende de: LD-003-selection

## Criterios de aceite

* [ ] Usuario seleciona ferramenta retangulo.
* [ ] Usuario clica e arrasta no canvas.
* [ ] Um retangulo e criado e salvo no estado.
* [ ] Retangulo pode ser selecionado e movido.

## Arquivos esperados

* `src/features/tools/rectangleTool.ts`
* `src/features/editor/editorActions.ts`
* `src/features/editor/editorReducer.ts`
* `src/features/editor/EditorViewport.tsx`
* `src/features/editor/editorTypes.ts`
* `src/features/elements/RectangleElement.tsx` (ajustes minimos se necessario)

## Riscos

* Preview/commit com width/height negativos se bounds nao forem normalizados.
* Conflito de eventos entre rectangle tool e select/hand.

## Verificacoes esperadas

* `npm run build` e `npm run lint`
* Smoke headless: criar retangulo, selecionar, mover
* Busca por dependencias proibidas

## Evidencia esperada

* `implementation-report.md` em `.agent/runs/LD-004-rectangle/`
* Movimentacao Jira AB-8 para `In development` ao iniciar

## Observacoes

Shell rule: use `rtk <external-command>`. Nao implementar escopo de fases futuras sem aprovacao.
