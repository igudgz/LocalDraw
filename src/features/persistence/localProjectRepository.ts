import type { EditorState } from "../editor/editorTypes";
import type { ProjectSummary } from "../projects/projectTypes";
import {
  deleteDrawingRecord,
  getAllDrawingRecords,
  getDrawingRecord,
  putDrawingRecord,
  type DrawingDbRecord,
} from "../../shared/storage/indexedDb";
import { deserializeLocalDrawFile, serializeDrawingRecord } from "./localDrawSerializer";
import type { LocalDrawFile } from "./localDrawSerializer";

export type { DrawingDbRecord };

const ACTIVE_DRAWING_STORAGE_KEY = "localdraw:activeDrawingId";

function readActiveDrawingId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_DRAWING_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setActiveDrawingId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_DRAWING_STORAGE_KEY, id);
  } catch {
    // Ignore storage failures; persistence still works for the current session.
  }
}

function writeActiveDrawingId(id: string): void {
  setActiveDrawingId(id);
}

function clearActiveDrawingId(id: string): void {
  try {
    if (localStorage.getItem(ACTIVE_DRAWING_STORAGE_KEY) === id) {
      localStorage.removeItem(ACTIVE_DRAWING_STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures.
  }
}

function toProjectSummary(record: DrawingDbRecord): ProjectSummary {
  return {
    id: record.id,
    name: record.name,
    updatedAt: record.metadata.updatedAt,
  };
}

function editorStateToDrawingRecord(
  state: EditorState,
  existing?: DrawingDbRecord | null,
): DrawingDbRecord {
  const updatedAt = new Date().toISOString();

  return {
    id: state.currentDrawing.id,
    name: state.currentDrawing.name,
    description: existing?.description,
    tags: existing?.tags ?? [],
    elements: structuredClone(state.elements),
    viewport: {
      zoom: state.viewport.zoom,
      scrollX: state.viewport.scrollX,
      scrollY: state.viewport.scrollY,
    },
    metadata: {
      createdAt: state.currentDrawing.createdAt,
      updatedAt,
    },
  };
}

export async function save(record: DrawingDbRecord): Promise<void> {
  await putDrawingRecord(record);
  writeActiveDrawingId(record.id);
}

export async function saveFromEditorState(state: EditorState): Promise<void> {
  const existing = await getDrawingRecord(state.currentDrawing.id);
  const record = editorStateToDrawingRecord(state, existing);
  await save(record);
}

export async function getById(id: string): Promise<DrawingDbRecord | null> {
  return getDrawingRecord(id);
}

export async function listSummaries(): Promise<ProjectSummary[]> {
  const records = await getAllDrawingRecords();
  return records
    .map(toProjectSummary)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function deleteDrawing(id: string): Promise<void> {
  await deleteDrawingRecord(id);
  clearActiveDrawingId(id);
}

export type DrawingMetadataUpdate = {
  name?: string;
  description?: string;
  tags?: string[];
};

function createEmptyDrawingRecord(name: string): DrawingDbRecord {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,
    tags: [],
    elements: [],
    viewport: {
      zoom: 1,
      scrollX: 0,
      scrollY: 0,
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  };
}

export async function createDrawing(
  name = "Untitled drawing",
): Promise<DrawingDbRecord> {
  const record = createEmptyDrawingRecord(name);
  await save(record);
  return record;
}

export async function importDrawing(file: LocalDrawFile): Promise<DrawingDbRecord> {
  const record = deserializeLocalDrawFile(crypto.randomUUID(), file);
  await save(record);
  return record;
}

export async function duplicateDrawing(
  id: string,
): Promise<DrawingDbRecord | null> {
  const source = await getById(id);
  if (!source) {
    return null;
  }

  const now = new Date().toISOString();
  const record: DrawingDbRecord = {
    ...structuredClone(source),
    id: crypto.randomUUID(),
    name: `${source.name} (copy)`,
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  };

  await save(record);
  return record;
}

export async function updateMetadata(
  id: string,
  update: DrawingMetadataUpdate,
): Promise<DrawingDbRecord | null> {
  const existing = await getById(id);
  if (!existing) {
    return null;
  }

  const record: DrawingDbRecord = {
    ...existing,
    ...(update.name !== undefined ? { name: update.name } : {}),
    ...(update.description !== undefined
      ? { description: update.description }
      : {}),
    ...(update.tags !== undefined ? { tags: update.tags } : {}),
    metadata: {
      ...existing.metadata,
      updatedAt: new Date().toISOString(),
    },
  };

  await putDrawingRecord(record);
  return record;
}

export async function loadActiveDrawing(): Promise<DrawingDbRecord | null> {
  const activeId = readActiveDrawingId();
  if (activeId) {
    const activeRecord = await getById(activeId);
    if (activeRecord) {
      return activeRecord;
    }
  }

  const summaries = await listSummaries();
  if (summaries.length === 0) {
    return null;
  }

  return getById(summaries[0].id);
}

export function toLocalDrawFile(record: DrawingDbRecord) {
  return serializeDrawingRecord(record);
}

export type LocalProjectRepository = {
  save: typeof save;
  saveFromEditorState: typeof saveFromEditorState;
  getById: typeof getById;
  listSummaries: typeof listSummaries;
  deleteDrawing: typeof deleteDrawing;
  loadActiveDrawing: typeof loadActiveDrawing;
  createDrawing: typeof createDrawing;
  importDrawing: typeof importDrawing;
  duplicateDrawing: typeof duplicateDrawing;
  updateMetadata: typeof updateMetadata;
  setActiveDrawingId: typeof setActiveDrawingId;
};

export const localProjectRepository: LocalProjectRepository = {
  save,
  saveFromEditorState,
  getById,
  listSummaries,
  deleteDrawing,
  loadActiveDrawing,
  createDrawing,
  importDrawing,
  duplicateDrawing,
  updateMetadata,
  setActiveDrawingId,
};
