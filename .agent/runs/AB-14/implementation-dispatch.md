# Agent Dispatch

## Target Agent

Implementation Agent

## Task ID

AB-14

## Role

Implementation Agent (`.agent/roles/implementation-agent.md`)

## Context

Worktree: `C:\Users\igor2\Documents\Playground\LocalDraw-history`
Branch: `feat/mvp-batch-007-history`
Batch: Undo e redo (Fase 9)

O `editorState` ja possui `history.past`/`history.future`. `historyReducer.ts` so tem `createEmptyHistory`. `editorReducer.ts` nao tem UNDO/REDO nem push wrapper.

## Required Inputs

* `.agent/runs/AB-14/task.md`
* `.specs/features/undo-redo/spec.md`
* `.agent/ORCHESTRATION.md`
* `.agent/roles/implementation-agent.md`

## Jira Tracking

* Epic key: AB-4
* Task key: AB-14
* Board: AB board (projeto AB)
* Current column: Ready for development
* Target column, if movement is authorized: in development (ao iniciar)

## Objective

Implementar undo/redo completo conforme spec REQ-001 a REQ-008.

## Scope

* historyReducer push/pop/clear (limite 50 snapshots de elements)
* undoableActions.ts com lista explicita
* editorActions undo/redo
* editorReducer wrapper + cases
* Atalhos Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y
* Testes unitarios

## Out of Scope

* Delete, copy/paste, tool shortcuts (AB-18)
* features/persistence, technical-doc, tools, projects, export

## Acceptance Criteria

* [ ] REQ-001 a REQ-008 da spec atendidos
* [ ] `npm run build` passa
* [ ] `npm test` passa

## Spec references (TLC)

* Feature: undo-redo
* Spec: `.specs/features/undo-redo/spec.md` (REQ IDs: REQ-001 a REQ-008)
* Design/Tasks: Nao aplicavel (sizing Medium)

## Constraints

* Follow `.agent/ORCHESTRATION.md`.
* coding-guidelines skill.
* No new dependencies.
* No Excalidraw.
* Shell: `rtk <external-command>`.

## Expected Output

* Codigo implementado
* `.agent/runs/AB-14/implementation-report.md`

## Report Path

`.agent/runs/AB-14/implementation-report.md`

## Stop Conditions

* Scope change required
* Architecture change required
* Missing Jira transition
