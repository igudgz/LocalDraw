# Technical Doc Feature Spec

## Feature

technical-doc

## Sizing

Large — multi-componente (parser, generator, panel UI, agent contracts), com dependências sequenciais entre fases 14–16.

## Objective

Implementar parser de diagrama, geração de Technical Doc em Markdown sem IA, e contratos para integração futura com agente/LLM, conforme fases 14–16 do roadmap.

## Requirements

### Fase 14 — Parser (AB-19)

- **REQ-001**: O parser deve ler `LocalDrawElement[]` do estado do editor sem alterar tipos em `elementTypes.ts`.
- **REQ-002**: Retângulos devem ser classificados como componentes tipo `service` (convenção roadmap).
- **REQ-003**: Elipses devem ser classificadas como `external` ou `actor` (heurística conservadora; incerteza → `unknown`).
- **REQ-004**: Setas devem gerar entradas em `relationships` com label quando presente.
- **REQ-005**: Elementos `text` isolados devem aparecer em `notes`.
- **REQ-006**: Texto embutido em formas deve ser associado ao componente correspondente.
- **REQ-007**: Relações incertas (seta sem binding claro) devem gerar entradas em `openQuestions`.
- **REQ-008**: O parser não deve inventar informação — apenas dados observáveis nos elementos.
- **REQ-009**: Botão "Analyze Diagram" no painel direito dispara parse e exibe JSON estruturado.

### Fase 15 — Markdown sem IA (AB-20)

- **REQ-010**: `markdownGenerator.ts` gera Markdown a partir de `ParsedDiagram`.
- **REQ-011**: Estrutura: Contexto, Componentes identificados, Fluxo principal, Integrações, Decisões assumidas, Riscos e limitações, Perguntas em aberto.
- **REQ-012**: Preview Markdown no painel direito após análise.
- **REQ-013**: Botões copiar e baixar `.md`.
- **REQ-014**: Geração funciona offline (sem chamadas externas).

### Fase 16 — Contratos agente (AB-21)

- **REQ-015**: Tipos `TechnicalDocInput` e `TechnicalDocOutput` definidos.
- **REQ-016**: Função transforma `ParsedDiagram` + opções em contexto para agente.
- **REQ-017**: Prompt base versionado no repositório.
- **REQ-018**: Fallback local (`generateTechnicalDocLocal`) usa generator sem IA.
- **REQ-019**: App continua funcional sem IA; fallback disponível.

### Fase 17 — Integração LLM (AB-22) — BLOQUEADA

- **REQ-020**: Pendente decisão humana sobre provider/dependência/chaves.

## Out of Scope

- Ferramentas de desenho, persistência, import/export, resize, estilos, undo/redo, atalhos.
- Alteração de tipos em `elementTypes.ts`.
- Fase 18 / AB-23 (Skill Codex).
- Integração LLM real (AB-22) até aprovação humana.

## References

- `ROADMAP.md` fases 14–16
- `docs/QA_STRATEGY.md`
- Epic AB-4
