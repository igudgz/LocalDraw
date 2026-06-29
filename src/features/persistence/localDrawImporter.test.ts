import { describe, expect, it } from "vitest";
import type { LocalDrawElement } from "../elements/elementTypes";
import {
  deserializeLocalDrawFile,
  serializeDrawingRecord,
} from "./localDrawSerializer";
import { parseLocalDrawFile } from "./localDrawImporter";

const rectangle: LocalDrawElement = {
  id: "rect-1",
  type: "rectangle",
  x: 10,
  y: 20,
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

describe("localDrawImporter", () => {
  it("parses valid .localdraw JSON (REQ-002)", () => {
    const file = serializeDrawingRecord({
      id: "drawing-1",
      name: "Imported",
      tags: ["architecture"],
      elements: [rectangle],
      viewport: { zoom: 1, scrollX: 0, scrollY: 0 },
      metadata: {
        createdAt: "2026-06-28T10:00:00.000Z",
        updatedAt: "2026-06-28T11:00:00.000Z",
      },
    });

    const result = parseLocalDrawFile(JSON.stringify(file));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.file).toEqual(file);
    }
  });

  it("returns a clear error for invalid JSON (REQ-003)", () => {
    const result = parseLocalDrawFile("{not-json");

    expect(result).toEqual({
      ok: false,
      error: "Invalid JSON in .localdraw file",
    });
  });

  it("returns a clear error for unsupported versions (REQ-003)", () => {
    const result = parseLocalDrawFile(
      JSON.stringify({ version: 2, app: "localdraw" }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Unsupported LocalDrawFile version");
    }
  });

  it("round-trips imported files through deserializeLocalDrawFile", () => {
    const file = serializeDrawingRecord({
      id: "drawing-1",
      name: "Round trip",
      tags: [],
      elements: [rectangle],
      viewport: { zoom: 1.25, scrollX: 12, scrollY: 34 },
      metadata: {
        createdAt: "2026-06-28T10:00:00.000Z",
        updatedAt: "2026-06-28T10:00:00.000Z",
      },
    });

    const parsed = parseLocalDrawFile(JSON.stringify(file));
    expect(parsed.ok).toBe(true);

    if (parsed.ok) {
      const restored = deserializeLocalDrawFile("new-id", parsed.file);
      expect(restored.name).toBe("Round trip");
      expect(restored.elements).toEqual(file.elements);
      expect(restored.viewport).toEqual(file.viewport);
    }
  });
});
