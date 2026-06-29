# Task Brief

## Task ID

AB-16

## Titulo

Fase 11: Organização de desenhos

## Fase do roadmap

Fase 11

## Spec / TLC

* Feature: projects
* Spec: `.specs/features/projects/spec.md`
* Sizing: Medium
* Requisitos: REQ-001 a REQ-008
* Depende de: AB-15

## Jira Tracking

* Epic key: AB-4
* Task key: AB-16

## Escopo

* `src/features/projects/ProjectList.tsx`
* `src/features/projects/ProjectPanel.tsx`
* `src/features/projects/projectTypes.ts`
* Integração App/Editor para trocar desenho ativo (lift state ou context mínimo)
* Testes unitários para CRUD UI helpers e repository extensions se necessário

## Fora de escopo

* Import/export (AB-17)
* Pastas proibidas: tools/, history/, selection/, technical-doc/

## Criterios de aceite

* [ ] (REQ-001) Sidebar lista desenhos
* [ ] (REQ-002) Criar novo desenho
* [ ] (REQ-003) Renomear
* [ ] (REQ-004) Duplicar
* [ ] (REQ-005) Excluir
* [ ] (REQ-006) Descrição e tags
* [ ] (REQ-007) Data última alteração
* [ ] (REQ-008) Seleção carrega editor

## Evidencia

* `.agent/runs/AB-16/implementation-report.md`
* `.agent/runs/AB-16/review-report.md`
* `.agent/runs/AB-16/qa-report.md`
* `.agent/runs/AB-16/token-report.md`
