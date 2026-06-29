# LocalDraw - STATE

Memoria persistente do projeto para o fluxo spec-driven (TLC) integrado a orquestracao PM-driven.

## Decisions (AD-NNN)

| ID | Data | Decisao | Contexto / Motivo | Status | Referencia |
|----|------|---------|-------------------|--------|------------|
| AD-001 | 2026-06-28 | Adotar TLC spec-driven como metodologia interna das fases, mantendo o modelo de papeis PM-driven como loop externo. | Capturar auto-sizing, rastreabilidade e Verifier independente sem descartar a orquestracao por papeis existente. | Active | `.agent/ORCHESTRATION.md` |
| AD-002 | 2026-06-28 | Spec artifacts vivem em `.specs/`; evidencia de execucao em batch continua em `.agent/runs/`. | Evitar estrutura duplicada e manter compatibilidade com os templates de relatorio existentes. | Active | `.agent/ORCHESTRATION.md` |
| AD-003 | 2026-06-28 | Commit atomico por task e disciplina obrigatoria, mas a execucao do commit segue a politica do repositorio (commit sob solicitacao humana). | Reconciliar TLC (1 commit por task) com a regra de so commitar quando solicitado. | Active | `.agent/roles/implementation-agent.md` |
| AD-004 | 2026-06-28 | Persistencia IndexedDB: DB `localdraw`, store `drawings`, autosave debounce 800ms, viewport sem showGrid no arquivo. | Gray areas AB-15; formato .localdraw congelado. | Active | `.specs/features/persistence/context.md` |

## Handoff

* In-flight feature: merge batch 004 (persistence) + batch 005 (techdoc) em `feat/mvp-batch-004-persistence`
* Fase atual: Fase 12 (persistencia/export) + Fase 16 (technical doc) integradas via `EditorContext`
* Proximo passo sugerido: AB-22 (Fase 17) — aguardando decisao humana sobre provider LLM; ou Fase 13 atalhos
* Bloqueios: AB-22 parada obrigatoria (servico externo/dependencia nova)
* Decisoes pendentes de humano: Provider LLM, dependencia npm, gestao de chaves; E2E manual batch 004
* Ultima atualizacao: 2026-06-28
* Batch concluido: mvp-batch-004-persistence (AB-15, AB-16, AB-17); main inclui mvp-batch-005-techdoc (AB-19–21)
