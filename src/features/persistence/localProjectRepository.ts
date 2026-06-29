import type { EditorState } from "../editor/editorTypes";
import type { ProjectSummary } from "../projects/projectTypes";
import {
  deleteRecord,
  getAllRecords,
  getRecord,
  putRecord,
} from "../../shared/storage/indexedDb";
import { editorStateToDrawingRecord } from "./drawingBridge";
import { deserializeLocalDrawFile, serializeDrawingRecord } from "./localDrawSerializer";
import type { LocalDrawFile } from "./localDrawSerializer";
import type { DrawingDbRecord } from "./drawingTypes";

export type { DrawingDbRecord };

const ACTIVE_DRAWING_STORAGE_KEY = "localdraw:activeDrawingId";
export const PLACEHOLDER_DRAWING_ID = "localdraw-initial-drawing";

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

export async function save(record: DrawingDbRecord): Promise<void> {
  await putRecord(record);
  setActiveDrawingId(record.id);
}

export async function saveFromEditorState(state: EditorState): Promise<void> {
  if (state.currentDrawing.id === PLACEHOLDER_DRAWING_ID) {
    return;
  }

  const existing = await getById(state.currentDrawing.id);
  const record = editorStateToDrawingRecord(state, existing);
  await save(record);
}

export async function getById(id: string): Promise<DrawingDbRecord | null> {
  return getRecord<DrawingDbRecord>(id);
}

export async function listSummaries(): Promise<ProjectSummary[]> {
  const records = await getAllRecords<DrawingDbRecord>();
  return records
    .map(toProjectSummary)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function deleteDrawing(id: string): Promise<void> {
  await deleteRecord(id);
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

  await putRecord(record);
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
