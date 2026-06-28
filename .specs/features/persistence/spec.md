# Spec - persistence

Fase TLC: Specify. Local: `.specs/features/persistence/spec.md`.

## Feature ID

persistence

## Fase do roadmap

Fase 10 — Persistência local (IndexedDB)

## Scope sizing

Sizing escolhido: **Large**
Justificativa: IndexedDB, entidades Project/Drawing, autosave com debounce, integração com editor e reabertura após reload. Múltiplos arquivos e decisões de persistência.

## Contexto

O editor já mantém estado em memória (`EditorState`) com `currentDrawing`, elementos e viewport. Os stubs em `features/persistence/` e `shared/storage/indexedDb.ts` precisam ser implementados para salvar localmente sem alterar tipos de elemento nem o formato `.localdraw` congelado.

## Objetivo

Salvar desenhos localmente via IndexedDB com autosave debounced e permitir reabrir o desenho após recarregar a página.

## Requisitos (IDs rastreáveis)

| ID | Requisito | Critério de aceite verificável |
|----|-----------|--------------------------------|
| REQ-001 | Camada IndexedDB | `shared/storage/indexedDb.ts` abre DB `localdraw`, store `drawings`, CRUD básico funciona |
| REQ-002 | Entidade Drawing | Registro persiste id, name, description, tags, elements, viewport (zoom/scrollX/scrollY), metadata (createdAt/updatedAt) |
| REQ-003 | Repository | `localProjectRepository.ts` expõe save, getById, listSummaries, deleteDrawing |
| REQ-004 | Serializer | `localDrawSerializer.ts` serializa/deserializa conforme contrato congelado `LocalDrawFile` v1 (sem alterar schema) |
| REQ-005 | Autosave debounced | Mudanças no editor disparam save após debounce (≥500ms); não salva a cada frame de drag |
| REQ-006 | Reabrir após reload | Ao montar app, último desenho ativo ou único desenho é carregado do IndexedDB |
| REQ-007 | Integração mínima | Editor/App conectados ao repository sem alterar `elementTypes.ts` |

## Fora de escopo

* Lista lateral de desenhos (AB-16)
* Import/export arquivo (AB-17)
* Ferramentas de desenho, undo/redo, estilos, resize, atalhos
* Backend remoto, sync cloud
* Alteração do formato `.localdraw`

## Gray areas / discuss

Ver `.specs/features/persistence/context.md`.

## Restrições do projeto

* Não usar `@excalidraw/excalidraw`, código ou componentes oficiais do Excalidraw.
* Não adicionar biblioteca pronta de whiteboard/editor visual.
* Formato `.localdraw` congelado — qualquer mudança exige aprovação humana.
* Manter SVG-first no MVP.

## Referências

* `ROADMAP.md` Fase 10
* Jira: AB-15 (Epic AB-4)
