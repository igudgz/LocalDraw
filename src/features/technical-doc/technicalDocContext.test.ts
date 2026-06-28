import { describe, expect, it } from "vitest";
import {
  TECHNICAL_DOC_PROMPT_VERSION,
  buildTechnicalDocInput,
} from "./technicalDocContext";
import { parseDiagram } from "./diagramParser";
import { rectangle } from "./testFixtures";

function sampleParsedDiagram() {
  return parseDiagram([rectangle("rect-api", { text: "Order API" })]);
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
    expect(input.promptVersion).toBe(TECHNICAL_DOC_PROMPT_VERSION);
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
