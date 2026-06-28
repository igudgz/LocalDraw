import { generateMarkdown } from "./markdownGenerator";
import type { TechnicalDocInput, TechnicalDocOutput } from "./technicalDocTypes";

export interface TechnicalDocGenerator {
  generate(input: TechnicalDocInput): Promise<TechnicalDocOutput>;
}

export function generateTechnicalDocLocal(
  input: TechnicalDocInput,
): TechnicalDocOutput {
  return {
    markdown: generateMarkdown(input.diagram),
    assumptions: [...input.diagram.assumptions],
    openQuestions: [...input.diagram.openQuestions],
  };
}

export const aiTechnicalDocGeneratorStub: TechnicalDocGenerator = {
  async generate(_input: TechnicalDocInput): Promise<TechnicalDocOutput> {
    throw new Error(
      "AI technical doc generation is not available (AB-22 blocked)",
    );
  },
};
