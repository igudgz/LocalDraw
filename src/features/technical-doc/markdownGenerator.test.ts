import { describe, expect, it, vi } from "vitest";
import type { LocalDrawElement } from "../elements/elementTypes";
import { parseDiagram } from "./diagramParser";
import { generateMarkdown, SECTION_HEADINGS } from "./markdownGenerator";
import type { ParsedDiagram } from "./technicalDocTypes";

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

function sampleParsedDiagram(): ParsedDiagram {
  const elements: LocalDrawElement[] = [
    rectangle("rect-api", { text: "Order API" }),
    ellipse("ellipse-user", { text: "End User" }),
    ellipse("ellipse-gateway", { text: "External API" }),
    arrow("arrow-1", {
      label: "HTTP",
      startBindingId: "ellipse-user",
      endBindingId: "rect-api",
    }),
    arrow("arrow-2", {
      startBindingId: "rect-api",
      endBindingId: "ellipse-gateway",
    }),
    textElement("note-1", "Deploy only on weekdays", { x: 500, y: 500 }),
  ];

  return parseDiagram(elements);
}

describe("generateMarkdown", () => {
  it("REQ-010: generates Markdown from ParsedDiagram", () => {
    const parsed = sampleParsedDiagram();
    const markdown = generateMarkdown(parsed);

    expect(typeof markdown).toBe("string");
    expect(markdown.length).toBeGreaterThan(0);
    expect(markdown.startsWith("# Technical Doc")).toBe(true);
  });

  it("REQ-011: includes all required section headings", () => {
    const markdown = generateMarkdown(sampleParsedDiagram());

    expect(markdown).toContain("# Technical Doc");
    for (const heading of SECTION_HEADINGS) {
      expect(markdown).toContain(`## ${heading}`);
    }
  });

  it("REQ-011: places components in Componentes identificados", () => {
    const markdown = generateMarkdown(sampleParsedDiagram());

    const componentsSection = markdown.split("## Fluxo principal")[0] ?? "";
    expect(componentsSection).toContain("Order API");
    expect(componentsSection).toContain("`service`");
    expect(componentsSection).toContain("End User");
    expect(componentsSection).toContain("`actor`");
  });

  it("REQ-011: places relationships in Fluxo principal", () => {
    const markdown = generateMarkdown(sampleParsedDiagram());
    const flowSection =
      markdown.split("## Fluxo principal")[1]?.split("## Integrações")[0] ?? "";

    expect(flowSection).toContain("End User");
    expect(flowSection).toContain("Order API");
    expect(flowSection).toContain("_HTTP_");
  });

  it("REQ-011: places external integrations in Integrações", () => {
    const markdown = generateMarkdown(sampleParsedDiagram());
    const integrationsSection =
      markdown.split("## Integrações")[1]?.split("## Decisões assumidas")[0] ??
      "";

    expect(integrationsSection).toContain("External API");
    expect(integrationsSection).toContain("`external`");
  });

  it("REQ-011: records open questions in Perguntas em aberto", () => {
    const parsed = parseDiagram([
      rectangle("rect-1"),
      arrow("arrow-1", { endBindingId: "rect-1" }),
    ]);
    const markdown = generateMarkdown(parsed);
    const questionsSection =
      markdown.split("## Perguntas em aberto")[1] ?? "";

    expect(questionsSection).toContain(
      "Arrow arrow-1 has no clear source component.",
    );
  });

  it("REQ-012: produces pre-formatted Markdown suitable for panel preview", () => {
    const markdown = generateMarkdown(sampleParsedDiagram());

    expect(markdown).toMatch(/^# Technical Doc\n/);
    expect(markdown.split("\n").length).toBeGreaterThan(10);
    expect(markdown.endsWith("\n")).toBe(true);
  });

  it("REQ-013: produces copyable and downloadable Markdown content", () => {
    const markdown = generateMarkdown(sampleParsedDiagram());

    expect(markdown.trim().length).toBeGreaterThan(0);
    expect(new Blob([markdown], { type: "text/markdown" }).size).toBeGreaterThan(
      0,
    );
  });

  it("REQ-014: generates Markdown offline without external calls", () => {
    const parsed = sampleParsedDiagram();
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const markdown = generateMarkdown(parsed);

    expect(markdown).toContain("# Technical Doc");
    expect(fetchSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
  });
});
