# Tasks - <feature>

Fase TLC: Tasks (opcional; apenas para sizing `Large` ou `Complex`). Local: `.specs/features/<feature>/tasks.md`.

Pular quando houver <=3 passos obvios (viram passos inline no Execute). Safety valve: se a listagem inline do Execute revelar >5 passos ou dependencias complexas, criar este arquivo.

## Feature ID

TBD

## Regras de execucao (nao negociaveis)

* Testes derivam dos criterios de aceite da spec e afirmam o resultado definido na spec; nunca espelham a implementacao.
* O gate deve passar (testes verdes) antes de uma task ser dada como concluida; quem decide e o test runner, nao auto-avaliacao.
* Um commit atomico por task (execucao do commit sob a politica do repositorio). Nunca agrupar tasks; nunca enfraquecer, pular ou apagar testes para passar.
* Apos a ultima task, o Verifier (Review + QA) roda sempre, com autor diferente do verificador.

## Tasks atomicas

| Task ID | Descricao | REQ | Verificacao (gate) | Depende de | Status |
|---------|-----------|-----|--------------------|------------|--------|
| T-001 | TBD | REQ-00X | TBD | - | pending |

## Plano de paralelizacao

* Sequencial por padrao. Marcar tasks paralelizaveis apenas quando nao houver dependencia de arquivo/estado.
* TBD

## Cobertura de testes (matriz)

| REQ | Teste | Tipo | Local |
|-----|-------|------|-------|
| REQ-00X | TBD | unit/integration/e2e | TBD |
