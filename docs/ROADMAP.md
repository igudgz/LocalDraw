# LocalDraw - Roadmap

## Objetivo do documento

Este documento responde: "Em que ordem vamos construir?"

Fonte principal: `ROADMAP.md` na raiz do projeto. Esta versao em `docs/` mantem o plano de execucao focado em fases, tarefas, criterios de aceite, fora de escopo e ordem recomendada.

## Fase 0: Bootstrap do projeto

### Objetivo

Criar a base tecnica do projeto.

### Tarefas

* Criar projeto com Vite, React e TypeScript.
* Criar layout inicial com:
  * Sidebar esquerda.
  * Area central do editor.
  * Painel direito.
  * Toolbar superior.
* Criar estrutura inicial de pastas.
* Criar estado inicial do editor.

### Criterios de aceite

* `npm install` funciona.
* `npm run dev` sobe a aplicacao.
* A tela possui sidebar esquerda.
* A tela possui area central de desenho.
* A tela possui painel direito.
* A tela possui toolbar superior.
* O projeto nao usa `@excalidraw/excalidraw`.
* O projeto nao usa componentes oficiais do Excalidraw.
* O projeto nao usa bibliotecas prontas de whiteboard/editor visual.

### Fora de escopo

* Desenhar formas.
* Persistencia.
* Exportacao.
* IA.
* Parser de diagrama.

## Fase 1: Viewport do editor

### Objetivo

Criar a area visual onde os elementos serao renderizados.

### Tarefas

* Criar `EditorCanvas`.
* Criar `EditorViewport`.
* Renderizar uma area SVG grande.
* Implementar zoom basico.
* Implementar pan basico.
* Criar grid simples opcional.
* Mostrar coordenadas ou estado do viewport para debug.

### Criterios de aceite

* A area de desenho aparece.
* O usuario consegue dar zoom.
* O usuario consegue mover a visao do canvas.
* O estado do viewport e mantido na aplicacao.
* A implementacao usa SVG e eventos proprios.

## Fase 2: Ferramenta de selecao

### Objetivo

Permitir selecionar e mover elementos.

### Tarefas

* Criar ferramenta select.
* Criar modelo de selecao.
* Permitir clicar em elemento.
* Permitir selecionar um elemento por vez.
* Renderizar borda de selecao.
* Permitir arrastar elemento selecionado.
* Permitir limpar selecao clicando no fundo.

### Criterios de aceite

* Um elemento pode ser selecionado.
* Um elemento selecionado mostra destaque visual.
* Um elemento selecionado pode ser movido.
* Clicar fora remove a selecao.

## Fase 3: Ferramenta de retangulo

### Objetivo

Permitir criar retangulos no editor.

### Tarefas

* Criar ferramenta rectangle.
* Criar elemento do tipo rectangle.
* Permitir clicar e arrastar para desenhar.
* Renderizar retangulo no SVG.
* Permitir selecionar retangulo criado.
* Permitir mover retangulo criado.

### Criterios de aceite

* O usuario seleciona a ferramenta retangulo.
* O usuario clica e arrasta no canvas.
* Um retangulo e criado.
* O retangulo fica salvo no estado do editor.
* O retangulo pode ser selecionado e movido.

## Fase 4: Ferramenta de elipse

### Objetivo

Permitir criar elipses no editor.

### Tarefas

* Criar ferramenta ellipse.
* Criar elemento do tipo ellipse.
* Permitir clicar e arrastar para desenhar.
* Renderizar elipse no SVG.
* Permitir selecionar e mover elipse.

### Criterios de aceite

* O usuario consegue criar elipses.
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

### Criterios de aceite

* O usuario consegue criar texto.
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
* Preparar campos para conexao futura entre elementos.

### Criterios de aceite

* O usuario consegue criar uma seta.
* A seta aparece no canvas.
* A seta possui ponta visual.
* A seta pode ter label.
* A seta pode ser selecionada.

## Fase 7: Resize e edicao basica

### Objetivo

Permitir alterar tamanho dos elementos.

### Tarefas

* Criar handles de resize.
* Permitir redimensionar retangulos.
* Permitir redimensionar elipses.
* Permitir ajustar inicio e fim de setas.
* Atualizar estado durante resize.
* Evitar tamanho negativo ou invalido.

### Criterios de aceite

* Um retangulo pode ser redimensionado.
* Uma elipse pode ser redimensionada.
* Uma seta pode ter inicio e fim ajustados.
* A selecao continua funcionando apos resize.

## Fase 8: Estilos visuais

### Objetivo

Permitir alterar aparencia basica dos elementos.

### Tarefas

* Alterar cor da borda.
* Alterar cor de fundo.
* Alterar espessura da linha.
* Alterar opacidade.
* Alterar tamanho da fonte.
* Criar painel simples de propriedades.

### Criterios de aceite

* O usuario seleciona um elemento.
* O painel mostra propriedades do elemento.
* O usuario consegue alterar cores.
* O usuario consegue alterar espessura.
* O usuario consegue alterar texto/fonte quando aplicavel.

## Fase 9: Undo e redo

### Objetivo

Permitir desfazer e refazer acoes.

### Tarefas

* Criar historico de alteracoes.
* Registrar criacao de elementos.
* Registrar movimentacao.
* Registrar resize.
* Registrar alteracoes de estilo.
* Implementar atalhos:
  * Ctrl/Cmd + Z.
  * Ctrl/Cmd + Shift + Z.
  * Ctrl/Cmd + Y.

### Criterios de aceite

* O usuario consegue desfazer criacao de elemento.
* O usuario consegue refazer criacao de elemento.
* O usuario consegue desfazer movimento.
* O usuario consegue refazer movimento.
* O historico nao cresce de forma descontrolada.

## Fase 10: Persistencia local

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

### Criterios de aceite

* O usuario cria um desenho.
* O desenho e salvo localmente.
* Ao recarregar a pagina, o desenho continua disponivel.
* O usuario consegue abrir desenho salvo.
* O autosave nao executa a cada pequeno movimento sem controle.

## Fase 11: Organizacao de desenhos

### Objetivo

Permitir gerenciar desenhos salvos.

### Tarefas

* Criar lista lateral de desenhos.
* Criar novo desenho.
* Renomear desenho.
* Duplicar desenho.
* Excluir desenho.
* Editar descricao.
* Adicionar tags.
* Mostrar data da ultima alteracao.

### Criterios de aceite

* A sidebar lista desenhos.
* O usuario consegue criar novo desenho.
* O usuario consegue renomear desenho.
* O usuario consegue excluir desenho.
* O usuario consegue duplicar desenho.
* O desenho selecionado e carregado no editor.

## Fase 12: Importacao e exportacao

### Objetivo

Permitir levar desenhos para fora da aplicacao e importar de volta.

### Tarefas

* Exportar desenho como `.localdraw`.
* Importar arquivo `.localdraw`.
* Validar versao do arquivo.
* Tratar erro de arquivo invalido.
* Exportar como SVG.
* Exportar como PNG.

### Criterios de aceite

* Um arquivo `.localdraw` exportado pode ser importado novamente.
* Um arquivo invalido mostra erro claro.
* A exportacao SVG gera arquivo valido.
* A exportacao PNG gera imagem valida.
* Importar um arquivo nao quebra desenhos ja salvos.

## Fase 13: Atalhos de teclado

### Objetivo

Melhorar experiencia de uso.

### Tarefas

* Delete/Backspace remove elemento selecionado.
* Ctrl/Cmd + Z desfaz.
* Ctrl/Cmd + Shift + Z refaz.
* Ctrl/Cmd + C copia elemento.
* Ctrl/Cmd + V cola elemento.
* Esc limpa selecao.
* V ativa selecao.
* R ativa retangulo.
* O ativa elipse.
* A ativa seta.
* T ativa texto.
* H ativa mao/pan.

### Criterios de aceite

* Os atalhos principais funcionam.
* Atalhos nao quebram edicao de texto.
* O usuario consegue alternar ferramentas pelo teclado.

## Fase 14: Parser inicial do diagrama

### Objetivo

Criar uma interpretacao estruturada do desenho sem usar IA.

### Tarefas

* Ler elementos do desenho.
* Identificar textos.
* Identificar formas.
* Identificar setas.
* Relacionar textos dentro ou proximos de formas.
* Relacionar labels proximos de setas.
* Gerar objeto `ParsedDiagram`.

### Criterios de aceite

* O usuario clica em Analyze Diagram.
* O painel direito mostra o JSON estruturado.
* Textos aparecem no resultado.
* Formas aparecem como possiveis componentes.
* Setas aparecem como possiveis relacoes.
* Relacoes incertas aparecem em perguntas em aberto.
* O parser nao inventa informacao.

## Fase 15: Technical Doc sem IA

### Objetivo

Gerar uma primeira Technical Doc em Markdown usando apenas o `ParsedDiagram`.

### Tarefas

* Criar `markdownGenerator.ts`.
* Gerar Markdown a partir do `ParsedDiagram`.
* Exibir preview no painel direito.
* Permitir copiar Markdown.
* Permitir baixar `.md`.

### Criterios de aceite

* Um desenho simples gera uma doc legivel.
* Componentes aparecem na secao correta.
* Relacoes aparecem no fluxo principal.
* Incertezas aparecem em perguntas em aberto.
* O usuario consegue copiar ou baixar o Markdown.
* A geracao funciona offline.

## Fase 16: Preparacao para agente

### Objetivo

Criar uma fronteira clara entre editor, parser e agente.

### Tarefas

* Criar tipo `TechnicalDocInput`.
* Criar tipo `TechnicalDocOutput`.
* Criar funcao para transformar `ParsedDiagram` em contexto.
* Criar prompt base versionado no projeto.
* Criar fallback local sem IA.

### Criterios de aceite

* Existe contrato claro de entrada.
* Existe contrato claro de saida.
* Existe prompt base versionado.
* A aplicacao continua funcionando sem IA.
* A doc sem IA continua disponivel como fallback.

## Fase 17: Integracao com agente ou LLM

### Objetivo

Gerar uma Technical Doc mais rica usando um agente ou modelo de linguagem.

### Tarefas

* Criar servico isolado para geracao com IA.
* Enviar `TechnicalDocInput`.
* Receber `TechnicalDocOutput`.
* Exibir resultado editavel.
* Salvar a doc gerada junto ao desenho.
* Permitir regenerar a doc.
* Permitir comparar doc local vs doc com IA.

### Criterios de aceite

* O usuario consegue gerar doc com IA.
* O usuario consegue editar a doc.
* O usuario consegue salvar a doc.
* Falhas da IA nao quebram a aplicacao.
* O resultado deixa claro o que e inferencia e o que veio do diagrama.

## Fase 18: Skill para Codex

### Objetivo

Permitir que o Codex use arquivos `.localdraw` do projeto para gerar documentacao tecnica versionada.

### Tarefas

* Criar `SKILL.md`.
* Criar template de Technical Doc.
* Criar regras de saida.
* Criar script para parsear `.localdraw`.
* Criar exemplo de arquivo `.localdraw`.
* Criar exemplo de saida `.md`.

### Criterios de aceite

* O Codex entende como usar a skill.
* A skill define claramente entrada e saida.
* A skill proibe invencoes.
* A skill registra perguntas em aberto.
* A doc gerada e salva em Markdown.

## Ordem recomendada de execucao

1. Bootstrap React + Vite + TypeScript.
2. Criar layout base.
3. Criar viewport SVG com zoom e pan.
4. Criar ferramenta de selecao.
5. Criar retangulo.
6. Criar elipse.
7. Criar texto.
8. Criar seta.
9. Criar resize.
10. Criar estilos basicos.
11. Criar undo/redo.
12. Criar persistencia local.
13. Criar lista de desenhos.
14. Criar import/export `.localdraw`.
15. Criar export PNG/SVG.
16. Criar parser inicial.
17. Criar Technical Doc sem IA.
18. Preparar contrato para agente.
19. Integrar geracao com IA.
20. Criar skill para Codex.

## Definition of Done do MVP

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
