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
