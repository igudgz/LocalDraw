import { describe, expect, it } from "vitest";
import type { LocalDrawElement } from "../elements/elementTypes";
import { buildTechnicalDocInput } from "./technicalDocContext";
import { parseDiagram } from "./diagramParser";
import { generateMarkdown } from "./markdownGenerator";
import {
  aiTechnicalDocGeneratorStub,
  generateTechnicalDocLocal,
} from "./technicalDocService";
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
    ...overrides,
  } as LocalDrawElement;
}

function sampleParsedDiagram(): ParsedDiagram {
  return parseDiagram([
    rectangle("rect-api", { text: "Order API" }),
    ellipse("ellipse-user", { text: "End User" }),
    arrow("arrow-1", {
      label: "HTTP",
      startBindingId: "ellipse-user",
      endBindingId: "rect-api",
    }),
  ]);
}

function buildInput(parsed: ParsedDiagram) {
  return buildTechnicalDocInput(parsed, {
    outputLanguage: "pt-BR",
    docStyle: "detailed",
  });
}

describe("generateTechnicalDocLocal", () => {
  it("REQ-018: generates TechnicalDocOutput without external calls", () => {
    const parsed = sampleParsedDiagram();
    const output = generateTechnicalDocLocal(buildInput(parsed));

    expect(typeof output.markdown).toBe("string");
    expect(output.markdown.length).toBeGreaterThan(0);
    expect(output.markdown).toBe(generateMarkdown(parsed));
  });

  it("REQ-018: maps assumptions and openQuestions from diagram", () => {
    const parsed = sampleParsedDiagram();
    const output = generateTechnicalDocLocal(buildInput(parsed));

    expect(output.assumptions).toEqual(parsed.assumptions);
    expect(output.openQuestions).toEqual(parsed.openQuestions);
    expect(output.assumptions).not.toBe(parsed.assumptions);
    expect(output.openQuestions).not.toBe(parsed.openQuestions);
  });

  it("REQ-019: local fallback returns markdown usable offline", () => {
    const parsed = sampleParsedDiagram();
    const output = generateTechnicalDocLocal(buildInput(parsed));

    expect(output.markdown.startsWith("# Technical Doc")).toBe(true);
    expect(output.markdown).toContain("## Contexto");
  });
});

describe("TechnicalDocGenerator stub", () => {
  it("REQ-018: AI stub rejects without calling external APIs", async () => {
    const parsed = sampleParsedDiagram();

    await expect(
      aiTechnicalDocGeneratorStub.generate(buildInput(parsed)),
    ).rejects.toThrow("AB-22 blocked");
  });
});
