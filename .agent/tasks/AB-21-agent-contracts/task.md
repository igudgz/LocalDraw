# Task Brief

## Task ID

AB-21

## Titulo

Fase 16: Preparacao para agente

## Fase do roadmap

Fase 16

## Spec / TLC

* Feature: technical-doc
* Requisitos: REQ-015 a REQ-019

## Jira Tracking

* Epic key: AB-4
* Task key: AB-21

## Objetivo

Contratos TechnicalDocInput/Output, transformacao ParsedDiagram->contexto, prompt base versionado, fallback local sem IA.

## Escopo

* technicalDocTypes.ts — TechnicalDocInput, TechnicalDocOutput
* technicalDocContext.ts — buildTechnicalDocInput(parsed, options)
* technicalDocPrompt.ts ou prompts/technical-doc-v1.md — prompt versionado
* technicalDocService.ts — generateTechnicalDocLocal (fallback) + interface for future AI
* Wire panel to use local generator path
* Tests for contracts and fallback

## Fora de escopo

* Integracao LLM real (AB-22)
* Nova dependencia externa

## Criterios de aceite

* [ ] REQ-015 Contratos entrada/saida
* [ ] REQ-016 Transformacao contexto
* [ ] REQ-017 Prompt versionado
* [ ] REQ-018 Fallback local
* [ ] REQ-019 App funciona sem IA
