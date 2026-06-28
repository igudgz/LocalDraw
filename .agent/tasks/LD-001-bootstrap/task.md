# Task Brief

## Task ID

LD-001-bootstrap

## Titulo

Bootstrap React + Vite + TypeScript e layout base

## Fase do roadmap

Fase 0: Bootstrap do projeto

## Jira Tracking

* Epic key: AB-4
* Task key: AB-5
* Board: Nao informado
* Current column: Ready for development

## Contexto

O repositório ainda contém apenas documentação. Esta task inicia a base técnica do LocalDraw com React, Vite e TypeScript, mantendo as restrições permanentes do produto e preparando a estrutura para as fases seguintes.

Referencias principais:

* `ROADMAP.md`
* `docs/PRODUCT_SPEC.md`
* `docs/TECHNICAL_DOC.md`
* `docs/ARCHITECTURE.md`
* `docs/ROADMAP.md`
* `docs/QA_STRATEGY.md`

## Objetivo

Criar a aplicação inicial com layout de editor contendo sidebar esquerda, toolbar superior, área central de desenho e painel direito, além de estrutura inicial de pastas e estado inicial serializável do editor.

## Escopo

* Criar configuração mínima de Vite, React e TypeScript.
* Criar `package.json` com scripts esperados para desenvolvimento, build e lint quando aplicável.
* Criar layout inicial com sidebar esquerda, toolbar superior, área central do editor e painel direito.
* Criar estrutura inicial de pastas alinhada a `docs/ARCHITECTURE.md`.
* Criar estado inicial do editor com elementos vazios, ferramenta ativa e viewport inicial.
* Atualizar documentação operacional mínima, se necessário, para refletir como executar a aplicação.

## Fora de escopo

* Desenhar formas.
* Implementar zoom e pan funcionais.
* Implementar persistência.
* Implementar exportação.
* Implementar IA.
* Implementar parser de diagrama.
* Adicionar bibliotecas prontas de whiteboard/editor visual.

## Referencias

* Documento/fase: `docs/ROADMAP.md` - Fase 0.
* Jira/Issue: Epic `AB-4`, Task `AB-5`.
* Design: layout base descrito no roadmap.
* Discussao: solicitacao humana deste batch.

## Criterios de aceite

* [ ] `npm install` funciona.
* [ ] `npm run dev` sobe a aplicacao.
* [ ] A tela possui sidebar esquerda.
* [ ] A tela possui area central de desenho.
* [ ] A tela possui painel direito.
* [ ] A tela possui toolbar superior.
* [ ] O projeto nao usa `@excalidraw/excalidraw`.
* [ ] O projeto nao usa componentes oficiais do Excalidraw.
* [ ] O projeto nao usa bibliotecas prontas de whiteboard/editor visual.

## Arquivos esperados

* `package.json`
* `index.html`
* `tsconfig.json`
* `tsconfig.node.json` ou equivalente
* `vite.config.ts`
* `src/main.tsx`
* `src/app/App.tsx`
* `src/app/app.css`
* `src/features/editor/*`
* `src/features/elements/*`
* `src/features/tools/*`
* `src/features/selection/*`
* `src/features/history/*`
* `src/features/persistence/*`
* `src/features/projects/*`
* `src/features/export/*`
* `src/features/technical-doc/*`
* `src/shared/*`
* `README.md`, se precisar atualizar instrucoes de execucao

## Riscos

* Instalação de dependências exige rede; registrar se não for possível verificar `npm install`.
* Bootstrap pode crescer para fases futuras se ferramentas forem implementadas antes do roadmap.
* Layout deve ser funcional sem introduzir bibliotecas de editor visual.

## Verificacoes esperadas

* [ ] Verificar que a tarefa respeita o roadmap.
* [ ] Verificar que nenhum item fora de escopo foi implementado.
* [ ] Verificar que nenhuma dependencia proibida foi adicionada.
* [ ] Verificar que `@excalidraw/excalidraw` nao foi usado.
* [ ] Verificar que componentes oficiais do Excalidraw nao foram usados.
* [ ] Verificar que bibliotecas prontas de whiteboard/editor visual nao foram adicionadas.
* [ ] Executar `npm install`, se a rede estiver disponível e sem instalar dependências proibidas.
* [ ] Executar `npm run build`, se scripts e dependências estiverem disponíveis.
* [ ] Executar `npm run lint`, se existir.
* [ ] Executar E2E com Playwright MCP quando a ferramenta estiver disponivel; caso contrário registrar `Nao disponivel`.

## Evidencia esperada

* Arquivos criados/alterados.
* Comandos executados.
* Resultado das verificacoes.
* Evidencia de que o layout possui as quatro regiões.
* Evidencias de Playwright MCP, se E2E for executado.
* Pontos `TBD` ou `A definir` restantes.

## Observacoes

Shell rule: use `rtk <external-command>` for executables. For PowerShell cmdlets/functions/aliases/script blocks, use `rtk powershell -NoProfile -Command "<PowerShell command>"`.

Nao implementar escopo de fases futuras sem aprovacao humana.
