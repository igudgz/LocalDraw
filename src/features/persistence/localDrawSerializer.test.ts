import { describe, expect, it } from "vitest";
import type { DrawingDbRecord } from "./drawingTypes";
import type { LocalDrawElement } from "../elements/elementTypes";
import {
  deserializeLocalDrawFile,
  LocalDrawSerializationError,
  serializeDrawingRecord,
  validateLocalDrawFile,
} from "./localDrawSerializer";

const rectangle: LocalDrawElement = {
  id: "rect-1",
  type: "rectangle",
  x: 0,
  y: 0,
  width: 120,
  height: 80,
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
  name: "Service map",
  description: "Core services",
  tags: ["architecture"],
  elements: [rectangle],
  viewport: {
    zoom: 1.5,
    scrollX: 40,
    scrollY: 60,
  },
  metadata: {
    createdAt: "2026-06-28T10:00:00.000Z",
    updatedAt: "2026-06-28T11:00:00.000Z",
  },
};

describe("localDrawSerializer", () => {
  it("serializes drawing records to LocalDrawFile v1 (REQ-004)", () => {
    const file = serializeDrawingRecord(sampleRecord);

    expect(file).toEqual({
      version: 1,
      app: "localdraw",
      name: sampleRecord.name,
      description: sampleRecord.description,
      tags: sampleRecord.tags,
      elements: sampleRecord.elements,
      viewport: sampleRecord.viewport,
      metadata: sampleRecord.metadata,
    });
    expect(file).not.toHaveProperty("id");
  });

  it("round-trips through deserializeLocalDrawFile (REQ-004)", () => {
    const file = serializeDrawingRecord(sampleRecord);
    const restored = deserializeLocalDrawFile(sampleRecord.id, file);

    expect(restored).toEqual(sampleRecord);
  });

  it("rejects invalid LocalDrawFile payloads (REQ-004)", () => {
    expect(() => validateLocalDrawFile({ version: 2, app: "localdraw" })).toThrow(
      LocalDrawSerializationError,
    );
    expect(() => validateLocalDrawFile({ version: 1, app: "other" })).toThrow(
      LocalDrawSerializationError,
    );
  });
});
