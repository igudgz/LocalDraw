# LocalDraw - Product Spec

## Objetivo do documento

Este documento responde: "O que estamos construindo e por que?"

Fonte principal: `ROADMAP.md` na raiz do projeto.

## Visao do LocalDraw

LocalDraw sera um editor local de diagramas inspirado na experiencia de whiteboard do Excalidraw, mas construido do zero.

A aplicacao deve permitir que o usuario desenhe estruturas tecnicas, fluxos, arquiteturas e anotacoes visuais de forma livre, com uma experiencia simples, rapida e local-first.

O produto tambem deve preparar o caminho para uma evolucao futura em que um agente consiga interpretar o desenho e gerar uma Technical Doc em Markdown.

## Problema que resolve

Usuarios tecnicos frequentemente precisam transformar ideias visuais em diagramas e depois em documentacao. Ferramentas prontas resolvem parte do problema, mas reduzem o controle sobre o formato, a arquitetura e a evolucao do produto.

O LocalDraw busca resolver esse problema com um editor proprio, local, simples e evolutivo, capaz de salvar desenhos em formato proprio `.localdraw` e expor uma estrutura interpretavel para parser e agentes no futuro.

## Publico-alvo

* Desenvolvedores que desenham arquiteturas, fluxos e integracoes.
* Tech leads e arquitetos que precisam rascunhar decisoes tecnicas.
* Product managers e analistas que criam fluxos visuais simples.
* Pessoas estudando como editores visuais funcionam.
* Agentes de desenvolvimento que precisam evoluir o produto por fases documentadas.

## Objetivos do MVP

Criar uma aplicacao local de desenho tecnico com:

* Canvas/viewport para desenho.
* Ferramentas basicas de desenho.
* Selecao e movimentacao de elementos.
* Texto.
* Setas/conectores.
* Resize basico.
* Estilos visuais basicos.
* Undo/redo.
* Zoom e pan.
* Persistencia local.
* Importacao/exportacao em formato proprio.
* Exportacao como imagem.
* Organizacao simples de desenhos.
* Painel lateral para analise futura do diagrama.
* Parser inicial para transformar o desenho em estrutura interpretavel.
* Geracao inicial de Technical Doc em Markdown sem IA.

## Objetivos de longo prazo

Permitir que um agente leia o desenho criado na aplicacao e gere uma Technical Doc em Markdown.

Estrutura esperada para uma saida futura:

```md
# Technical Doc
## Contexto
## Objetivo
## Componentes
## Fluxo principal
## Integracoes
## Decisoes tecnicas
## Riscos
## Perguntas em aberto
```

## Fluxos principais do usuario

1. Criar um novo desenho local.
2. Selecionar uma ferramenta de desenho.
3. Desenhar retangulos, elipses, textos e setas.
4. Selecionar e mover elementos.
5. Redimensionar elementos.
6. Alterar estilos visuais basicos.
7. Usar zoom e pan para navegar no canvas.
8. Usar undo/redo para corrigir acoes.
9. Salvar e reabrir desenhos localmente.
10. Organizar desenhos em uma lista simples.
11. Exportar e importar arquivos `.localdraw`.
12. Exportar o desenho como SVG ou PNG.
13. Acionar analise do diagrama.
14. Visualizar `ParsedDiagram` no painel direito.
15. Gerar, copiar e baixar uma Technical Doc em Markdown sem IA.

## Fora do escopo do MVP

Nao fazem parte do MVP inicial:

* Usar `@excalidraw/excalidraw`.
* Usar codigo oficial do Excalidraw.
* Usar componentes oficiais do Excalidraw.
* Usar bibliotecas prontas de whiteboard/editor visual.
* Colaboracao em tempo real.
* Login.
* Backend remoto.
* Multiusuario.
* Sincronizacao em nuvem.
* Agente autonomo editando o desenho.
* Geracao perfeita de documentacao.
* Deploy publico.
* Marketplace de templates.
* Compatibilidade com `.excalidraw`.
* Edicao avancada de paths livres.
* Hand-drawn rendering perfeito.
* Performance equivalente ao Excalidraw real.

## Criterios de sucesso

* O usuario consegue criar um desenho tecnico simples sem backend.
* O usuario consegue manipular elementos basicos com previsibilidade.
* O desenho pode ser salvo, reaberto, importado e exportado.
* O projeto mantem formato proprio `.localdraw`.
* O projeto permanece independente de Excalidraw oficial e de whiteboards prontos.
* O parser inicial gera uma estrutura interpretavel sem inventar informacao.
* A Technical Doc sem IA e gerada offline a partir do `ParsedDiagram`.
* Agentes conseguem entender escopo, arquitetura, tarefas, criterios de aceite e QA pelos documentos do projeto.

## Definition of Done do produto

O MVP sera considerado completo quando:

* O usuario conseguir criar um desenho.
* O usuario conseguir desenhar retangulos.
* O usuario conseguir desenhar elipses.
* O usuario conseguir criar textos.
* O usuario conseguir criar setas.
* O usuario conseguir selecionar elementos.
* O usuario conseguir mover elementos.
* O usuario conseguir redimensionar elementos.
* O usuario conseguir alterar estilos basicos.
* O usuario conseguir usar undo/redo.
* O desenho for salvo localmente.
* O desenho puder ser reaberto.
* O desenho puder ser exportado como `.localdraw`.
* O desenho puder ser importado novamente.
* O desenho puder ser exportado como PNG ou SVG.
* A aplicacao tiver sidebar de desenhos.
* A aplicacao tiver painel direito para analise futura.
* O parser inicial gerar `ParsedDiagram`.
* A Technical Doc sem IA puder ser gerada em Markdown.
* O projeto tiver README com instrucoes de execucao.
* O projeto tiver `ROADMAP.md` atualizado.

## Pontos a definir

* Persona primaria do MVP: TBD.
* Criterios quantitativos de sucesso de usabilidade: TBD.
* Nome final para os conceitos Project e Drawing na interface: A definir.
* Politica de versionamento do formato `.localdraw`: A definir.
