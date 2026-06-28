import type { LocalDrawElement } from "../../features/elements/elementTypes";

export const LOCALDRAW_DB_NAME = "localdraw";
export const LOCALDRAW_DB_VERSION = 1;
export const DRAWINGS_STORE_NAME = "drawings";

export type IndexedDbStatus = "ready" | "unavailable";

export type DrawingDbRecord = {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  elements: LocalDrawElement[];
  viewport: {
    zoom: number;
    scrollX: number;
    scrollY: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
};

export class IndexedDbUnavailableError extends Error {
  constructor(message = "IndexedDB is unavailable") {
    super(message);
    this.name = "IndexedDbUnavailableError";
  }
}

function assertIndexedDbAvailable(): void {
  if (typeof indexedDB === "undefined") {
    throw new IndexedDbUnavailableError();
  }
}

function openDatabase(): Promise<IDBDatabase> {
  assertIndexedDbAvailable();

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCALDRAW_DB_NAME, LOCALDRAW_DB_VERSION);

    request.onerror = () => {
      reject(request.error ?? new IndexedDbUnavailableError());
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DRAWINGS_STORE_NAME)) {
        db.createObjectStore(DRAWINGS_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(DRAWINGS_STORE_NAME, mode);
        const store = transaction.objectStore(DRAWINGS_STORE_NAME);
        const request = operation(store);

        request.onerror = () => {
          reject(request.error ?? new Error("IndexedDB request failed"));
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        transaction.oncomplete = () => {
          db.close();
        };

        transaction.onerror = () => {
          reject(transaction.error ?? new Error("IndexedDB transaction failed"));
        };
      }),
  );
}

export async function putDrawingRecord(record: DrawingDbRecord): Promise<void> {
  await runTransaction("readwrite", (store) => store.put(record));
}

export async function getDrawingRecord(
  id: string,
): Promise<DrawingDbRecord | null> {
  const result = await runTransaction<DrawingDbRecord | undefined>(
    "readonly",
    (store) => store.get(id),
  );

  return result ?? null;
}

export async function getAllDrawingRecords(): Promise<DrawingDbRecord[]> {
  return runTransaction<DrawingDbRecord[]>("readonly", (store) =>
    store.getAll(),
  );
}

export async function deleteDrawingRecord(id: string): Promise<void> {
  await runTransaction("readwrite", (store) => store.delete(id));
}
