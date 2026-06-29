# Validation (Verifier) - undo-redo

Fase TLC: Verifier (sempre obrigatoria, nunca opcional, nunca pedida por prompt). Local: `.specs/features/undo-redo/validation.md`.

Principio: autor != verificador. O Verifier (Review Agent + QA Agent) re-deriva a cobertura de forma independente usando `evidence-or-zero`: o que nao tem evidencia conta como zero. O Verifier nao herda o modelo mental de quem implementou.

## Feature ID

undo-redo

## Verifier

* Review Agent: Nao presente nesta execucao (`review-report.md` ausente)
* QA Agent: QA Agent (execucao independente AB-14)
* Confirmacao autor != verificador: Sim — QA re-executou `npm test` e `npm run build` e inspecionou codigo sem depender apenas do implementation-report

## Spec-anchored outcome check

Para cada criterio de aceite, confirmar que o valor afirmado pelo teste corresponde ao resultado definido na spec. Sinalizar gaps de precisao da spec.

| REQ | Criterio | Resultado esperado (spec) | Resultado verificado | Evidencia | Status |
|-----|----------|---------------------------|----------------------|-----------|--------|
| REQ-001 | History push/pop/clear | push snapshot (limite 50), pop past/future, clear future ao push; snapshots so `elements` | Implementado e testado | `historyReducer.ts` (`pushSnapshot`, `popPast`, `popFuture`, `MAX_HISTORY=50`); `EditorStateSnapshot = LocalDrawElement[]`; 7 testes `historyReducer.test.ts` | Pass |
| REQ-002 | Actions UNDO e REDO | `{ type: "undo" }` e `{ type: "redo" }` em editorActions | Presentes | `editorActions.ts` L77–82 | Pass |
| REQ-003 | Reducer undo/redo | Restaura `elements`; selecao/viewport/tool fora do snapshot | Restaura apenas elements; selecao inalterada no undo de move | `editorReducer.ts` L215–243; teste L235–252 `editorReducer.test.ts` | Pass |
| REQ-004 | Undoable mutations | 6 tipos mutantes empilham snapshot antes da mutation | Wrapper generico + lista explicita; testes undo para add/update/style | `undoableActions.ts` L14–21; `editorReducer.ts` L246–255; testes L217–296 `editorReducer.test.ts` | Pass |
| REQ-005 | Convencao extensivel | `UNDOABLE_ACTION_TYPES` documentada; nao listados nao empilham | Lista + comentario de convencao; `isUndoableAction` gate no reducer | `undoableActions.ts` L3–13, L27–31 | Pass |
| REQ-006 | Atalhos de teclado | Ctrl/Cmd+Z undo; Ctrl/Cmd+Shift+Z e Ctrl/Cmd+Y redo; skip em input/textarea/contenteditable | Hook implementa teclas e guard; montado no Editor | `useEditorKeyboardShortcuts.ts`; `Editor.tsx` L15; sem teste automatizado do hook | Pass |
| REQ-007 | Limite de historico | `past` nunca excede 50 | Trim no push; testes history + editor | `historyReducer.ts` L23–24; testes L53–65 `historyReducer.test.ts`, L298–315 `editorReducer.test.ts` | Pass |
| REQ-008 | restore-drawing limpa historico | past/future zerados | Case restore-drawing + teste de regressao | `editorReducer.ts` L181–184; teste L46–79 `editorReducer.test.ts` | Pass |

**Gaps de precisao / cobertura (nao bloqueantes):**

* REQ-004: undo dedicado ausente para `resize-element`, `update-element-label`, `update-element-text` — mecanismo generico cobre; risco residual baixo.
* REQ-006: atalhos validados por inspecao de codigo, nao por teste ou UAT browser.

## Discrimination sensor (mutation)

Injetar falhas de comportamento em estado de rascunho e confirmar que os testes as matam. Mutantes sobreviventes viram fix tasks. Descartar as mutacoes apos o teste.

* Status: **Nao executado**
* Justificativa: Nenhuma ferramenta de mutation testing configurada no projeto; escopo QA limitado a re-execucao de suite existente e inspecao independente. Nao inventar resultados de mutantes.
* Mutantes injetados: 0
* Mutantes mortos: 0
* Mutantes sobreviventes (viram fix tasks): N/A

## Diff range verificado

* Worktree: `C:\Users\igor2\Documents\Playground\LocalDraw-history`
* Branch: `feat/mvp-batch-007-history`
* Base commit: `5cace98`
* Escopo AB-14 (uncommitted):
  * Modificados: `Editor.tsx`, `editorActions.ts`, `editorReducer.ts`, `editorReducer.test.ts`, `editorTypes.ts`, `historyReducer.ts`
  * Criados: `useEditorKeyboardShortcuts.ts`, `historyReducer.test.ts`, `undoableActions.ts`
* Fora de escopo confirmado: `features/persistence`, `features/export`, `features/tools`, `features/projects` — nao alterados

## Verdict

* **PASS**
* Gaps ranqueados (follow-up, nao bloqueiam PASS):
  1. Testes unitarios para `useEditorKeyboardShortcuts` (REQ-006)
  2. Testes undo para resize/label/text (REQ-004 cobertura dedicada)
  3. Validacao manual browser dos atalhos
  4. Mutation sensor quando ferramenta estiver disponivel

## Licoes distiladas

Cada falha fundamentada vira licao em `.specs/LESSONS.md`. PASS limpo nao registra nada.

* Nenhuma
