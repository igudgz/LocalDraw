import { describe, expect, it, vi } from "vitest";
import {
  AUTOSAVE_DEBOUNCE_MS,
  createDebouncedCallback,
} from "./useDrawingPersistence";

describe("useDrawingPersistence debounce", () => {
  it("debounces callbacks and avoids per-frame saves (REQ-005)", () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debounced = createDebouncedCallback(callback, AUTOSAVE_DEBOUNCE_MS);

    debounced.schedule();
    debounced.schedule();
    debounced.schedule();

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS - 1);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);

    debounced.cancel();
    debounced.schedule();
    vi.advanceTimersByTime(AUTOSAVE_DEBOUNCE_MS);
    expect(callback).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("uses the configured 800ms autosave delay (REQ-005)", () => {
    expect(AUTOSAVE_DEBOUNCE_MS).toBeGreaterThanOrEqual(500);
    expect(AUTOSAVE_DEBOUNCE_MS).toBe(800);
  });
});
