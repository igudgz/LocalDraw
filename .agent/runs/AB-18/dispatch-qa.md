# Agent Dispatch — QA Agent

## Target Agent

QA Agent

## Task ID

AB-18

## Role

Validar critérios de aceite, regressão, E2E smoke de atalhos.

## Context

Pós Review Agent. Dev server porta 5176.

## Required Inputs

* implementation-report, review-report
* `.specs/features/keyboard-shortcuts/spec.md`
* `docs/QA_STRATEGY.md`

## Jira Tracking

* Task key: AB-18

## Objective

Confirmar REQ-001–REQ-008 via testes + E2E Playwright MCP.

## Acceptance Criteria

* [x] npm test verde
* [x] E2E smoke atalhos documentado
* [x] Sem bloqueio Needs Changes

## Expected Output

`qa-report.md`, evidência E2E em `e2e-evidence.md`

## Report Path

`.agent/runs/AB-18/qa-report.md`
