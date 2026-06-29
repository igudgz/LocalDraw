# Agent Dispatch — Implementation Agent

## Target Agent

Implementation Agent

## Task ID

AB-18

## Role

Implementar atalhos de teclado globais conforme spec.

## Context

Batch mvp-batch-008-shortcuts. Base inclui AB-14 undo/redo. Worktree `LocalDraw-shortcuts`, branch `feat/mvp-batch-008-shortcuts`.

## Required Inputs

* `.specs/features/keyboard-shortcuts/spec.md`
* `.agent/runs/AB-18/task.md`
* `ROADMAP.md` Fase 13

## Jira Tracking

* Epic key: AB-4
* Task key: AB-18
* Board: Agents Board
* Current column: Ready for development
* Target column: in development (transition 21)

## Objective

Implementar handler global de teclado, action delete-element, estado copiedElement, integração inlineEditActive.

## Scope

* REQ-001 a REQ-008 da spec

## Out of Scope

* persistence, export, projects, technical-doc, reimplementar undo/redo

## Acceptance Criteria

* [x] Todos REQ-001–REQ-008 implementados
* [x] Testes unitários em keyboardShortcuts.test.ts e editorReducer.test.ts

## Spec references (TLC)

* Feature: keyboard-shortcuts
* Spec: `.specs/features/keyboard-shortcuts/spec.md`
* Design/Tasks: Nao aplicavel (Medium)

## Expected Output

`implementation-report.md` em `.agent/runs/AB-18/`

## Report Path

`.agent/runs/AB-18/implementation-report.md`

## Stop Conditions

Escopo, arquitetura ou dependência proibida.
