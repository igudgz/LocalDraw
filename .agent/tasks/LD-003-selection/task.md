# Task Brief

## Task ID

LD-003-selection

## Titulo

Ferramenta de selecao e movimentacao de elementos

## Fase do roadmap

Fase 2: Ferramenta de selecao

## Jira Tracking

* Epic key: AB-4
* Task key: AB-7
* Board: Agents Board / `https://igu-dgz-board.atlassian.net`
* Current column: Ready for development

## Contexto

Com viewport pronto (LD-002), o editor precisa permitir selecionar e mover elementos SVG. Tipos, renderers e stubs de selecao ja existem; reducer e viewport ainda nao tratam selecao nem drag de elementos.

## Objetivo

Implementar ferramenta select com selecao unica, borda de selecao, drag para mover e limpar selecao ao clicar no fundo.

## Escopo

* Estender `editorActions`/`editorReducer` com acoes de selecao e movimentacao de elemento.
* Implementar hit-test basico em `selectionUtils.ts` (retangulos primeiro).
* Implementar `SelectionBox` com destaque visual do elemento selecionado.
* Implementar logica da ferramenta select (pointer down/move/up) e integrar no `EditorViewport`.
* Adicionar `data-element-id` ou equivalente nos renderers para hit-test.
* Incluir **um retangulo seed** em `initialEditorState.elements` para validar selecao/movimento ate LD-004 entregar criacao pelo usuario.
* Manter pan apenas com ferramenta `hand` ou botao do meio.

## Fora de escopo

* Criar ferramenta rectangle ou outros desenhos.
* Multi-selecao.
* Resize.
* Persistencia, exportacao, undo/redo, IA, parser.
* Bibliotecas prontas de whiteboard/editor visual.

## Referencias

* `ROADMAP.md` - Fase 2
* Jira: Epic `AB-4`, Task `AB-7`
* Codigo base: `EditorViewport.tsx`, `editorReducer.ts`, `selection/*`, `elements/*`

## Criterios de aceite

* [ ] Um elemento pode ser selecionado.
* [ ] Elemento selecionado mostra destaque visual.
* [ ] Elemento selecionado pode ser movido por drag.
* [ ] Clicar no fundo remove a selecao.
* [ ] Implementacao usa SVG e eventos proprios.

## Arquivos esperados

* `src/features/editor/editorActions.ts`
* `src/features/editor/editorReducer.ts`
* `src/features/editor/editorTypes.ts` (se necessario expandir `ui.interaction`)
* `src/features/editor/EditorViewport.tsx`
* `src/features/selection/SelectionBox.tsx`
* `src/features/selection/selectionUtils.ts`
* `src/features/tools/selectTool.ts`
* `src/features/elements/ElementRenderer.tsx` e renderers afetados
* `src/app/app.css` (estilos de selecao, se necessario)

## Riscos

* Conflito entre pan e select se eventos nao forem roteados por `activeTool`.
* Hit-test impreciso com zoom/viewBox se coordenadas nao usarem `getCanvasPoint`.

## Verificacoes esperadas

* `npm run build` e `npm run lint`
* Busca por dependencias proibidas
* Smoke headless de selecao e movimento (Playwright MCP se disponivel; senao alternativa local)

## Evidencia esperada

* `implementation-report.md` em `.agent/runs/LD-003-selection/`
* Comandos e resultado dos gates
* Movimentacao Jira AB-7 para `In development` ao iniciar

## Observacoes

Shell rule: use `rtk <external-command>`. Nao implementar escopo de fases futuras sem aprovacao.
