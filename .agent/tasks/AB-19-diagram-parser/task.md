# Task Brief

## Task ID

AB-19

## Titulo

Fase 14: Parser inicial do diagrama

## Fase do roadmap

Fase 14

## Spec / TLC

* Feature: technical-doc
* Spec: `.specs/features/technical-doc/spec.md`
* Sizing: Large (primeira task do batch)
* Requisitos cobertos (REQ-NNN): REQ-001 a REQ-009

## Jira Tracking

* Epic key: AB-4
* Task key: AB-19
* Board: Agents Board (AB)
* Current column: Ready for development

## Contexto

Implementar parser estruturado do desenho sem IA. O painel direito (`TechnicalDocPanel`) deve permitir analisar elementos do canvas e exibir `ParsedDiagram` como JSON.

## Objetivo

Criar `diagramParser.ts`, tipos completos em `technicalDocTypes.ts`, integrar botão Analyze no painel, e compartilhar elementos do editor com o painel (context mínimo ou lift state — sem alterar `elementTypes.ts`).

## Escopo

* `src/features/technical-doc/technicalDocTypes.ts` — tipos ParsedDiagram completos
* `src/features/technical-doc/diagramParser.ts` — lógica de parse
* `src/features/technical-doc/TechnicalDocPanel.tsx` — UI Analyze + JSON preview
* Compartilhamento de `elements` do editor (ex.: `EditorContext` mínimo em `src/features/editor/`)
* Testes unitários do parser (vitest ou runner existente)
* Estilos mínimos se necessário em `app.css` (somente painel)

## Fora de escopo

* markdownGenerator (AB-20)
* Contratos agente (AB-21)
* Alterar `elementTypes.ts`
* Ferramentas de desenho, persistência, etc.

## Criterios de aceite

* [ ] (REQ-001) Parser lê LocalDrawElement[] sem alterar elementTypes
* [ ] (REQ-002–006) Formas, textos, setas mapeados corretamente
* [ ] (REQ-007) Relações incertas em openQuestions
* [ ] (REQ-008) Parser não inventa dados
* [ ] (REQ-009) Botão Analyze Diagram + JSON no painel direito

## Arquivos esperados

* `src/features/technical-doc/diagramParser.ts`
* `src/features/technical-doc/technicalDocTypes.ts`
* `src/features/technical-doc/TechnicalDocPanel.tsx`
* `src/features/technical-doc/diagramParser.test.ts`
* `src/features/editor/EditorContext.tsx` (ou equivalente mínimo)
* Ajustes em `App.tsx` / `Editor.tsx` para contexto

## Riscos

* Estado do editor isolado em Editor — requer lift/context mínimo
* Sem test runner — pode precisar vitest como devDependency

## Verificacoes esperadas

* [ ] `npm run lint` passa
* [ ] `npm run build` passa
* [ ] Testes do parser passam
* [ ] Nenhuma dependência proibida

## Evidencia esperada

* `.agent/runs/AB-19/implementation-report.md`
* `.agent/runs/AB-19/review-report.md`
* `.agent/runs/AB-19/qa-report.md`
* `.agent/runs/AB-19/token-report.md`
