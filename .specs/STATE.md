# LocalDraw - STATE

Memoria persistente do projeto para o fluxo spec-driven (TLC) integrado a orquestracao PM-driven.

Este arquivo guarda dois blocos: o log de decisoes de arquitetura/produto e o snapshot de handoff entre sessoes/agentes.

Regras:

* O PM Agent e o dono deste arquivo. Outros agentes propoem entradas via relatorio; o PM Agent consolida.
* Decisoes recebem ID incremental `AD-NNN` e nunca sao apagadas, apenas marcadas como `Superseded by AD-XXX`.
* O handoff e sobrescrito a cada pausa/retomada para refletir o estado em voo.
* Nao inventar decisoes. Se algo nao foi decidido, nao registrar.

## Decisions (AD-NNN)

| ID | Data | Decisao | Contexto / Motivo | Status | Referencia |
|----|------|---------|-------------------|--------|------------|
| AD-001 | 2026-06-28 | Adotar TLC spec-driven como metodologia interna das fases, mantendo o modelo de papeis PM-driven como loop externo. | Capturar auto-sizing, rastreabilidade e Verifier independente sem descartar a orquestracao por papeis existente. | Active | `.agent/ORCHESTRATION.md` |
| AD-002 | 2026-06-28 | Spec artifacts vivem em `.specs/`; evidencia de execucao em batch continua em `.agent/runs/`. | Evitar estrutura duplicada e manter compatibilidade com os templates de relatorio existentes. | Active | `.agent/ORCHESTRATION.md` |
| AD-003 | 2026-06-28 | Commit atomico por task e disciplina obrigatoria, mas a execucao do commit segue a politica do repositorio (commit sob solicitacao humana). | Reconciliar TLC (1 commit por task) com a regra de so commitar quando solicitado. | Active | `.agent/roles/implementation-agent.md` |
| AD-004 | 2026-06-28 | Persistencia IndexedDB: DB `localdraw`, store `drawings`, autosave debounce 800ms, viewport sem showGrid no arquivo. | Gray areas AB-15; formato .localdraw congelado. | Active | `.specs/features/persistence/context.md` |

## Handoff

* In-flight feature: persistence (AB-15)
* Fase atual: Fase 10 — Persistencia local
* Proximo passo sugerido: Implementation Agent AB-15
* Bloqueios: Nenhum
* Decisoes pendentes de humano: Nenhuma
* Ultima atualizacao: 2026-06-28
* Batch: mvp-batch-004-persistence (Onda 1, Trilha B)
* Worktree: C:\Users\igor2\Documents\Playground\LocalDraw-persist
* Branch: feat/mvp-batch-004-persistence
