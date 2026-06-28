# LocalDraw - STATE

Memoria persistente do projeto para o fluxo spec-driven (TLC) integrado a orquestracao PM-driven.

## Decisions (AD-NNN)

| ID | Data | Decisao | Contexto / Motivo | Status | Referencia |
|----|------|---------|-------------------|--------|------------|
| AD-001 | 2026-06-28 | Adotar TLC spec-driven como metodologia interna das fases, mantendo o modelo de papeis PM-driven como loop externo. | Capturar auto-sizing, rastreabilidade e Verifier independente sem descartar a orquestracao por papeis existente. | Active | `.agent/ORCHESTRATION.md` |
| AD-002 | 2026-06-28 | Spec artifacts vivem em `.specs/`; evidencia de execucao em batch continua em `.agent/runs/`. | Evitar estrutura duplicada e manter compatibilidade com os templates de relatorio existentes. | Active | `.agent/ORCHESTRATION.md` |
| AD-003 | 2026-06-28 | Commit atomico por task e disciplina obrigatoria, mas a execucao do commit segue a politica do repositorio (commit sob solicitacao humana). | Reconciliar TLC (1 commit por task) com a regra de so commitar quando solicitado. | Active | `.agent/roles/implementation-agent.md` |

## Handoff

* In-flight feature: Nenhuma (batch 003 concluido)
* Fase atual: Fases 4–6 concluidas (elipse, texto, seta)
* Proximo passo sugerido: Fase 7 — Resize e edicao basica
* Bloqueios: Jira card transitions nao executadas (MCP CallMcpTool indisponivel nesta sessao)
* Decisoes pendentes de humano: Nenhuma
* Ultima atualizacao: 2026-06-28
* Branch: `feat/mvp-batch-003-tools`
* Commits: b787ed5 (AB-9), 2897f50 (AB-10), 2c1da8e (AB-11)
