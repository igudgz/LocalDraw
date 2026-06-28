import type {
  ParsedDiagram,
  TechnicalDocInput,
  TechnicalDocOptions,
} from "./technicalDocTypes";

export const TECHNICAL_DOC_PROMPT_VERSION = "technical-doc-v1";

export function buildTechnicalDocInput(
  parsed: ParsedDiagram,
  options: TechnicalDocOptions,
): TechnicalDocInput {
  const userContext = options.userContext?.trim();

  return {
    diagram: parsed,
    ...(userContext ? { userContext } : {}),
    outputLanguage: options.outputLanguage,
    docStyle: options.docStyle,
    promptVersion: TECHNICAL_DOC_PROMPT_VERSION,
  };
}
