import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import type { DrawingDbRecord } from "../../shared/storage/indexedDb";
import { initialEditorState } from "../editor/editorReducer";
import type { LocalDrawElement } from "../elements/elementTypes";
import {
  createDrawing,
  deleteDrawing,
  duplicateDrawing,
  getById,
  listSummaries,
  loadActiveDrawing,
  save,
  updateMetadata,
} from "./localProjectRepository";

const ACTIVE_DRAWING_STORAGE_KEY = "localdraw:activeDrawingId";

const rectangle: LocalDrawElement = {
  id: "rect-1",
  type: "rectangle",
  x: 12,
  y: 24,
  width: 100,
  height: 50,
  rotation: 0,
  strokeColor: "#18202c",
  backgroundColor: "#ffffff",
  strokeWidth: 2,
  opacity: 1,
  createdAt: "2026-06-28T10:00:00.000Z",
  updatedAt: "2026-06-28T10:00:00.000Z",
};

const sampleRecord: DrawingDbRecord = {
  id: "drawing-1",
  name: "Persisted drawing",
  description: "Saved locally",
  tags: ["mvp"],
  elements: [rectangle],
  viewport: {
    zoom: 2,
    scrollX: 15,
    scrollY: 30,
  },
  metadata: {
    createdAt: "2026-06-28T10:00:00.000Z",
    updatedAt: "2026-06-28T12:00:00.000Z",
  },
};

describe("localProjectRepository", () => {
  beforeEach(async () => {
    localStorage.clear();

    await new Promise<void>((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase("localdraw");
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
      deleteRequest.onblocked = () => resolve();
    });
  });

  it("saves full drawing fields (REQ-002)", async () => {
    await save(sampleRecord);

    const loaded = await getById(sampleRecord.id);

    expect(loaded).toEqual(sampleRecord);
  });

  it("exposes repository CRUD operations (REQ-003)", async () => {
    await save(sampleRecord);
    await save({
      ...sampleRecord,
      id: "drawing-2",
      name: "Second drawing",
      metadata: {
        ...sampleRecord.metadata,
        updatedAt: "2026-06-28T13:00:00.000Z",
      },
    });

    expect(await listSummaries()).toEqual([
      {
        id: "drawing-2",
        name: "Second drawing",
        updatedAt: "2026-06-28T13:00:00.000Z",
      },
      {
        id: sampleRecord.id,
        name: sampleRecord.name,
        updatedAt: sampleRecord.metadata.updatedAt,
      },
    ]);

    await deleteDrawing(sampleRecord.id);

    expect(await getById(sampleRecord.id)).toBeNull();
  });

  it("loads active drawing after reload semantics (REQ-006)", async () => {
    await save(sampleRecord);
    await save({
      ...sampleRecord,
      id: "drawing-2",
      name: "Latest drawing",
      metadata: {
        ...sampleRecord.metadata,
        updatedAt: "2026-06-28T14:00:00.000Z",
      },
    });

    localStorage.setItem(ACTIVE_DRAWING_STORAGE_KEY, sampleRecord.id);

    expect(await loadActiveDrawing()).toEqual(sampleRecord);
  });

  it("loads the only persisted drawing when no active id exists (REQ-006)", async () => {
    await save(sampleRecord);

    expect(await loadActiveDrawing()).toEqual(sampleRecord);
  });

  it("maps editor state without persisting showGrid (REQ-002, REQ-007)", async () => {
    const { saveFromEditorState } = await import("./localProjectRepository");

    await saveFromEditorState({
      ...initialEditorState,
      elements: [rectangle],
      viewport: {
        zoom: 1.75,
        scrollX: 5,
        scrollY: 8,
        showGrid: false,
      },
      currentDrawing: {
        id: sampleRecord.id,
        name: sampleRecord.name,
        createdAt: sampleRecord.metadata.createdAt,
        updatedAt: sampleRecord.metadata.updatedAt,
      },
    });

    const loaded = await getById(sampleRecord.id);

    expect(loaded?.viewport).toEqual({
      zoom: 1.75,
      scrollX: 5,
      scrollY: 8,
    });
    expect(loaded?.viewport).not.toHaveProperty("showGrid");
  });

  it("creates an empty drawing with a new id (REQ-002)", async () => {
    const created = await createDrawing("Fresh drawing");

    expect(created.name).toBe("Fresh drawing");
    expect(created.elements).toEqual([]);
    expect(created.tags).toEqual([]);
    expect(await getById(created.id)).toEqual(created);
    expect(localStorage.getItem(ACTIVE_DRAWING_STORAGE_KEY)).toBe(created.id);
  });

  it("duplicates a drawing with a copy suffix (REQ-004)", async () => {
    await save(sampleRecord);

    const duplicate = await duplicateDrawing(sampleRecord.id);

    expect(duplicate).not.toBeNull();
    expect(duplicate?.id).not.toBe(sampleRecord.id);
    expect(duplicate?.name).toBe(`${sampleRecord.name} (copy)`);
    expect(duplicate?.elements).toEqual(sampleRecord.elements);
    expect(duplicate?.tags).toEqual(sampleRecord.tags);
  });

  it("updates metadata without replacing elements (REQ-006)", async () => {
    await save(sampleRecord);

    const updated = await updateMetadata(sampleRecord.id, {
      name: "Renamed drawing",
      description: "Updated description",
      tags: ["updated"],
    });

    expect(updated).toMatchObject({
      id: sampleRecord.id,
      name: "Renamed drawing",
      description: "Updated description",
      tags: ["updated"],
      elements: sampleRecord.elements,
    });
  });
});
