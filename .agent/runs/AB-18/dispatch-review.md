# Agent Dispatch — Review Agent

## Target Agent

Review Agent

## Task ID

AB-18

## Role

Revisar implementação de atalhos: escopo, código, testes, dependências.

## Context

Pós Implementation Agent. Diff em `src/features/editor/` e `undoableActions.ts`.

## Required Inputs

* `.agent/runs/AB-18/implementation-report.md`
* `.specs/features/keyboard-shortcuts/spec.md`
* Diff do commit AB-18

## Jira Tracking

* Task key: AB-18
* Target column: review (transition 2)

## Objective

Verificar aderência à spec, ausência de Critical, padrões do projeto.

## Acceptance Criteria

* [x] Sem findings Critical
* [x] Escopo respeitado

## Expected Output

`review-report.md`

## Report Path

`.agent/runs/AB-18/review-report.md`
