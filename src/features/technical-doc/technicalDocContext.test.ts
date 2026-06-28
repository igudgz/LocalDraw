import { describe, expect, it } from "vitest";
import type { LocalDrawElement } from "../elements/elementTypes";
import { buildTechnicalDocInput } from "./technicalDocContext";
import { parseDiagram } from "./diagramParser";
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

function sampleParsedDiagram(): ParsedDiagram {
  return parseDiagram([
    rectangle("rect-api", { text: "Order API" }),
  ]);
}

describe("buildTechnicalDocInput", () => {
  it("REQ-016: transforms ParsedDiagram and options into TechnicalDocInput", () => {
    const parsed = sampleParsedDiagram();
    const input = buildTechnicalDocInput(parsed, {
      outputLanguage: "pt-BR",
      docStyle: "detailed",
    });

    expect(input.diagram).toBe(parsed);
    expect(input.outputLanguage).toBe("pt-BR");
    expect(input.docStyle).toBe("detailed");
    expect(input.userContext).toBeUndefined();
  });

  it("REQ-016: includes trimmed userContext when provided", () => {
    const parsed = sampleParsedDiagram();
    const input = buildTechnicalDocInput(parsed, {
      userContext: "  Deploy in staging first  ",
      outputLanguage: "en-US",
      docStyle: "concise",
    });

    expect(input.userContext).toBe("Deploy in staging first");
    expect(input.outputLanguage).toBe("en-US");
    expect(input.docStyle).toBe("concise");
  });

  it("REQ-016: omits userContext when blank after trim", () => {
    const parsed = sampleParsedDiagram();
    const input = buildTechnicalDocInput(parsed, {
      userContext: "   ",
      outputLanguage: "pt-BR",
      docStyle: "detailed",
    });

    expect(input.userContext).toBeUndefined();
  });
});
