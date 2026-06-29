## Summary

Batch **Persistência e arquivos** (Onda 1, Trilha B) — Fases 10–12 do roadmap LocalDraw.

- **AB-15** — Persistência local (IndexedDB, autosave 800ms, serializer LocalDrawFile v1)
- **AB-16** — Organização de desenhos (sidebar: criar, renomear, duplicar, excluir, tags/descrição)
- **AB-17** — Import/export (.localdraw, SVG, PNG) com validação e UI na toolbar

### Commits

| Jira | Commit | Descrição |
|------|--------|-----------|
| AB-15 | `c99c288` | IndexedDB + autosave |
| AB-16 | `32596e9` | Sidebar organização |
| AB-17 | `ae3b443` | Import/export |

### Arquivos principais

- `src/shared/storage/indexedDb.ts`
- `src/features/persistence/*` (repository, serializer, importer, hook)
- `src/features/projects/*` (ProjectList, ProjectPanel, useDrawingProjects)
- `src/features/export/*` (JSON/SVG/PNG, elementSvgMarkup)
- `src/app/App.tsx`, `src/features/editor/Editor.tsx`, `EditorToolbar.tsx`

### Evidências

- `.agent/runs/mvp-batch-004-persistence/batch-summary.md`
- `.agent/runs/AB-15/`, `AB-16/`, `AB-17/` (implementation, review, qa, token reports)
- Specs: `.specs/features/persistence/`, `projects/`, `export/`

### Jira

- Epic **AB-4** (LocalDraw - MVP)
- Tasks **AB-15**, **AB-16**, **AB-17** → Concluído

### Decisões

- Formato `.localdraw` v1 **não alterado** (AD-004)
- Vitest + fake-indexeddb como devDependencies
- Import cria novo desenho; existentes preservados no IndexedDB

## Test plan

- [x] `npm run lint` — PASS
- [x] `npm run build` — PASS
- [x] `npm test` — PASS (32 tests)
- [ ] Manual: criar desenho, recarregar página, verificar persistência
- [ ] Manual: sidebar CRUD (criar, renomear, duplicar, excluir)
- [ ] Manual: export .localdraw → import → export SVG/PNG
