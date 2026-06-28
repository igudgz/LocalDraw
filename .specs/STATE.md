# LocalDraw - STATE

Memoria persistente do projeto para o fluxo spec-driven (TLC) integrado a orquestracao PM-driven.

## Decisions (AD-NNN)

| ID | Data | Decisao | Contexto / Motivo | Status | Referencia |
|----|------|---------|-------------------|--------|------------|
| AD-001 | 2026-06-28 | Adotar TLC spec-driven como metodologia interna das fases, mantendo o modelo de papeis PM-driven como loop externo. | Capturar auto-sizing, rastreabilidade e Verifier independente sem descartar a orquestracao por papeis existente. | Active | `.agent/ORCHESTRATION.md` |
| AD-002 | 2026-06-28 | Spec artifacts vivem em `.specs/`; evidencia de execucao em batch continua em `.agent/runs/`. | Evitar estrutura duplicada e manter compatibilidade com os templates de relatorio existentes. | Active | `.agent/ORCHESTRATION.md` |
| AD-003 | 2026-06-28 | Commit atomico por task e disciplina obrigatoria, mas a execucao do commit segue a politica do repositorio (commit sob solicitacao humana). | Reconciliar TLC (1 commit por task) com a regra de so commitar quando solicitado. | Active | `.agent/roles/implementation-agent.md` |

## Handoff

* In-flight feature: technical-doc (batch mvp-batch-005-techdoc)
* Fase atual: 16 concluida (AB-19, AB-20, AB-21 done); main inclui batch 003 (fases 4–6: elipse, texto, seta)
* Proximo passo sugerido: AB-22 (Fase 17) — aguardando decisao humana sobre provider LLM, dependencia e chaves API
* Bloqueios: AB-22 parada obrigatoria (servico externo/dependencia nova)
* Decisoes pendentes de humano: Provider LLM (OpenAI/Anthropic/local), dependencia npm, gestao de chaves, backend proxy vs client-side
* Ultima atualizacao: 2026-06-28
* Branch: `feat/mvp-batch-005-techdoc`
