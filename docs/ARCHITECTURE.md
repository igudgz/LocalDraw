# LocalDraw - Architecture

## Objetivo do documento

Este documento responde: "Como o codigo deve ser organizado?"

Fonte principal: `ROADMAP.md` na raiz do projeto.

## Principios arquiteturais

* O editor deve ser construido com componentes e APIs proprios.
* A renderizacao inicial deve ser SVG-first.
* O estado do editor deve ser explicito, serializavel e interpretavel.
* Ferramentas de interacao devem ficar separadas dos componentes de renderizacao.
* Persistencia, exportacao, parser e geracao de doc devem ser fronteiras isoladas.
* Agentes nao devem adicionar dependencias grandes ou cruzar escopo de fase sem aprovacao humana.

## Estrutura de pastas sugerida

```text
src/
  app/
    App.tsx
    app.css
  features/
    editor/
      Editor.tsx
      EditorCanvas.tsx
      EditorToolbar.tsx
      EditorViewport.tsx
      editorTypes.ts
      editorReducer.ts
      editorActions.ts
    tools/
      selectTool.ts
      rectangleTool.ts
      ellipseTool.ts
      arrowTool.ts
      textTool.ts
      handTool.ts
    elements/
      ElementRenderer.tsx
      RectangleElement.tsx
      EllipseElement.tsx
      ArrowElement.tsx
      TextElement.tsx
      elementTypes.ts
      elementGeometry.ts
    selection/
      SelectionBox.tsx
      selectionUtils.ts
    history/
      historyTypes.ts
      historyReducer.ts
    persistence/
      localProjectRepository.ts
      localDrawSerializer.ts
      localDrawImporter.ts
    projects/
      ProjectList.tsx
      ProjectPanel.tsx
      projectTypes.ts
    export/
      exportAsJson.ts
      exportAsSvg.ts
      exportAsPng.ts
    technical-doc/
      TechnicalDocPanel.tsx
      diagramParser.ts
      markdownGenerator.ts
      technicalDocTypes.ts
  shared/
    storage/
      indexedDb.ts
    ui/
      Button.tsx
      Panel.tsx
      Input.tsx
    utils/
      ids.ts
      math.ts
```

## Responsabilidades por area

### `app`

Responsavel por montagem da aplicacao, layout raiz, estilos globais e composicao das features principais.

Nao deve conter logica detalhada de ferramentas, geometria, persistencia ou parser.

### `features/editor`

Responsavel pela experiencia central do editor:

* Estado do editor.
* Toolbar.
* Canvas.
* Viewport.
* Coordenadas de tela para mundo.
* Integracao entre eventos e ferramentas.

### `features/tools`

Responsavel por ferramentas de interacao:

* `selectTool`: selecionar e mover elementos.
* `rectangleTool`: criar retangulos.
* `ellipseTool`: criar elipses.
* `arrowTool`: criar setas.
* `textTool`: criar e editar textos.
* `handTool`: pan da viewport.

Cada ferramenta deve encapsular sua propria interpretacao de eventos de ponteiro e produzir acoes de editor.

### `features/elements`

Responsavel por tipos, geometria e renderizacao de elementos.

* `ElementRenderer` decide qual componente renderiza cada tipo.
* Componentes especificos renderizam SVG de retangulo, elipse, seta e texto.
* `elementGeometry` concentra calculos de bounds, hit area e pontos de resize.

### `features/selection`

Responsavel por estado visual e utilitarios de selecao:

* Borda de selecao.
* Handles de resize.
* Hit testing auxiliar.
* Limpeza de selecao.

### `features/history`

Responsavel por undo/redo:

* Historico de snapshots ou patches.
* Limite de crescimento do historico.
* Registro de criacao, movimento, resize e estilos.
* Atalhos Ctrl/Cmd + Z, Ctrl/Cmd + Shift + Z e Ctrl/Cmd + Y.

### `features/persistence`

Responsavel por salvar e carregar dados:

* Repositorio local em IndexedDB.
* Serializacao para `.localdraw`.
* Importacao com validacao de versao.
* Autosave com debounce.

### `features/projects`

Responsavel por organizacao simples de desenhos:

* Lista lateral.
* Novo desenho.
* Renomear.
* Duplicar.
* Excluir.
* Descricao, tags e data de ultima alteracao.

### `features/export`

Responsavel por exportacao:

* `.localdraw` como JSON proprio.
* SVG valido.
* PNG valido.

### `features/technical-doc`

Responsavel por interpretacao e documentacao:

* `diagramParser.ts`: transforma elementos em `ParsedDiagram`.
* `markdownGenerator.ts`: gera Technical Doc sem IA.
* `TechnicalDocPanel.tsx`: exibe JSON estruturado e preview Markdown.
* `technicalDocTypes.ts`: contratos de entrada e saida.

Essa area nao deve depender de bibliotecas de LLM no MVP.

### `shared`

Responsavel por utilitarios e componentes genericos:

* `storage/indexedDb.ts`: wrapper minimo de IndexedDB.
* `ui`: componentes pequenos reutilizaveis.
* `utils`: ids, matematica e helpers sem dependencia de dominio.

## Fluxo de eventos do editor

1. Usuario interage com toolbar, teclado ou canvas.
2. `EditorCanvas` captura eventos de pointer/keyboard relevantes.
3. Coordenadas de tela sao convertidas para coordenadas do mundo usando viewport.
4. Ferramenta ativa recebe o evento normalizado.
5. Ferramenta ativa decide a acao de editor.
6. `editorReducer` aplica mudanca no estado.
7. Elementos sao re-renderizados via SVG.
8. Acoes relevantes sao registradas no historico.
9. Persistencia local salva alteracoes com debounce quando a fase permitir.
10. Parser e gerador de Markdown leem o estado serializavel, sem alterar o desenho.

## Modelo de estado

O estado inicial do editor deve ser simples e serializavel.

Campos esperados:

* `elements`: lista de `LocalDrawElement`.
* `selectedElementIds`: lista ou item selecionado.
* `activeTool`: ferramenta atual.
* `viewport`: zoom, scrollX e scrollY.
* `styleDefaults`: estilos para novos elementos.
* `history`: passado, presente e futuro ou estrutura equivalente.
* `currentDrawing`: metadados do desenho atual.
* `ui`: estados temporarios de interacao.

Detalhes exatos: TBD.

## Regras arquiteturais

* Nao misturar parser de documentacao com logica de renderizacao.
* Nao misturar persistencia com componentes de elemento.
* Nao usar estado implicito no DOM como fonte de verdade.
* Nao criar dependencias circulares entre tools, elements e editor.
* Nao salvar historico infinito.
* Nao exportar arquivo `.localdraw` sem validar versao e app.
* Nao permitir que IA seja dependencia obrigatoria para o MVP.
* Nao usar bibliotecas prontas de whiteboard/editor visual.
* Nao usar componentes oficiais ou codigo oficial do Excalidraw.

## Limites que agentes nao devem cruzar sem aprovacao

Agentes precisam de aprovacao humana para:

* Criar app React/Vite antes da fase aprovada.
* Instalar dependencias.
* Alterar stack base.
* Adicionar biblioteca de canvas/editor/whiteboard.
* Usar qualquer pacote ou componente oficial do Excalidraw.
* Introduzir backend remoto.
* Introduzir login, multiusuario ou sync em nuvem.
* Mudar o formato `.localdraw` de forma incompativel.
* Substituir SVG-first por Canvas-first no MVP.
* Alterar Definition of Done ou escopo principal do roadmap.

## Pontos a definir

* Forma final do `editorReducer`.
* Estrategia de snapshots vs patches para historico.
* Limites numericos de zoom, canvas e historico.
* Politica de ids.
* Estrategia final de hit testing para setas.
