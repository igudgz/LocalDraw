import { describe, expect, it } from "vitest";
import type { LocalDrawElement } from "../elements/elementTypes";
import { parseDiagram } from "./diagramParser";

const baseElement = {
  x: 0,
  y: 0,
  width: 120,
  height: 80,
  rotation: 0,
  strokeColor: "#18202c",
  backgroundColor: "#ffffff",
  strokeWidth: 2,
  opacity: 1,
  createdAt: "2026-06-28T00:00:00.000Z",
  updatedAt: "2026-06-28T00:00:00.000Z",
};

function rectangle(
  id: string,
  overrides: Partial<LocalDrawElement & { text?: string }> = {},
): LocalDrawElement {
  return {
    ...baseElement,
    id,
    type: "rectangle",
    ...overrides,
  } as LocalDrawElement;
}

function ellipse(
  id: string,
  overrides: Partial<LocalDrawElement & { text?: string }> = {},
): LocalDrawElement {
  return {
    ...baseElement,
    id,
    type: "ellipse",
    ...overrides,
  } as LocalDrawElement;
}

function arrow(
  id: string,
  overrides: Partial<LocalDrawElement> = {},
): LocalDrawElement {
  return {
    ...baseElement,
    id,
    type: "arrow",
    startX: 0,
    startY: 0,
    endX: 100,
    endY: 0,
    ...overrides,
  } as LocalDrawElement;
}

function textElement(
  id: string,
  text: string,
  overrides: Partial<LocalDrawElement> = {},
): LocalDrawElement {
  return {
    ...baseElement,
    id,
    type: "text",
    text,
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    ...overrides,
  } as LocalDrawElement;
}

describe("parseDiagram", () => {
  it("REQ-001: reads LocalDrawElement[] and returns ParsedDiagram", () => {
    const elements: LocalDrawElement[] = [
      rectangle("rect-1"),
      ellipse("ellipse-1"),
    ];

    const result = parseDiagram(elements);

    expect(result.components).toHaveLength(2);
    expect(result.relationships).toEqual([]);
    expect(result.notes).toEqual([]);
    expect(result.assumptions).toEqual([]);
    expect(result.openQuestions).toEqual([]);
    expect(result.title).toBeUndefined();
  });

  it("REQ-002: classifies rectangles as service components", () => {
    const result = parseDiagram([rectangle("rect-1", { text: "Auth Service" })]);

    expect(result.components).toEqual([
      {
        id: "component-rect-1",
        name: "Auth Service",
        type: "service",
        elementId: "rect-1",
      },
    ]);
  });

  it("REQ-003: classifies ellipses as actor, external, or unknown", () => {
    const actor = parseDiagram([ellipse("e-actor", { text: "End User" })]);
    const external = parseDiagram([
      ellipse("e-external", { text: "External API" }),
    ]);
    const unknown = parseDiagram([ellipse("e-unknown", { text: "Billing" })]);

    expect(actor.components[0]?.type).toBe("actor");
    expect(external.components[0]?.type).toBe("external");
    expect(unknown.components[0]?.type).toBe("unknown");
  });

  it("REQ-004: maps arrows to relationships with labels when present", () => {
    const elements: LocalDrawElement[] = [
      rectangle("rect-from"),
      rectangle("rect-to"),
      arrow("arrow-1", {
        label: "HTTP",
        startBindingId: "rect-from",
        endBindingId: "rect-to",
      }),
    ];

    const result = parseDiagram(elements);

    expect(result.relationships).toEqual([
      {
        id: "relationship-arrow-1",
        from: "component-rect-from",
        to: "component-rect-to",
        label: "HTTP",
        elementId: "arrow-1",
      },
    ]);
    expect(result.openQuestions).toEqual([]);
  });

  it("REQ-005: maps isolated text elements to notes", () => {
    const result = parseDiagram([
      textElement("note-1", "Deploy only on weekdays", { x: 500, y: 500 }),
    ]);

    expect(result.notes).toEqual([
      {
        id: "note-note-1",
        text: "Deploy only on weekdays",
        elementId: "note-1",
      },
    ]);
    expect(result.components).toEqual([]);
  });

  it("REQ-006: associates embedded shape text with component names", () => {
    const result = parseDiagram([
      rectangle("rect-1", { text: "Order API" }),
      ellipse("ellipse-1", { text: "Payment Gateway" }),
    ]);

    expect(result.components).toEqual([
      {
        id: "component-rect-1",
        name: "Order API",
        type: "service",
        elementId: "rect-1",
      },
      {
        id: "component-ellipse-1",
        name: "Payment Gateway",
        type: "external",
        elementId: "ellipse-1",
      },
    ]);
  });

  it("REQ-006: associates overlapping standalone text with shape names", () => {
    const result = parseDiagram([
      rectangle("rect-1", { x: 0, y: 0, width: 200, height: 100 }),
      textElement("text-1", "Inventory Service", {
        x: 40,
        y: 30,
        width: 120,
        height: 40,
      }),
    ]);

    expect(result.components[0]?.name).toBe("Inventory Service");
    expect(result.notes).toEqual([]);
  });

  it("REQ-007: records uncertain arrow relations in openQuestions", () => {
    const result = parseDiagram([
      rectangle("rect-1"),
      arrow("arrow-1", { endBindingId: "rect-1" }),
    ]);

    expect(result.openQuestions).toContain(
      "Arrow arrow-1 has no clear source component.",
    );
    expect(result.relationships[0]).toMatchObject({
      from: undefined,
      to: "component-rect-1",
    });
  });

  it("REQ-008: does not invent data beyond observable elements", () => {
    const result = parseDiagram([
      rectangle("rect-1"),
      arrow("arrow-1"),
    ]);

    expect(result.title).toBeUndefined();
    expect(result.assumptions).toEqual([]);
    expect(result.components[0]?.name).toBeUndefined();
    expect(result.relationships[0]?.label).toBeUndefined();
    expect(result.relationships[0]?.from).toBeUndefined();
    expect(result.relationships[0]?.to).toBeUndefined();
    expect(result.openQuestions).toEqual([
      "Arrow arrow-1 has no clear source component.",
      "Arrow arrow-1 has no clear target component.",
    ]);
  });
});
