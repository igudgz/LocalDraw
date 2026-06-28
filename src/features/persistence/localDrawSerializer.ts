import type { LocalDrawElement } from "../elements/elementTypes";
import type { DrawingDbRecord } from "./drawingTypes";

export type LocalDrawFileVersion = 1;

export type LocalDrawFile = {
  version: 1;
  app: "localdraw";
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

export class LocalDrawSerializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalDrawSerializationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isViewport(value: unknown): value is LocalDrawFile["viewport"] {
  return (
    isRecord(value) &&
    typeof value.zoom === "number" &&
    typeof value.scrollX === "number" &&
    typeof value.scrollY === "number"
  );
}

function isMetadata(value: unknown): value is LocalDrawFile["metadata"] {
  return (
    isRecord(value) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

export function validateLocalDrawFile(file: unknown): asserts file is LocalDrawFile {
  if (!isRecord(file)) {
    throw new LocalDrawSerializationError("LocalDrawFile must be an object");
  }

  if (file.version !== 1) {
    throw new LocalDrawSerializationError("Unsupported LocalDrawFile version");
  }

  if (file.app !== "localdraw") {
    throw new LocalDrawSerializationError("Invalid LocalDrawFile app identifier");
  }

  if (typeof file.name !== "string") {
    throw new LocalDrawSerializationError("LocalDrawFile name must be a string");
  }

  if (file.description !== undefined && typeof file.description !== "string") {
    throw new LocalDrawSerializationError(
      "LocalDrawFile description must be a string when present",
    );
  }

  if (!isStringArray(file.tags)) {
    throw new LocalDrawSerializationError("LocalDrawFile tags must be a string array");
  }

  if (!Array.isArray(file.elements)) {
    throw new LocalDrawSerializationError("LocalDrawFile elements must be an array");
  }

  if (!isViewport(file.viewport)) {
    throw new LocalDrawSerializationError("LocalDrawFile viewport is invalid");
  }

  if (!isMetadata(file.metadata)) {
    throw new LocalDrawSerializationError("LocalDrawFile metadata is invalid");
  }
}

export function serializeDrawingRecord(record: DrawingDbRecord): LocalDrawFile {
  return {
    version: 1,
    app: "localdraw",
    name: record.name,
    description: record.description,
    tags: [...record.tags],
    elements: structuredClone(record.elements),
    viewport: { ...record.viewport },
    metadata: { ...record.metadata },
  };
}

export function deserializeLocalDrawFile(
  id: string,
  file: unknown,
): DrawingDbRecord {
  validateLocalDrawFile(file);

  return {
    id,
    name: file.name,
    description: file.description,
    tags: [...file.tags],
    elements: structuredClone(file.elements) as LocalDrawElement[],
    viewport: { ...file.viewport },
    metadata: { ...file.metadata },
  };
}
