import { describe, expect, it } from "vitest";
import type { RectangleElement } from "../elements/elementTypes";
import {
  createEmptyHistory,
  MAX_HISTORY,
  popFuture,
  popPast,
  pushSnapshot,
} from "./historyReducer";

const rectangle: RectangleElement = {
  id: "rect-1",
  type: "rectangle",
  x: 10,
  y: 20,
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

describe("historyReducer pushSnapshot", () => {
  it("appends a deep-cloned snapshot to past and clears future", () => {
    const history = createEmptyHistory<RectangleElement[]>();
    const futureSnapshot = [{ ...rectangle, id: "future" }];
    const withFuture = {
      past: [[rectangle]],
      future: [futureSnapshot],
    };

    const next = pushSnapshot(withFuture, [rectangle]);

    expect(next.past).toHaveLength(2);
    expect(next.past[1]).toEqual([rectangle]);
    expect(next.past[1]).not.toBe([rectangle]);
    expect(next.future).toEqual([]);
  });

  it("deep-clones elements so later mutations do not affect stored snapshots", () => {
    const elements = [rectangle];
    const history = pushSnapshot(createEmptyHistory(), elements);

    elements[0] = { ...rectangle, x: 999 };

    expect(history.past[0]?.[0]?.x).toBe(10);
  });

  it(`discards oldest entries when past exceeds MAX_HISTORY (${MAX_HISTORY})`, () => {
    let history = createEmptyHistory<RectangleElement[]>();

    for (let index = 0; index < MAX_HISTORY + 5; index += 1) {
      history = pushSnapshot(history, [
        { ...rectangle, id: `rect-${index}`, x: index },
      ]);
    }

    expect(history.past).toHaveLength(MAX_HISTORY);
    expect(history.past[0]?.[0]?.x).toBe(5);
    expect(history.past.at(-1)?.[0]?.x).toBe(MAX_HISTORY + 4);
  });
});

describe("historyReducer popPast", () => {
  it("returns null when past is empty", () => {
    const history = createEmptyHistory<RectangleElement[]>();
    const result = popPast(history, [rectangle]);

    expect(result.restoredElements).toBeNull();
    expect(result.history).toBe(history);
  });

  it("pops the latest past snapshot and pushes current elements to future", () => {
    const previous = [{ ...rectangle, x: 0 }];
    const current = [{ ...rectangle, x: 50 }];
    const history = {
      past: [previous],
      future: [],
    };

    const result = popPast(history, current);

    expect(result.restoredElements).toEqual(previous);
    expect(result.history.past).toEqual([]);
    expect(result.history.future).toHaveLength(1);
    expect(result.history.future[0]).toEqual(current);
  });
});

describe("historyReducer popFuture", () => {
  it("returns null when future is empty", () => {
    const history = createEmptyHistory<RectangleElement[]>();
    const result = popFuture(history, [rectangle]);

    expect(result.restoredElements).toBeNull();
    expect(result.history).toBe(history);
  });

  it("pops the next future snapshot and pushes current elements to past", () => {
    const current = [{ ...rectangle, x: 50 }];
    const next = [{ ...rectangle, x: 100 }];
    const history = {
      past: [],
      future: [next],
    };

    const result = popFuture(history, current);

    expect(result.restoredElements).toEqual(next);
    expect(result.history.future).toEqual([]);
    expect(result.history.past).toHaveLength(1);
    expect(result.history.past[0]).toEqual(current);
  });
});
