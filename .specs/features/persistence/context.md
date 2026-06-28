# Context - persistence

Decisões de gray areas para AB-15 (Fase 10).

## AD-004 (proposta neste batch)

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Nome do IndexedDB | `localdraw` | Alinhado ao app |
| Object store | `drawings` | Um registro por desenho |
| Chave primária | `id` (string UUID) | Compatível com `currentDrawing.id` |
| Autosave debounce | 800ms | Balanceia responsividade vs I/O; evita save por frame |
| Viewport persistido | zoom, scrollX, scrollY | Contrato `LocalDrawFile`; `showGrid` permanece preferência de sessão (default do reducer) |
| Projeto vs Drawing | Drawing único por registro; Project = agrupamento futuro | MVP Fase 10 usa entidade Drawing; `ProjectSummary` espelha lista mínima |
| Testes | Vitest + jsdom permitido (devDependency) | Gate TLC exige testes derivados da spec; projeto ainda não tinha runner |

## Formato LocalDrawFile (congelado — NÃO alterar)

```ts
export type LocalDrawFile = {
  version: 1;
  app: "localdraw";
  name: string;
  description?: string;
  tags: string[];
  elements: LocalDrawElement[];
  viewport: { zoom: number; scrollX: number; scrollY: number };
  metadata: { createdAt: string; updatedAt: string };
};
```

Persistência interna pode incluir `id` adicional no registro IndexedDB, fora do arquivo exportado.
