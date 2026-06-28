# LocalDraw MVP

## Visão

O objetivo do LocalDraw é criar um editor local de diagramas inspirado na experiência do Excalidraw, mas construído do zero.

A aplicação deve permitir que o usuário desenhe estruturas técnicas, fluxos, arquiteturas e anotações visuais de forma livre, com uma experiência simples, rápida e próxima de uma ferramenta de whiteboard.

O projeto também deve preparar o caminho para uma evolução futura onde um agente consiga interpretar o desenho e gerar uma Technical Doc em Markdown.

## Decisão principal

Este projeto não deve usar o pacote oficial `@excalidraw/excalidraw`, componentes oficiais do Excalidraw, código oficial do Excalidraw ou bibliotecas prontas de whiteboard/editor visual.

A intenção é construir o editor visual do zero para fins de aprendizado, controle técnico e evolução própria do produto.

O projeto pode se inspirar na experiência do Excalidraw, mas deve ter implementação, formato de arquivo, arquitetura e evolução independentes.

## Objetivo do MVP

Criar uma aplicação local de desenho técnico com:

* Canvas/viewport para desenho.
* Ferramentas básicas de desenho.
* Seleção e movimentação de elementos.
* Texto.
* Setas/conectores.
* Resize básico.
* Estilos visuais básicos.
* Undo/redo.
* Zoom e pan.
* Persistência local.
* Importação/exportação em formato próprio.
* Exportação como imagem.
* Organização simples de desenhos.
* Painel lateral para análise futura do diagrama.
* Parser inicial para transformar o desenho em uma estrutura interpretável.
* Geração inicial de Technical Doc em Markdown sem IA.

## Objetivo de longo prazo

Permitir que um agente leia o desenho criado na aplicação e gere uma Technical Doc em Markdown.

Exemplo de saída futura:

```md
# Technical Doc
## Contexto
## Objetivo
## Componentes
## Fluxo principal
## Integrações
## Decisões técnicas
## Riscos
## Perguntas em aberto
```

## Princípios do projeto

### 1. Construção própria

O editor deve ser construído com APIs e componentes próprios.

Não usar bibliotecas que entreguem um whiteboard pronto, canvas pronto, editor visual pronto ou clone de Excalidraw pronto.

Permitido:

* React.
* TypeScript.
* Vite.
* APIs nativas do browser.
* SVG.
* Canvas API quando necessário.
* Pointer Events API.
* IndexedDB.
* Bibliotecas pequenas de utilidade, quando justificadas.

Evitar no MVP:

* Bibliotecas grandes de edição visual.
* Frameworks prontos de whiteboard.
* Dependências que escondam a lógica principal do editor.
* Componentes oficiais do Excalidraw.

### 2. Produto local primeiro

O primeiro objetivo é ter um produto local funcional.

A geração automática de documentação técnica com IA deve ser uma evolução, não uma dependência obrigatória do MVP inicial.

### 3. Simplicidade antes de perfeição

O MVP não precisa ter a mesma qualidade, fluidez ou quantidade de recursos do Excalidraw real.

O foco inicial é construir uma base própria que funcione e seja evolutiva.

### 4. Formato próprio de arquivo

O projeto deve ter um formato próprio de persistência.

Sugestão de extensão:

```text
.localdraw
```

Esse formato deve ser JSON e representar os elementos do desenho, viewport, metadados e informações necessárias para reabrir o arquivo.

### 5. Preparar para agentes no futuro

Mesmo sem IA no MVP inicial, a estrutura interna do desenho deve ser pensada para ser interpretável depois.

Cada elemento deve ter:

* id.
* type.
* posição.
* tamanho.
* rotação.
* estilo.
* texto, quando existir.
* relações, quando existir.
* metadados úteis para análise.

## Stack inicial sugerida

* React.
* Vite.
* TypeScript.
* SVG para renderização inicial.
* Pointer Events API.
* IndexedDB.
* Estado local com reducer próprio ou Zustand.
* Markdown preview.

## Decisão técnica inicial: SVG-first

Para o MVP, a renderização inicial deve ser feita com SVG.

Motivo:

* Facilita selecionar elementos.
* Facilita mover elementos.
* Facilita renderizar formas.
* Facilita criar setas.
* Facilita inspecionar elementos no DOM.
* Facilita exportar como SVG.
* É mais simples para um primeiro editor visual.

Canvas API pode ser usada depois para otimização, exportação PNG ou rendering avançado.

## Estrutura inicial sugerida

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

## Modelo inicial de elemento

```ts
export type LocalDrawElement =
  | RectangleElement
  | EllipseElement
  | ArrowElement
  | TextElement;

export type BaseElement = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  opacity: number;
  createdAt: string;
  updatedAt: string;
};

export type RectangleElement = BaseElement & {
  type: "rectangle";
  text?: string;
};

export type EllipseElement = BaseElement & {
  type: "ellipse";
  text?: string;
};

export type ArrowElement = BaseElement & {
  type: "arrow";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  label?: string;
  startBindingId?: string;
  endBindingId?: string;
};

export type TextElement = BaseElement & {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
};
```

## Modelo inicial de arquivo

```ts
export type LocalDrawFile = {
  version: 1;
  app: "localdraw";
  name: string;
  description?: string;
  tags: string[];
  elements: LocalDrawElement[];
  viewport: {
    zoom: number;
    scrollX: number;
    scrollY: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
};
```

## Convenções de desenho

Para facilitar a interpretação futura por agentes, o projeto deve incentivar algumas convenções simples.

* Retângulo = serviço, aplicação ou componente.
* Elipse = entidade, ator ou recurso externo.
* Seta = comunicação, dependência ou fluxo.
* Texto dentro de uma forma = nome do componente.
* Texto próximo de uma seta = protocolo, evento ou ação.
* Grupo visual = contexto, domínio ou etapa do fluxo.
* Cor = classificação definida pelo usuário.

Essas convenções não devem bloquear o uso livre do editor.

## Fase 0: Bootstrap do projeto

### Objetivo

Criar a base técnica do projeto.

### Tarefas

* Criar projeto com Vite, React e TypeScript.
* Criar layout inicial com:
  * Sidebar esquerda.
  * Área central do editor.
  * Painel direito.
  * Toolbar superior.
* Criar estrutura inicial de pastas.
* Criar estado inicial do editor.

### Critérios de aceite

* `npm install` funciona.
* `npm run dev` sobe a aplicação.
* A tela possui sidebar esquerda.
* A tela possui área central de desenho.
* A tela possui painel direito.
* A tela possui toolbar superior.
* O projeto não usa `@excalidraw/excalidraw`.
* O projeto não usa componentes oficiais do Excalidraw.
* O projeto não usa bibliotecas prontas de whiteboard/editor visual.

### Fora de escopo desta fase

* Desenhar formas.
* Persistência.
* Exportação.
* IA.
* Parser de diagrama.

## Fase 1: Viewport do editor

### Objetivo

Criar a área visual onde os elementos serão renderizados.

### Tarefas

* Criar EditorCanvas.
* Criar EditorViewport.
* Renderizar uma área SVG grande.
* Implementar zoom básico.
* Implementar pan básico.
* Criar grid simples opcional.
* Mostrar coordenadas ou estado do viewport para debug.

### Critérios de aceite

* A área de desenho aparece.
* O usuário consegue dar zoom.
* O usuário consegue mover a visão do canvas.
* O estado do viewport é mantido na aplicação.
* A implementação usa SVG e eventos próprios.

## Fase 2: Ferramenta de seleção

### Objetivo

Permitir selecionar e mover elementos.

### Tarefas

* Criar ferramenta select.
* Criar modelo de seleção.
* Permitir clicar em elemento.
* Permitir selecionar um elemento por vez.
* Renderizar borda de seleção.
* Permitir arrastar elemento selecionado.
* Permitir limpar seleção clicando no fundo.

### Critérios de aceite

* Um elemento pode ser selecionado.
* Um elemento selecionado mostra destaque visual.
* Um elemento selecionado pode ser movido.
* Clicar fora remove a seleção.

## Fase 3: Ferramenta de retângulo

### Objetivo

Permitir criar retângulos no editor.

### Tarefas

* Criar ferramenta rectangle.
* Criar elemento do tipo rectangle.
* Permitir clicar e arrastar para desenhar.
* Renderizar retângulo no SVG.
* Permitir selecionar retângulo criado.
* Permitir mover retângulo criado.

### Critérios de aceite

* O usuário seleciona a ferramenta retângulo.
* O usuário clica e arrasta no canvas.
* Um retângulo é criado.
* O retângulo fica salvo no estado do editor.
* O retângulo pode ser selecionado e movido.

## Fase 4: Ferramenta de elipse

### Objetivo

Permitir criar elipses no editor.

### Tarefas

* Criar ferramenta ellipse.
* Criar elemento do tipo ellipse.
* Permitir clicar e arrastar para desenhar.
* Renderizar elipse no SVG.
* Permitir selecionar e mover elipse.

### Critérios de aceite

* O usuário consegue criar elipses.
* A elipse aparece no canvas.
* A elipse pode ser selecionada.
* A elipse pode ser movida.

## Fase 5: Ferramenta de texto

### Objetivo

Permitir criar textos no editor.

### Tarefas

* Criar ferramenta text.
* Criar elemento do tipo text.
* Permitir clicar no canvas para inserir texto.
* Permitir editar texto.
* Renderizar texto no SVG.
* Permitir selecionar e mover texto.

### Critérios de aceite

* O usuário consegue criar texto.
* O texto aparece no canvas.
* O texto pode ser editado.
* O texto pode ser selecionado e movido.

## Fase 6: Ferramenta de seta

### Objetivo

Permitir criar setas/conectores.

### Tarefas

* Criar ferramenta arrow.
* Criar elemento do tipo arrow.
* Permitir clicar e arrastar para criar seta.
* Renderizar linha com ponta de seta.
* Permitir mover a seta.
* Permitir editar label da seta.
* Preparar campos para conexão futura entre elementos.

### Critérios de aceite

* O usuário consegue criar uma seta.
* A seta aparece no canvas.
* A seta possui ponta visual.
* A seta pode ter label.
* A seta pode ser selecionada.

## Fase 7: Resize e edição básica

### Objetivo

Permitir alterar tamanho dos elementos.

### Tarefas

* Criar handles de resize.
* Permitir redimensionar retângulos.
* Permitir redimensionar elipses.
* Permitir ajustar início e fim de setas.
* Atualizar estado durante resize.
* Evitar tamanho negativo ou inválido.

### Critérios de aceite

* Um retângulo pode ser redimensionado.
* Uma elipse pode ser redimensionada.
* Uma seta pode ter início e fim ajustados.
* A seleção continua funcionando após resize.

## Fase 8: Estilos visuais

### Objetivo

Permitir alterar aparência básica dos elementos.

### Tarefas

* Alterar cor da borda.
* Alterar cor de fundo.
* Alterar espessura da linha.
* Alterar opacidade.
* Alterar tamanho da fonte.
* Criar painel simples de propriedades.

### Critérios de aceite

* O usuário seleciona um elemento.
* O painel mostra propriedades do elemento.
* O usuário consegue alterar cores.
* O usuário consegue alterar espessura.
* O usuário consegue alterar texto/fonte quando aplicável.

## Fase 9: Undo e redo

### Objetivo

Permitir desfazer e refazer ações.

### Tarefas

* Criar histórico de alterações.
* Registrar criação de elementos.
* Registrar movimentação.
* Registrar resize.
* Registrar alterações de estilo.
* Implementar atalhos:
  * Ctrl/Cmd + Z.
  * Ctrl/Cmd + Shift + Z.
  * Ctrl/Cmd + Y.

### Critérios de aceite

* O usuário consegue desfazer criação de elemento.
* O usuário consegue refazer criação de elemento.
* O usuário consegue desfazer movimento.
* O usuário consegue refazer movimento.
* O histórico não cresce de forma descontrolada.

## Fase 10: Persistência local

### Objetivo

Salvar desenhos localmente.

### Tarefas

* Criar camada de storage usando IndexedDB.
* Criar entidade Project.
* Criar entidade Drawing.
* Implementar autosave com debounce.
* Salvar elementos.
* Salvar viewport.
* Salvar metadados.
* Permitir reabrir desenho salvo.

### Critérios de aceite

* O usuário cria um desenho.
* O desenho é salvo localmente.
* Ao recarregar a página, o desenho continua disponível.
* O usuário consegue abrir desenho salvo.
* O autosave não executa a cada pequeno movimento sem controle.

## Fase 11: Organização de desenhos

### Objetivo

Permitir gerenciar desenhos salvos.

### Tarefas

* Criar lista lateral de desenhos.
* Criar novo desenho.
* Renomear desenho.
* Duplicar desenho.
* Excluir desenho.
* Editar descrição.
* Adicionar tags.
* Mostrar data da última alteração.

### Critérios de aceite

* A sidebar lista desenhos.
* O usuário consegue criar novo desenho.
* O usuário consegue renomear desenho.
* O usuário consegue excluir desenho.
* O usuário consegue duplicar desenho.
* O desenho selecionado é carregado no editor.

## Fase 12: Importação e exportação

### Objetivo

Permitir levar desenhos para fora da aplicação e importar de volta.

### Tarefas

* Exportar desenho como `.localdraw`.
* Importar arquivo `.localdraw`.
* Validar versão do arquivo.
* Tratar erro de arquivo inválido.
* Exportar como SVG.
* Exportar como PNG.

### Critérios de aceite

* Um arquivo `.localdraw` exportado pode ser importado novamente.
* Um arquivo inválido mostra erro claro.
* A exportação SVG gera arquivo válido.
* A exportação PNG gera imagem válida.
* Importar um arquivo não quebra desenhos já salvos.

## Fase 13: Atalhos de teclado

### Objetivo

Melhorar experiência de uso.

### Tarefas

* Delete/Backspace remove elemento selecionado.
* Ctrl/Cmd + Z desfaz.
* Ctrl/Cmd + Shift + Z refaz.
* Ctrl/Cmd + C copia elemento.
* Ctrl/Cmd + V cola elemento.
* Esc limpa seleção.
* V ativa seleção.
* R ativa retângulo.
* O ativa elipse.
* A ativa seta.
* T ativa texto.
* H ativa mão/pan.

### Critérios de aceite

* Os atalhos principais funcionam.
* Atalhos não quebram edição de texto.
* O usuário consegue alternar ferramentas pelo teclado.

## Fase 14: Parser inicial do diagrama

### Objetivo

Criar uma interpretação estruturada do desenho sem usar IA.

Essa fase prepara o projeto para futura geração de documentação técnica.

### Tarefas

* Ler elementos do desenho.
* Identificar textos.
* Identificar formas.
* Identificar setas.
* Relacionar textos dentro ou próximos de formas.
* Relacionar labels próximos de setas.
* Gerar objeto ParsedDiagram.

Tipo sugerido:

```ts
type ParsedDiagram = {
  title?: string;
  components: Array<{
    id: string;
    name?: string;
    type: "service" | "database" | "external" | "actor" | "unknown";
    elementId: string;
  }>;
  relationships: Array<{
    id: string;
    from?: string;
    to?: string;
    label?: string;
    elementId: string;
  }>;
  notes: Array<{
    id: string;
    text: string;
    elementId: string;
  }>;
  assumptions: string[];
  openQuestions: string[];
};
```

### Critérios de aceite

* O usuário clica em Analyze Diagram.
* O painel direito mostra o JSON estruturado.
* Textos aparecem no resultado.
* Formas aparecem como possíveis componentes.
* Setas aparecem como possíveis relações.
* Relações incertas aparecem em perguntas em aberto.
* O parser não inventa informação.

## Fase 15: Technical Doc sem IA

### Objetivo

Gerar uma primeira Technical Doc em Markdown usando apenas o ParsedDiagram.

### Tarefas

* Criar `markdownGenerator.ts`.
* Gerar Markdown a partir do ParsedDiagram.
* Exibir preview no painel direito.
* Permitir copiar Markdown.
* Permitir baixar `.md`.

Estrutura inicial da doc:

```md
# Technical Doc
## Contexto
## Componentes identificados
## Fluxo principal
## Integrações
## Decisões assumidas
## Riscos e limitações
## Perguntas em aberto
```

### Critérios de aceite

* Um desenho simples gera uma doc legível.
* Componentes aparecem na seção correta.
* Relações aparecem no fluxo principal.
* Incertezas aparecem em perguntas em aberto.
* O usuário consegue copiar ou baixar o Markdown.
* A geração funciona offline.

## Fase 16: Preparação para agente

### Objetivo

Criar uma fronteira clara entre editor, parser e agente.

O agente não deve receber o arquivo bruto como única entrada.

O agente deve receber um contexto estruturado e reduzido.

### Tarefas

* Criar tipo TechnicalDocInput.
* Criar tipo TechnicalDocOutput.
* Criar função para transformar ParsedDiagram em contexto.
* Criar prompt base versionado no projeto.
* Criar fallback local sem IA.

Contrato sugerido:

```ts
type TechnicalDocInput = {
  diagram: ParsedDiagram;
  userContext?: string;
  outputLanguage: "pt-BR" | "en-US";
  docStyle: "concise" | "detailed";
};

type TechnicalDocOutput = {
  markdown: string;
  assumptions: string[];
  openQuestions: string[];
};
```

### Critérios de aceite

* Existe contrato claro de entrada.
* Existe contrato claro de saída.
* Existe prompt base versionado.
* A aplicação continua funcionando sem IA.
* A doc sem IA continua disponível como fallback.

## Fase 17: Integração com agente ou LLM

### Objetivo

Gerar uma Technical Doc mais rica usando um agente ou modelo de linguagem.

### Tarefas

* Criar serviço isolado para geração com IA.
* Enviar TechnicalDocInput.
* Receber TechnicalDocOutput.
* Exibir resultado editável.
* Salvar a doc gerada junto ao desenho.
* Permitir regenerar a doc.
* Permitir comparar doc local vs doc com IA.

### Regras do agente

O agente deve:

* Usar somente informações fornecidas pelo diagrama e pelo contexto do usuário.
* Não inventar tecnologias.
* Não assumir protocolos sem evidência.
* Registrar incertezas.
* Gerar perguntas em aberto quando faltar informação.
* Preservar o idioma solicitado.
* Gerar Markdown limpo e versionável.

### Critérios de aceite

* O usuário consegue gerar doc com IA.
* O usuário consegue editar a doc.
* O usuário consegue salvar a doc.
* Falhas da IA não quebram a aplicação.
* O resultado deixa claro o que é inferência e o que veio do diagrama.

## Fase 18: Skill para Codex

### Objetivo

Permitir que o Codex use arquivos `.localdraw` do projeto para gerar documentação técnica versionada.

Estrutura sugerida:

```text
skills/
  localdraw-to-technical-doc/
    SKILL.md
    references/
      diagram-conventions.md
      technical-doc-template.md
      output-rules.md
    scripts/
      parse-localdraw.ts
```

Uso esperado:

```text
Use a skill localdraw-to-technical-doc para ler docs/architecture.localdraw e gerar docs/architecture.md.
```

### Tarefas

* Criar `SKILL.md`.
* Criar template de Technical Doc.
* Criar regras de saída.
* Criar script para parsear `.localdraw`.
* Criar exemplo de arquivo `.localdraw`.
* Criar exemplo de saída `.md`.

### Critérios de aceite

* O Codex entende como usar a skill.
* A skill define claramente entrada e saída.
* A skill proíbe invenções.
* A skill registra perguntas em aberto.
* A doc gerada é salva em Markdown.

## Definition of Done do MVP

O MVP será considerado completo quando:

* O usuário conseguir criar um desenho.
* O usuário conseguir desenhar retângulos.
* O usuário conseguir desenhar elipses.
* O usuário conseguir criar textos.
* O usuário conseguir criar setas.
* O usuário conseguir selecionar elementos.
* O usuário conseguir mover elementos.
* O usuário conseguir redimensionar elementos.
* O usuário conseguir alterar estilos básicos.
* O usuário conseguir usar undo/redo.
* O desenho for salvo localmente.
* O desenho puder ser reaberto.
* O desenho puder ser exportado como `.localdraw`.
* O desenho puder ser importado novamente.
* O desenho puder ser exportado como PNG ou SVG.
* A aplicação tiver sidebar de desenhos.
* A aplicação tiver painel direito para análise futura.
* O parser inicial gerar ParsedDiagram.
* A Technical Doc sem IA puder ser gerada em Markdown.
* O projeto tiver README com instruções de execução.
* O projeto tiver ROADMAP.md atualizado.

## Fora do escopo do MVP

Não fazem parte do MVP inicial:

* Usar `@excalidraw/excalidraw`.
* Usar código oficial do Excalidraw.
* Usar componentes oficiais do Excalidraw.
* Usar bibliotecas prontas de whiteboard/editor visual.
* Colaboração em tempo real.
* Login.
* Backend remoto.
* Multiusuário.
* Sincronização em nuvem.
* Agente autônomo editando o desenho.
* Geração perfeita de documentação.
* Deploy público.
* Marketplace de templates.
* Compatibilidade com `.excalidraw`.
* Edição avançada de paths livres.
* Hand-drawn rendering perfeito.
* Performance equivalente ao Excalidraw real.

## Riscos conhecidos

### Escopo grande demais

Criar um editor visual do zero é mais trabalhoso do que integrar uma biblioteca pronta.

Mitigação:

* Começar com poucas ferramentas.
* Priorizar retângulo, texto, seta e seleção.
* Evitar recursos avançados no início.

### Renderização complexa

Criar uma experiência parecida com Excalidraw exige lidar com zoom, pan, seleção, resize, eventos de mouse e teclado.

Mitigação:

* Começar com SVG.
* Separar ferramentas por arquivos.
* Criar modelos simples de elementos.
* Evoluir a experiência aos poucos.

### Parser impreciso

O desenho é livre. Nem sempre será possível saber o significado exato de uma forma.

Mitigação:

* Usar convenções de desenho.
* Registrar incertezas.
* Não inventar relações.

### IA alucinando documentação

Um agente pode inferir tecnologias ou fluxos que não existem.

Mitigação:

* Enviar contexto estruturado.
* Proibir invenções no prompt.
* Separar fatos, inferências e perguntas em aberto.

### Persistência local complexa

Salvar estado visual, viewport e histórico pode gerar inconsistências.

Mitigação:

* Criar formato próprio simples.
* Versionar o formato do arquivo.
* Validar importação.
* Manter migrações possíveis no futuro.

## Ordem recomendada de execução

1. Bootstrap React + Vite + TypeScript.
2. Criar layout base.
3. Criar viewport SVG com zoom e pan.
4. Criar ferramenta de seleção.
5. Criar retângulo.
6. Criar elipse.
7. Criar texto.
8. Criar seta.
9. Criar resize.
10. Criar estilos básicos.
11. Criar undo/redo.
12. Criar persistência local.
13. Criar lista de desenhos.
14. Criar import/export `.localdraw`.
15. Criar export PNG/SVG.
16. Criar parser inicial.
17. Criar Technical Doc sem IA.
18. Preparar contrato para agente.
19. Integrar geração com IA.
20. Criar skill para Codex.

## Observação final

Este roadmap deve ser tratado como contrato inicial do projeto.

Agentes podem sugerir mudanças no roadmap, mas não devem alterar o escopo principal sem aprovação humana.

O foco é construir um editor local próprio, inspirado na experiência do Excalidraw, mas com implementação, formato de arquivo e evolução independentes.
