import { describe, expect, it, vi } from "vitest";
import type { LocalDrawElement } from "../elements/elementTypes";
import { exportAsPngBlob } from "./exportAsPng";

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

describe("exportAsPng", () => {
  it("creates a PNG blob from rendered SVG (REQ-005)", async () => {
    const originalImage = globalThis.Image;
    const createObjectURL = vi.fn(() => "blob:svg");
    const revokeObjectURL = vi.fn();

    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    });

    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private objectUrl = "";

      set src(value: string) {
        this.objectUrl = value;
        this.onload?.();
      }

      get src() {
        return this.objectUrl;
      }
    }

    globalThis.Image = MockImage as unknown as typeof Image;

    const toBlob = vi.fn((callback: BlobCallback) => {
      callback(
        new Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/png" }),
      );
    });

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);

    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(toBlob);

    const blob = await exportAsPngBlob([rectangle]);

    expect(blob.type).toBe("image/png");
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), "image/png");
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:svg");

    globalThis.Image = originalImage;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
});
