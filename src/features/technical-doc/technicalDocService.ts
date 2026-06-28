import { generateMarkdown } from "./markdownGenerator";
import type {
  TechnicalDocGenerationMode,
  TechnicalDocInput,
  TechnicalDocOutput,
} from "./technicalDocTypes";

export async function generateTechnicalDoc(
  input: TechnicalDocInput,
  mode: TechnicalDocGenerationMode = "local",
): Promise<TechnicalDocOutput> {
  if (mode === "ai") {
    throw new Error(
      "AI technical doc generation is not available (AB-22 blocked)",
    );
  }

  return {
    markdown: generateMarkdown(input),
    assumptions: [...input.diagram.assumptions],
    openQuestions: [...input.diagram.openQuestions],
  };
}

export function elementsSignature(
  elements: { id: string; updatedAt: string }[],
): string {
  return elements.map((element) => `${element.id}:${element.updatedAt}`).join("|");
}
