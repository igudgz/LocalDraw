# Task Brief

## Task ID

LD-002-viewport

## Titulo

Viewport SVG com zoom e pan basicos

## Fase do roadmap

Fase 1: Viewport do editor

## Jira Tracking

* Epic key: AB-4
* Task key: AB-6
* Board: Agents Board / `https://igu-dgz-board.atlassian.net`
* Current column: In development

## Contexto

Depois do bootstrap, o editor precisa de uma área visual SVG onde elementos serão renderizados em fases futuras. Esta task deve criar a base de viewport, coordenadas e interação de navegação sem implementar ferramentas de desenho.

Referencias principais:

* `ROADMAP.md`
* `docs/PRODUCT_SPEC.md`
* `docs/TECHNICAL_DOC.md`
* `docs/ARCHITECTURE.md`
* `docs/ROADMAP.md`
* `docs/QA_STRATEGY.md`

## Objetivo

Criar `EditorCanvas` e `EditorViewport` com uma área SVG grande, zoom básico, pan básico, grid simples opcional e estado de viewport mantido na aplicação.

## Escopo

* Criar ou ajustar `EditorCanvas`.
* Criar ou ajustar `EditorViewport`.
* Renderizar área SVG grande dentro da região central.
* Implementar zoom básico com eventos próprios.
* Implementar pan básico com eventos próprios.
* Criar grid simples opcional em SVG.
* Mostrar estado do viewport ou coordenadas para debug.
* Manter o estado do viewport no estado do editor.

## Fora de escopo

* Criar formas.
* Criar seleção.
* Mover elementos.
* Persistência.
* Exportação.
* IA.
* Parser de diagrama.
* Alterar formato `.localdraw`.
* Adicionar biblioteca pronta de whiteboard/editor visual.

## Referencias

* Documento/fase: `docs/ROADMAP.md` - Fase 1.
* Jira/Issue: Epic `AB-4`, Task `AB-6`.
* Design: layout de editor criado por LD-001-bootstrap.
* Discussao: solicitacao humana deste batch.

## Criterios de aceite

* [ ] A area de desenho aparece.
* [ ] O usuario consegue dar zoom.
* [ ] O usuario consegue mover a visao do canvas.
* [ ] O estado do viewport e mantido na aplicacao.
* [ ] A implementacao usa SVG e eventos proprios.

## Arquivos esperados

* `src/features/editor/EditorCanvas.tsx`
* `src/features/editor/EditorViewport.tsx`
* `src/features/editor/Editor.tsx`
* `src/features/editor/editorTypes.ts`
* `src/features/editor/editorReducer.ts`
* `src/features/editor/editorActions.ts`
* `src/app/App.tsx`
* `src/app/app.css`
* Testes ou validacoes adicionais, se apropriado e disponíveis

## Riscos

* Interações de pointer/wheel podem conflitar com scroll da página se não forem isoladas na área do editor.
* Conversão de coordenadas pode ficar inconsistente se zoom e pan forem misturados sem helpers claros.
* A task pode antecipar seleção ou criação de elementos; isso deve ser evitado.

## Verificacoes esperadas

* [ ] Verificar que a tarefa respeita o roadmap.
* [ ] Verificar que nenhum item fora de escopo foi implementado.
* [ ] Verificar que nenhuma dependencia proibida foi adicionada.
* [ ] Verificar que `@excalidraw/excalidraw` nao foi usado.
* [ ] Verificar que componentes oficiais do Excalidraw nao foram usados.
* [ ] Verificar que bibliotecas prontas de whiteboard/editor visual nao foram adicionadas.
* [ ] Executar `npm run build`, se existir.
* [ ] Executar `npm run lint`, se existir.
* [ ] Executar testes, se existirem.
* [ ] Validar manualmente zoom e pan ou registrar limitação objetiva.
* [ ] Executar E2E com Playwright MCP quando a ferramenta estiver disponivel; caso contrário registrar `Nao disponivel`.

## Evidencia esperada

* Arquivos criados/alterados.
* Comandos executados.
* Resultado das verificacoes.
* Evidencia de zoom, pan e estado de viewport.
* Evidencias de Playwright MCP, se E2E for executado.
* Pontos `TBD` ou `A definir` restantes.

## Observacoes

Shell rule: use `rtk <external-command>` for executables. For PowerShell cmdlets/functions/aliases/script blocks, use `rtk powershell -NoProfile -Command "<PowerShell command>"`.

Nao implementar escopo de fases futuras sem aprovacao humana.
