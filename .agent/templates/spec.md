# Spec - <feature>

Fase TLC: Specify (sempre obrigatoria). Local: `.specs/features/<feature>/spec.md`.

## Feature ID

TBD

## Fase do roadmap

TBD

## Scope sizing

Escolher um (define a profundidade do fluxo):

* `Small` (<=3 arquivos, uma frase): Design e Tasks pulados, Execute inline.
* `Medium` (feature clara, <10 tasks): Design inline, Tasks implicitas.
* `Large` (multi-componente): spec completa + Design + Tasks.
* `Complex` (ambiguidade, dominio novo): spec completa + discuss + Design + Tasks + UAT.

Sizing escolhido: TBD
Justificativa: TBD

## Contexto

TBD

## Objetivo

TBD

## Requisitos (IDs rastreaveis)

Cada requisito recebe um ID `REQ-NNN` usado em design, tasks, testes e validation.

| ID | Requisito | Criterio de aceite verificavel |
|----|-----------|--------------------------------|
| REQ-001 | TBD | TBD |

## Fora de escopo

* TBD

## Gray areas / discuss

Preencher apenas quando o sizing for `Complex` ou houver dimensao implicita (persistencia/estado, chamadas externas, auth, concorrencia, transicoes de estado). Decisoes detalhadas vao para `context.md`.

* TBD

## Restricoes do projeto

* Nao usar `@excalidraw/excalidraw`, codigo ou componentes oficiais do Excalidraw.
* Nao adicionar biblioteca pronta de whiteboard/editor visual.
* Manter SVG-first no MVP.
* Nao tornar IA dependencia obrigatoria do MVP.

## Referencias

* `docs/PRODUCT_SPEC.md`, `docs/TECHNICAL_DOC.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/QA_STRATEGY.md`
* Jira: TBD
