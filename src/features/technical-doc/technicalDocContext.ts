import type {
  ParsedDiagram,
  TechnicalDocInput,
  TechnicalDocOptions,
} from "./technicalDocTypes";

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
  };
}
