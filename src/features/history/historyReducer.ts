import type { LocalDrawElement } from "../elements/elementTypes";
import type { HistoryStack } from "./historyTypes";

export const MAX_HISTORY = 50;

export function createEmptyHistory<T>(): HistoryStack<T> {
  return {
    past: [],
    future: [],
  };
}

function cloneElements(elements: LocalDrawElement[]): LocalDrawElement[] {
  return structuredClone(elements);
}

export function pushSnapshot(
  history: HistoryStack<LocalDrawElement[]>,
  elements: LocalDrawElement[],
): HistoryStack<LocalDrawElement[]> {
  const snapshot = cloneElements(elements);
  const past = [...history.past, snapshot];
  const trimmedPast =
    past.length > MAX_HISTORY ? past.slice(past.length - MAX_HISTORY) : past;

  return {
    past: trimmedPast,
    future: [],
  };
}

export function popPast(
  history: HistoryStack<LocalDrawElement[]>,
  currentElements: LocalDrawElement[],
): {
  history: HistoryStack<LocalDrawElement[]>;
  restoredElements: LocalDrawElement[] | null;
} {
  if (history.past.length === 0) {
    return { history, restoredElements: null };
  }

  const past = [...history.past];
  const restoredElements = past.pop()!;
  const currentSnapshot = cloneElements(currentElements);

  return {
    history: {
      past,
      future: [currentSnapshot, ...history.future],
    },
    restoredElements,
  };
}

export function popFuture(
  history: HistoryStack<LocalDrawElement[]>,
  currentElements: LocalDrawElement[],
): {
  history: HistoryStack<LocalDrawElement[]>;
  restoredElements: LocalDrawElement[] | null;
} {
  if (history.future.length === 0) {
    return { history, restoredElements: null };
  }

  const future = [...history.future];
  const restoredElements = future.shift()!;
  const currentSnapshot = cloneElements(currentElements);

  return {
    history: {
      past: [...history.past, currentSnapshot],
      future,
    },
    restoredElements,
  };
}
