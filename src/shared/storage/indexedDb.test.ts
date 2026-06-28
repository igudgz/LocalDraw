import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import type { DrawingDbRecord } from "../../features/persistence/drawingTypes";
import {
  deleteRecord,
  DRAWINGS_STORE_NAME,
  getAllRecords,
  getRecord,
  LOCALDRAW_DB_NAME,
  putRecord,
} from "./indexedDb";

const sampleRecord: DrawingDbRecord = {
  id: "drawing-1",
  name: "Architecture sketch",
  description: "Initial draft",
  tags: ["draft"],
  elements: [],
  viewport: {
    zoom: 1.25,
    scrollX: 10,
    scrollY: 20,
  },
  metadata: {
    createdAt: "2026-06-28T10:00:00.000Z",
    updatedAt: "2026-06-28T11:00:00.000Z",
  },
};

describe("indexedDb", () => {
  beforeEach(async () => {
    await new Promise<void>((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(LOCALDRAW_DB_NAME);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
      deleteRequest.onblocked = () => resolve();
    });
  });

  it("opens localdraw database with drawings store (REQ-001)", async () => {
    await putRecord(sampleRecord);

    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(LOCALDRAW_DB_NAME);
      request.onsuccess = () => {
        const db = request.result;
        expect(db.objectStoreNames.contains(DRAWINGS_STORE_NAME)).toBe(true);
        db.close();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  });

  it("persists and reads drawing records (REQ-001)", async () => {
    await putRecord(sampleRecord);

    const loaded = await getRecord<DrawingDbRecord>(sampleRecord.id);

    expect(loaded).toEqual(sampleRecord);
  });

  it("lists and deletes drawing records (REQ-001)", async () => {
    await putRecord(sampleRecord);
    await putRecord({
      ...sampleRecord,
      id: "drawing-2",
      name: "Second drawing",
    });

    expect(await getAllRecords<DrawingDbRecord>()).toHaveLength(2);

    await deleteRecord(sampleRecord.id);

    expect(await getRecord(sampleRecord.id)).toBeNull();
    expect(await getAllRecords<DrawingDbRecord>()).toHaveLength(1);
  });
});
