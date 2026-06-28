# Jira Task Template

## Summary

TBD

## Parent Epic

TBD

## Roadmap Phase

TBD

## Description

## Context

TBD

## Objective

TBD

## Scope

* TBD

## Out of Scope

* TBD

## Acceptance Criteria

* [ ] TBD

## Expected Agent Flow

1. PM Agent keeps task in `Ready for development`.
2. Implementation Agent moves task to `in development` when work starts.
3. Review Agent moves task to `review` when implementation is ready for review.
4. QA Agent or PM Agent moves task to `done` when gates pass.

## Checks

* [ ] Build passes, if it exists.
* [ ] Lint passes, if it exists.
* [ ] Tests pass, if they exist.
* [ ] Review Agent did not mark `Critical`.
* [ ] QA Agent did not block.
* [ ] Metrics Agent generated report.

## Constraints

* Do not use `@excalidraw/excalidraw`.
* Do not use official Excalidraw code or components.
* Do not add ready-made whiteboard or visual editor libraries.
* Do not install dependencies without approval.
* Do not implement features outside the roadmap without human approval.
* Do not delete this task without explicit human approval citing the task key.

## References

* `docs/PRODUCT_SPEC.md`
* `docs/TECHNICAL_DOC.md`
* `docs/ARCHITECTURE.md`
* `docs/ROADMAP.md`
* `docs/QA_STRATEGY.md`
* `.agent/ORCHESTRATION.md`
