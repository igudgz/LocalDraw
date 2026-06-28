# LocalDraw

LocalDraw is a local-first diagram editor planned from scratch, inspired by the Excalidraw experience but independent from Excalidraw code, packages, and official components.

## Current Status

This repository contains product, architecture, roadmap, QA, agent orchestration documentation, and the initial React/Vite/TypeScript bootstrap.

The current application scope is limited to the Phase 0 base layout and initial serializable editor state.

## Running Locally

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build the application:

```sh
npm run build
```

## Core Constraints

* Do not use `@excalidraw/excalidraw`.
* Do not use official Excalidraw code.
* Do not use official Excalidraw components.
* Do not use ready-made whiteboard or visual editor libraries.
* Do not implement AI before the planned phase.
* Do not implement features outside the roadmap without human approval.

## Planning

The project is tracked in Jira under Epic `AB-4` (`LocalDraw - MVP`).

Initial recommended batch:

* `AB-5`: Fase 0: Bootstrap do projeto
* `AB-6`: Fase 1: Viewport do editor

## Documentation

* `docs/PRODUCT_SPEC.md`
* `docs/TECHNICAL_DOC.md`
* `docs/ARCHITECTURE.md`
* `docs/ROADMAP.md`
* `docs/QA_STRATEGY.md`
* `.agent/ORCHESTRATION.md`
