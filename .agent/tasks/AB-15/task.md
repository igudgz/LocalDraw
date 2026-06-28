# Task Brief

## Task ID

AB-15

## Titulo

Fase 10: Persistência local (IndexedDB)

## Fase do roadmap

Fase 10 — Persistência local

## Spec / TLC

* Feature: persistence
* Spec: `.specs/features/persistence/spec.md`
* Sizing: Large
* Requisitos cobertos: REQ-001 a REQ-007

## Jira Tracking

* Epic key: AB-4
* Task key: AB-15
* Board: Agents Board (AB)
* Current column: Ready for development

## Contexto

Implementar camada de persistência local com IndexedDB para salvar elementos, viewport e metadados do desenho atual, com autosave debounced e restauração após reload.

## Objetivo

Salvar desenhos localmente e reabri-los após recarregar a página.

## Escopo

* `src/shared/storage/indexedDb.ts`
* `src/features/persistence/localProjectRepository.ts`
* `src/features/persistence/localDrawSerializer.ts`
* Integração mínima em `Editor.tsx` (ou hook dedicado) para autosave e load inicial
* Testes unitários para serializer, repository e debounce
* Vitest como devDependency (autorizado neste batch para gate TLC)

## Fora de escopo

* UI de lista/organização de desenhos (AB-16)
* Import/export arquivo (AB-17)
* Alteração de `elementTypes.ts` ou formato `.localdraw`
* Pastas: tools/, history/, selection/, technical-doc/, parser

## Criterios de aceite

* [ ] (REQ-001) IndexedDB abre e persiste registros
* [ ] (REQ-002) Drawing persiste campos completos
* [ ] (REQ-003) Repository CRUD funcional
* [ ] (REQ-004) Serializer round-trip compatível com LocalDrawFile v1
* [ ] (REQ-005) Autosave debounced (não salva por frame)
* [ ] (REQ-006) Reload restaura desenho salvo
* [ ] (REQ-007) Integração mínima sem alterar tipos de elemento

## Arquivos esperados

* `src/shared/storage/indexedDb.ts`
* `src/features/persistence/localProjectRepository.ts`
* `src/features/persistence/localDrawSerializer.ts`
* `src/features/persistence/useDrawingPersistence.ts` (ou equivalente)
* Alterações em `src/features/editor/Editor.tsx`
* Testes em `src/features/persistence/*.test.ts`, `src/shared/storage/*.test.ts`
* `package.json` / `vite.config.ts` (vitest apenas)

## Riscos

* IndexedDB indisponível em alguns contextos — tratar erro graciosamente
* Race entre load inicial e autosave — garantir flag `hydrated`

## Verificacoes esperadas

* [ ] `npm run lint` passa
* [ ] `npm run build` passa
* [ ] `npm test` passa (após adicionar script)
* [ ] Jira AB-15 movido: Ready → In development → Review → Done

## Evidencia esperada

* `.agent/runs/AB-15/implementation-report.md`
* `.agent/runs/AB-15/review-report.md`
* `.agent/runs/AB-15/qa-report.md`
* `.agent/runs/AB-15/token-report.md`
