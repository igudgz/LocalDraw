# LocalDraw - QA Strategy

## Objetivo do documento

Este documento responde: "Como vamos saber que esta bom?"

Fonte principal: `ROADMAP.md` na raiz do projeto.

## Objetivo do QA no projeto

Garantir que cada fase do roadmap entregue comportamento verificavel sem violar as restricoes centrais do produto:

* Editor construido do zero.
* SVG-first no MVP.
* Produto local-first.
* Formato proprio `.localdraw`.
* Sem `@excalidraw/excalidraw`.
* Sem componentes oficiais do Excalidraw.
* Sem bibliotecas prontas de whiteboard/editor visual.

QA deve validar o comportamento entregue, registrar evidencias e bloquear entregas quando criterios de aceite ou restricoes de escopo forem violados.

## Tipos de validacao

### Validacao documental

Usada antes de implementar:

* A task tem objetivo claro.
* Criterios de aceite existem.
* Fora de escopo esta explicito.
* Referencias para docs relevantes foram incluidas.
* Dependencias e riscos estao documentados.

### Testes tecnicos

Devem validar logica e contratos quando houver codigo:

* Reducers e actions do editor.
* Calculos de geometria.
* Conversao entre coordenadas de tela e mundo.
* Parser de diagrama.
* Gerador de Markdown.
* Serializacao e importacao `.localdraw`.
* Historico undo/redo.

Tipos sugeridos: unitarios, integracao leve e testes de regressao para bugs corrigidos.

### Testes funcionais

Devem validar os fluxos do usuario:

* Criar desenho.
* Criar retangulo, elipse, texto e seta.
* Selecionar, mover e redimensionar elementos.
* Alterar estilos.
* Usar undo/redo.
* Salvar, recarregar e reabrir.
* Importar e exportar `.localdraw`.
* Exportar SVG/PNG.
* Gerar `ParsedDiagram`.
* Gerar Technical Doc sem IA.

### Testes E2E com Playwright MCP

O projeto deve considerar testes E2E como parte importante da validacao das fases com UI.

Quando o ambiente de agente disponibilizar Playwright MCP, ele deve ser a opcao preferida para validar fluxos reais no navegador e registrar evidencias de comportamento.

Objetivos dos testes E2E:

* Validar fluxos criticos do usuario em navegador real.
* Confirmar que interacoes de pointer, teclado, zoom, pan, selecao e resize funcionam juntas.
* Registrar screenshots, videos ou traces quando disponiveis.
* Ajudar agentes a reproduzir bugs de UI de forma objetiva.
* Proteger fluxos principais contra regressao entre fases.

Fluxos candidatos para E2E:

* Layout base com sidebar esquerda, toolbar superior, editor central e painel direito.
* Zoom e pan do viewport.
* Criacao, selecao e movimento de retangulos.
* Criacao, selecao e movimento de elipses.
* Criacao e edicao de texto.
* Criacao de setas e labels.
* Resize de elementos.
* Undo/redo.
* Persistencia local e reabertura.
* Importacao/exportacao `.localdraw`.
* Exportacao SVG/PNG.
* Analyze Diagram e exibicao de `ParsedDiagram`.
* Geracao de Technical Doc sem IA.

Regras:

* Nao instalar Playwright ou dependencias de teste sem task aprovada.
* Usar Playwright MCP somente quando disponivel no ambiente.
* Se Playwright MCP nao estiver disponivel, registrar como `Nao disponivel` e usar verificacoes alternativas aprovadas.
* Nao bloquear fases iniciais apenas pela ausencia do MCP quando a task nao exigir E2E.
* Quando uma story exigir E2E, registrar evidencia no QA report.

### Testes de usabilidade

Devem observar se a experiencia e previsivel:

* Ferramenta ativa fica clara.
* Cliques no canvas tem resultado esperado.
* Selecao e limpeza de selecao sao compreensiveis.
* Zoom e pan nao desorientam o usuario.
* Atalhos nao quebram edicao de texto.
* Mensagens de erro para importacao invalida sao claras.

Metricas quantitativas: TBD.

### Testes de regressao

Devem ser criados ou atualizados quando:

* Um bug e corrigido.
* Uma feature altera estado compartilhado.
* Uma mudanca toca parser, persistencia ou historico.
* Um comportamento do editor depende de combinacao de eventos.

## Criterios para bloquear uma entrega

Bloquear quando:

* Algum criterio de aceite da task falha.
* O comportamento quebra uma fase anterior.
* A task adiciona dependencia proibida.
* A task usa `@excalidraw/excalidraw`, codigo oficial ou componentes oficiais do Excalidraw.
* A task adiciona biblioteca pronta de whiteboard/editor visual.
* A task implementa escopo explicitamente fora do MVP sem aprovacao.
* Dados `.localdraw` exportados nao podem ser importados de volta.
* Parser ou agente inventa informacao nao presente no desenho/contexto.
* Falha de IA quebra fluxo offline.
* A interface fica inutilizavel no fluxo principal da fase.

## Checklist padrao de QA

* A task corresponde a uma fase do roadmap?
* O escopo entregue bate com o task brief?
* O fora de escopo foi respeitado?
* Todos os criterios de aceite foram verificados?
* Os fluxos principais foram testados manualmente quando aplicavel?
* Testes automatizados foram executados quando existirem?
* Nao foram adicionadas dependencias proibidas?
* Nao houve uso de codigo ou componentes oficiais do Excalidraw?
* Evidencias foram registradas?
* Riscos residuais foram documentados?

## Como o QA Agent deve validar uma story

1. Ler o task brief.
2. Ler os documentos relevantes em `docs/`.
3. Identificar fase do roadmap, objetivo e criterios de aceite.
4. Conferir o implementation report, se existir.
5. Validar arquivos alterados e escopo.
6. Executar verificacoes tecnicas disponiveis.
7. Executar fluxo manual quando houver UI.
8. Executar E2E com Playwright MCP quando a story exigir ou quando o ambiente disponibilizar a ferramenta para uma validacao relevante.
9. Registrar bugs, problemas de usabilidade e regressao possivel.
10. Emitir verdict: `Approved`, `Approved with notes` ou `Blocked`.

## Como registrar evidencias

Evidencias devem incluir:

* Story ou Task ID.
* Ambiente usado.
* Comandos executados.
* Resultado dos comandos.
* Fluxos testados.
* Prints ou videos quando UI existir. Formato e local: TBD.
* Evidencias de Playwright MCP quando E2E for executado.
* Arquivos alterados relevantes.
* Bugs encontrados.
* Verdict final.

Para execucoes auditaveis, usar `.agent/templates/qa-report.md` e salvar o relatorio em `.agent/runs/<run-id>/qa-report.md`.

## Pontos a definir

* Ferramenta de testes automatizados final.
* Padrao definitivo para uso de Playwright MCP em CI vs validacao local de agentes.
* Padrao de screenshots para evidencias.
* Matriz minima de navegadores.
* Criterios quantitativos de usabilidade.
* Como versionar relatorios de QA em execucoes longas.
