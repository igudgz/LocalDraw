# Agent Dispatch

## Target Agent

TBD

## Task ID

TBD

## Role

TBD

## Context

TBD

## Required Inputs

* TBD

## Jira Tracking

* Epic key: TBD
* Task key: TBD
* Board: TBD
* Current column: TBD
* Target column, if movement is authorized: TBD

## Objective

TBD

## Scope

* TBD

## Out of Scope

* TBD

## Acceptance Criteria

* [ ] TBD

## Spec references (TLC)

* Feature: TBD
* Spec: `.specs/features/<feature>/spec.md` (REQ IDs: TBD)
* Design/Tasks: TBD / Nao aplicavel (sizing)

## Constraints

* Follow `.agent/ORCHESTRATION.md`.
* Development agents (Implementation, and Review on code) follow the `coding-guidelines` skill: think before coding, simplicity first, surgical changes, goal-driven execution.
* Execute follows TLC: tests derive from the spec acceptance criteria, the gate (passing tests) decides completion, one atomic commit per task (commit execution under the repo policy of committing on request), and the Verifier always runs after the last task.
* Do not use `@excalidraw/excalidraw`.
* Do not use official Excalidraw code or components.
* Do not add ready-made whiteboard or visual editor libraries.
* Do not install dependencies unless explicitly approved.
* Do not implement features outside the roadmap without human approval.
* Do not delete Jira cards, Epics, boards, projects, comments, history, GitHub repositories or GitHub resources without explicit human approval naming the exact target.
* Shell rule: use `rtk <external-command>` for executables. For PowerShell cmdlets/functions/aliases/script blocks, use `rtk powershell -NoProfile -Command "<PowerShell command>"`.

## Expected Output

TBD

## Report Path

TBD

## Stop Conditions

* Required input is missing and cannot be inferred safely.
* Scope change is required.
* Product architecture change is required.
* `.localdraw` format change is required.
* A forbidden dependency or Excalidraw official artifact would be needed.
* Acceptance criteria are ambiguous enough to cause high-risk rework.
* A required Jira transition is unavailable.
* Deletion of a remote artifact would be required.
