export type ComponentType =
  | "service"
  | "database"
  | "external"
  | "actor"
  | "unknown";

export type ParsedComponent = {
  id: string;
  name?: string;
  type: ComponentType;
  elementId: string;
};

export type ParsedRelationship = {
  id: string;
  from?: string;
  to?: string;
  label?: string;
  elementId: string;
};

export type ParsedNote = {
  id: string;
  text: string;
  elementId: string;
};

export type ParsedDiagram = {
  title?: string;
  components: ParsedComponent[];
  relationships: ParsedRelationship[];
  notes: ParsedNote[];
  assumptions: string[];
  openQuestions: string[];
};

export type TechnicalDocOutputLanguage = "pt-BR" | "en-US";

export type TechnicalDocStyle = "concise" | "detailed";

export type TechnicalDocOptions = {
  userContext?: string;
  outputLanguage: TechnicalDocOutputLanguage;
  docStyle: TechnicalDocStyle;
};

export type TechnicalDocInput = {
  diagram: ParsedDiagram;
  userContext?: string;
  outputLanguage: TechnicalDocOutputLanguage;
  docStyle: TechnicalDocStyle;
  promptVersion: string;
};

export type TechnicalDocOutput = {
  markdown: string;
  assumptions: string[];
  openQuestions: string[];
};

export type TechnicalDocAnalysis = {
  input: TechnicalDocInput;
  output: TechnicalDocOutput;
  elementsSignature: string;
};

export type TechnicalDocGenerationMode = "local" | "ai";
