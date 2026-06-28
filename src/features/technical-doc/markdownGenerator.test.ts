import { describe, expect, it, vi } from "vitest";
import { parseDiagram } from "./diagramParser";
import { generateMarkdown, SECTION_HEADINGS } from "./markdownGenerator";
import { buildTechnicalDocInput } from "./technicalDocContext";
import {
  arrow,
  diagramElements,
  ellipse,
  rectangle,
  textElement,
} from "./testFixtures";
import type { ParsedDiagram } from "./technicalDocTypes";

function sampleParsedDiagram(): ParsedDiagram {
  return parseDiagram(
    diagramElements(
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
    ),
  );
}

function buildInput(parsed: ParsedDiagram) {
  return buildTechnicalDocInput(parsed, {
    outputLanguage: "pt-BR",
    docStyle: "detailed",
  });
}

describe("generateMarkdown", () => {
  it("REQ-010: generates Markdown from ParsedDiagram", () => {
    const markdown = generateMarkdown(buildInput(sampleParsedDiagram()));

    expect(typeof markdown).toBe("string");
    expect(markdown.length).toBeGreaterThan(0);
    expect(markdown.startsWith("# Technical Doc")).toBe(true);
  });

  it("REQ-011: includes all required section headings", () => {
    const markdown = generateMarkdown(buildInput(sampleParsedDiagram()));

    expect(markdown).toContain("# Technical Doc");
    for (const heading of SECTION_HEADINGS) {
      expect(markdown).toContain(`## ${heading}`);
    }
  });

  it("REQ-011: places components in Componentes identificados", () => {
    const markdown = generateMarkdown(buildInput(sampleParsedDiagram()));
    const componentsSection = markdown.split("## Fluxo principal")[0] ?? "";

    expect(componentsSection).toContain("Order API");
    expect(componentsSection).toContain("`service`");
    expect(componentsSection).toContain("End User");
    expect(componentsSection).toContain("`actor`");
  });

  it("REQ-011: places relationships in Fluxo principal", () => {
    const markdown = generateMarkdown(buildInput(sampleParsedDiagram()));
    const flowSection =
      markdown.split("## Fluxo principal")[1]?.split("## Integrações")[0] ?? "";

    expect(flowSection).toContain("End User");
    expect(flowSection).toContain("Order API");
    expect(flowSection).toContain("_HTTP_");
  });

  it("REQ-011: places external integrations in Integrações", () => {
    const markdown = generateMarkdown(buildInput(sampleParsedDiagram()));
    const integrationsSection =
      markdown.split("## Integrações")[1]?.split("## Decisões assumidas")[0] ??
      "";

    expect(integrationsSection).toContain("External API");
    expect(integrationsSection).toContain("`external`");
  });

  it("REQ-011: records open questions in Perguntas em aberto", () => {
    const parsed = parseDiagram(
      diagramElements(
        rectangle("rect-1"),
        arrow("arrow-1", { endBindingId: "rect-1" }),
      ),
    );
    const markdown = generateMarkdown(buildInput(parsed));
    const questionsSection =
      markdown.split("## Perguntas em aberto")[1] ?? "";

    expect(questionsSection).toContain(
      "Arrow arrow-1: no clear source component.",
    );
  });

  it("REQ-012: produces pre-formatted Markdown suitable for panel preview", () => {
    const markdown = generateMarkdown(buildInput(sampleParsedDiagram()));

    expect(markdown).toMatch(/^# Technical Doc\n/);
    expect(markdown.split("\n").length).toBeGreaterThan(10);
    expect(markdown.endsWith("\n")).toBe(true);
  });

  it("REQ-013: produces copyable and downloadable Markdown content", () => {
    const markdown = generateMarkdown(buildInput(sampleParsedDiagram()));

    expect(markdown.trim().length).toBeGreaterThan(0);
    expect(new Blob([markdown], { type: "text/markdown" }).size).toBeGreaterThan(
      0,
    );
  });

  it("REQ-014: generates Markdown offline without external calls", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const markdown = generateMarkdown(buildInput(sampleParsedDiagram()));

    expect(markdown).toContain("# Technical Doc");
    expect(fetchSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
  });

  it("uses en-US headings when outputLanguage is en-US", () => {
    const input = buildTechnicalDocInput(sampleParsedDiagram(), {
      outputLanguage: "en-US",
      docStyle: "detailed",
    });
    const markdown = generateMarkdown(input);

    expect(markdown).toContain("## Context");
    expect(markdown).toContain("## Identified components");
    expect(markdown).not.toContain("## Contexto");
  });

  it("includes userContext in Contexto section", () => {
    const input = buildTechnicalDocInput(sampleParsedDiagram(), {
      outputLanguage: "pt-BR",
      docStyle: "detailed",
      userContext: "Deploy in staging first",
    });
    const markdown = generateMarkdown(input);

    expect(markdown).toContain("Contexto do usuário:");
    expect(markdown).toContain("Deploy in staging first");
  });
});
