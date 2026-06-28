import type { HistoryStack } from "./historyTypes";

export function createEmptyHistory<T>(): HistoryStack<T> {
  return {
    past: [],
    future: [],
  };
}
