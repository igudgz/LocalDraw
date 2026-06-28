# Validation (Verifier) - <feature>

Fase TLC: Verifier (sempre obrigatoria, nunca opcional, nunca pedida por prompt). Local: `.specs/features/<feature>/validation.md`.

Principio: autor != verificador. O Verifier (Review Agent + QA Agent) re-deriva a cobertura de forma independente usando `evidence-or-zero`: o que nao tem evidencia conta como zero. O Verifier nao herda o modelo mental de quem implementou.

## Feature ID

TBD

## Verifier

* Review Agent: TBD
* QA Agent: TBD
* Confirmacao autor != verificador: TBD

## Spec-anchored outcome check

Para cada criterio de aceite, confirmar que o valor afirmado pelo teste corresponde ao resultado definido na spec. Sinalizar gaps de precisao da spec.

| REQ | Criterio | Resultado esperado (spec) | Resultado verificado | Evidencia | Status |
|-----|----------|---------------------------|----------------------|-----------|--------|
| REQ-00X | TBD | TBD | TBD | TBD | Pass/Fail |

## Discrimination sensor (mutation)

Injetar falhas de comportamento em estado de rascunho e confirmar que os testes as matam. Mutantes sobreviventes viram fix tasks. Descartar as mutacoes apos o teste.

* Status: Executado / Nao executado / Nao aplicavel
* Mutantes injetados: TBD
* Mutantes mortos: TBD
* Mutantes sobreviventes (viram fix tasks): TBD

Quando a ferramenta/tempo nao permitir mutation testing, registrar `Nao executado` com justificativa em vez de inventar.

## Diff range verificado

* TBD

## Verdict

* PASS / FAIL: TBD
* Gaps ranqueados (viram fix tasks; loop fix -> re-verify limitado a 3 iteracoes): TBD

## Licoes distiladas

Cada falha fundamentada vira licao em `.specs/LESSONS.md`. PASS limpo nao registra nada.

* TBD / Nenhuma
