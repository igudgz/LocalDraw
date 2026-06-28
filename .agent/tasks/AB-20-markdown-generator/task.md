# Task Brief

## Task ID

AB-20

## Titulo

Fase 15: Technical Doc sem IA

## Fase do roadmap

Fase 15

## Spec / TLC

* Feature: technical-doc
* Spec: `.specs/features/technical-doc/spec.md`
* Sizing: Medium
* Requisitos cobertos: REQ-010 a REQ-014

## Jira Tracking

* Epic key: AB-4
* Task key: AB-20
* Current column: Ready for development

## Objetivo

Implementar `markdownGenerator.ts`, preview Markdown no painel, copiar e baixar `.md`.

## Escopo

* `markdownGenerator.ts` — gera Markdown de ParsedDiagram
* `TechnicalDocPanel.tsx` — tabs ou secoes JSON + Markdown preview, copy/download
* `markdownGenerator.test.ts` — testes REQ-010 a REQ-014

## Fora de escopo

* Contratos agente (AB-21)
* Integracao LLM (AB-22)

## Criterios de aceite

* [ ] (REQ-010) Generator produz Markdown estruturado
* [ ] (REQ-011) Secoes corretas no output
* [ ] (REQ-012) Preview no painel apos Analyze
* [ ] (REQ-013) Copiar e baixar .md
* [ ] (REQ-014) Offline, sem chamadas externas

## Evidencia

* `.agent/runs/AB-20/*`
