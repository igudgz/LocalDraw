import { describe, expect, it } from "vitest";
import { buildTechnicalDocInput } from "./technicalDocContext";
import { parseDiagram } from "./diagramParser";
import { generateMarkdown } from "./markdownGenerator";
import {
  arrow,
  diagramElements,
  ellipse,
  rectangle,
} from "./testFixtures";
import {
  elementsSignature,
  generateTechnicalDoc,
} from "./technicalDocService";
import type { ParsedDiagram } from "./technicalDocTypes";

function sampleParsedDiagram(): ParsedDiagram {
  return parseDiagram(
    diagramElements(
      rectangle("rect-api", { text: "Order API" }),
      ellipse("ellipse-user", { text: "End User" }),
      arrow("arrow-1", {
        label: "HTTP",
        startBindingId: "ellipse-user",
        endBindingId: "rect-api",
      }),
    ),
  );
}

function buildInput(parsed: ParsedDiagram) {
  return buildTechnicalDocInput(parsed, {
    outputLanguage: "pt-BR",
    docStyle: "detailed",
  });
}

describe("generateTechnicalDoc", () => {
  it("REQ-018: generates TechnicalDocOutput without external calls", async () => {
    const parsed = sampleParsedDiagram();
    const input = buildInput(parsed);
    const output = await generateTechnicalDoc(input, "local");

    expect(typeof output.markdown).toBe("string");
    expect(output.markdown.length).toBeGreaterThan(0);
    expect(output.markdown).toBe(generateMarkdown(input));
  });

  it("REQ-018: maps assumptions and openQuestions from diagram", async () => {
    const parsed = sampleParsedDiagram();
    const output = await generateTechnicalDoc(buildInput(parsed), "local");

    expect(output.assumptions).toEqual(parsed.assumptions);
    expect(output.openQuestions).toEqual(parsed.openQuestions);
    expect(output.assumptions).not.toBe(parsed.assumptions);
    expect(output.openQuestions).not.toBe(parsed.openQuestions);
  });

  it("REQ-019: local fallback returns markdown usable offline", async () => {
    const output = await generateTechnicalDoc(
      buildInput(sampleParsedDiagram()),
      "local",
    );

    expect(output.markdown.startsWith("# Technical Doc")).toBe(true);
    expect(output.markdown).toContain("## Contexto");
  });

  it("REQ-018: AI mode rejects without calling external APIs", async () => {
    await expect(
      generateTechnicalDoc(buildInput(sampleParsedDiagram()), "ai"),
    ).rejects.toThrow("AB-22 blocked");
  });
});

describe("elementsSignature", () => {
  it("changes when element updatedAt changes", () => {
    const first = elementsSignature([
      rectangle("rect-1", { updatedAt: "2026-06-28T00:00:00.000Z" }),
    ]);
    const second = elementsSignature([
      rectangle("rect-1", { updatedAt: "2026-06-28T01:00:00.000Z" }),
    ]);

    expect(first).not.toBe(second);
  });
});
