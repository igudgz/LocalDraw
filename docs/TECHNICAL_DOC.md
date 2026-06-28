# LocalDraw - Technical Doc

## Objetivo do documento

Este documento responde: "Como tecnicamente esse produto deve funcionar?"

Fonte principal: `ROADMAP.md` na raiz do projeto.

## Visao tecnica

LocalDraw deve ser uma aplicacao local-first de desenho tecnico, renderizada inicialmente com SVG e orientada por um estado local de editor.

A arquitetura deve separar editor, ferramentas, elementos, selecao, historico, persistencia, organizacao de desenhos, exportacao e geracao de documentacao tecnica.

O produto deve funcionar sem IA no MVP. A geracao com agente ou LLM e uma evolucao futura que deve consumir um contexto estruturado, nao apenas o arquivo bruto.

## Stack sugerida

* React.
* Vite.
* TypeScript.
* SVG para renderizacao inicial.
* Pointer Events API.
* IndexedDB.
* Estado local com reducer proprio ou Zustand.
* Markdown preview.

## Decisao de construir do zero

O editor visual deve ser implementado com APIs e componentes proprios.

Nao usar:

* `@excalidraw/excalidraw`.
* Componentes oficiais do Excalidraw.
* Codigo oficial do Excalidraw.
* Bibliotecas prontas de whiteboard/editor visual.
* Clones prontos de Excalidraw.

A aplicacao pode se inspirar na experiencia do Excalidraw, mas deve manter implementacao, arquitetura, formato de arquivo e evolucao independentes.

## Decisao SVG-first

Para o MVP, a renderizacao inicial deve ser feita com SVG.

Motivos:

* Facilita selecionar elementos.
* Facilita mover elementos.
* Facilita renderizar formas.
* Facilita criar setas.
* Facilita inspecionar elementos no DOM.
* Facilita exportar como SVG.
* Reduz complexidade para um primeiro editor visual.

Canvas API pode ser usada depois para otimizacao, exportacao PNG ou renderizacao avancada.

## Dependencias permitidas e evitadas

Permitido:

* React.
* TypeScript.
* Vite.
* APIs nativas do browser.
* SVG.
* Canvas API quando necessario.
* Pointer Events API.
* IndexedDB.
* Bibliotecas pequenas de utilidade, quando justificadas.

Evitar no MVP:

* Bibliotecas grandes de edicao visual.
* Frameworks prontos de whiteboard.
* Dependencias que escondam a logica principal do editor.
* Componentes oficiais do Excalidraw.

## Modelo inicial de elementos

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

## Modelo inicial de arquivo `.localdraw`

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

## Convencoes de desenho

As convencoes devem ajudar interpretacao futura por parser e agentes, sem bloquear uso livre do editor.

* Retangulo = servico, aplicacao ou componente.
* Elipse = entidade, ator ou recurso externo.
* Seta = comunicacao, dependencia ou fluxo.
* Texto dentro de uma forma = nome do componente.
* Texto proximo de uma seta = protocolo, evento ou acao.
* Grupo visual = contexto, dominio ou etapa do fluxo.
* Cor = classificacao definida pelo usuario.

## Contrato futuro para `ParsedDiagram`

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

Regras do parser:

* Ler elementos do desenho.
* Identificar textos, formas e setas.
* Relacionar textos dentro ou proximos de formas.
* Relacionar labels proximos de setas.
* Registrar relacoes incertas como perguntas em aberto.
* Nao inventar informacao.

## Contratos futuros para Technical Doc

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

O agente nao deve receber o arquivo bruto como unica entrada. Ele deve receber contexto estruturado e reduzido.

## Estrategia futura para agente/LLM

O servico de geracao com IA deve ser isolado da aplicacao principal.

O agente deve:

* Usar somente informacoes fornecidas pelo diagrama e pelo contexto do usuario.
* Nao inventar tecnologias.
* Nao assumir protocolos sem evidencia.
* Registrar incertezas.
* Gerar perguntas em aberto quando faltar informacao.
* Preservar o idioma solicitado.
* Gerar Markdown limpo e versionavel.

A aplicacao deve continuar funcionando sem IA e manter a doc sem IA como fallback.

## Riscos tecnicos

### Escopo grande demais

Criar editor visual do zero e mais trabalhoso que integrar biblioteca pronta.

Mitigacao:

* Comecar com poucas ferramentas.
* Priorizar retangulo, texto, seta e selecao.
* Evitar recursos avancados no inicio.

### Renderizacao complexa

Zoom, pan, selecao, resize, eventos de ponteiro e teclado podem gerar bugs de interacao.

Mitigacao:

* Comecar com SVG.
* Separar ferramentas por arquivos.
* Criar modelos simples de elementos.
* Evoluir experiencia aos poucos.

### Parser impreciso

O desenho e livre e nem sempre sera possivel saber o significado exato de uma forma.

Mitigacao:

* Usar convencoes de desenho.
* Registrar incertezas.
* Nao inventar relacoes.

### IA alucinando documentacao

Um agente pode inferir tecnologias ou fluxos inexistentes.

Mitigacao:

* Enviar contexto estruturado.
* Proibir invencoes no prompt.
* Separar fatos, inferencias e perguntas em aberto.

### Persistencia local complexa

Salvar estado visual, viewport e historico pode gerar inconsistencias.

Mitigacao:

* Criar formato proprio simples.
* Versionar o formato do arquivo.
* Validar importacao.
* Manter migracoes possiveis no futuro.

## Pontos a definir

* Biblioteca de estado final: reducer proprio ou Zustand.
* Politica de migracao de arquivos `.localdraw`.
* Estrategia exata de exportacao PNG.
* Modelo definitivo para grupos visuais.
* Nivel de detalhamento do prompt base versionado.
