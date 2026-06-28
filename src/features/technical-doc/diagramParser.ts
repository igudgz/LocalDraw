import type {
  ArrowElement,
  EllipseElement,
  LocalDrawElement,
  RectangleElement,
  TextElement,
} from "../elements/elementTypes";
import {
  elementCenter,
  isPointInShape,
} from "../elements/elementGeometry";
import type {
  ComponentType,
  ParsedComponent,
  ParsedDiagram,
  ParsedNote,
  ParsedRelationship,
} from "./technicalDocTypes";

const ACTOR_KEYWORDS =
  /\b(user|actor|admin|client|person|cliente|usuário|usuario)\b/i;
const EXTERNAL_KEYWORDS =
  /\b(external|api|gateway|third[- ]party|externo)\b/i;
const DATABASE_KEYWORDS =
  /\b(db|database|postgres|postgresql|mysql|mongodb|redis|storage|sql)\b/i;

function componentId(elementId: string): string {
  return `component-${elementId}`;
}

function relationshipId(elementId: string): string {
  return `relationship-${elementId}`;
}

function noteId(elementId: string): string {
  return `note-${elementId}`;
}

function classifyEllipse(text?: string): ComponentType {
  if (!text || text.trim() === "") {
    return "unknown";
  }

  if (DATABASE_KEYWORDS.test(text)) {
    return "database";
  }

  const isActor = ACTOR_KEYWORDS.test(text);
  const isExternal = EXTERNAL_KEYWORDS.test(text);

  if (isActor && !isExternal) {
    return "actor";
  }

  if (isExternal && !isActor) {
    return "external";
  }

  return "unknown";
}

function classifyRectangle(text?: string): ComponentType {
  if (!text || text.trim() === "") {
    return "service";
  }

  if (DATABASE_KEYWORDS.test(text)) {
    return "database";
  }

  return "service";
}

function buildElementIndex(
  elements: LocalDrawElement[],
): Map<string, LocalDrawElement> {
  return new Map(elements.map((element) => [element.id, element]));
}

function buildComponentMap(
  elements: LocalDrawElement[],
): Map<string, ParsedComponent> {
  const map = new Map<string, ParsedComponent>();

  for (const element of elements) {
    switch (element.type) {
      case "rectangle": {
        map.set(element.id, {
          id: componentId(element.id),
          name: element.text?.trim() || undefined,
          type: classifyRectangle(element.text),
          elementId: element.id,
        });
        break;
      }
      case "ellipse":
        map.set(element.id, {
          id: componentId(element.id),
          name: element.text?.trim() || undefined,
          type: classifyEllipse(element.text),
          elementId: element.id,
        });
        break;
      default:
        break;
    }
  }

  return map;
}

function applyOverlappingTextNames(
  elements: LocalDrawElement[],
  componentMap: Map<string, ParsedComponent>,
): Set<string> {
  const consumedTextIds = new Set<string>();
  const shapes = elements.filter(
    (element): element is RectangleElement | EllipseElement =>
      element.type === "rectangle" || element.type === "ellipse",
  );
  const texts = elements.filter(
    (element): element is TextElement => element.type === "text",
  );

  for (const textElement of texts) {
    const { x, y } = elementCenter(textElement);

    for (const shape of shapes) {
      if (!isPointInShape(x, y, shape)) {
        continue;
      }

      const component = componentMap.get(shape.id);
      if (!component) {
        continue;
      }

      const text = textElement.text.trim();
      if (text) {
        component.name = text;
      }

      consumedTextIds.add(textElement.id);
      break;
    }
  }

  return consumedTextIds;
}

function resolveComponentRef(
  bindingId: string | undefined,
  elementIndex: Map<string, LocalDrawElement>,
  componentMap: Map<string, ParsedComponent>,
): string | undefined {
  if (!bindingId) {
    return undefined;
  }

  const target = elementIndex.get(bindingId);
  if (!target || (target.type !== "rectangle" && target.type !== "ellipse")) {
    return undefined;
  }

  return componentMap.get(bindingId)?.id;
}

function describeBindingIssue(
  role: "source" | "target",
  bindingId: string | undefined,
  resolvedId: string | undefined,
  elementIndex: Map<string, LocalDrawElement>,
): string | undefined {
  if (!bindingId) {
    return `no clear ${role} component`;
  }

  if (resolvedId) {
    return undefined;
  }

  const target = elementIndex.get(bindingId);
  if (!target) {
    return `references missing ${role} element ${bindingId}`;
  }

  return `${role} is not a recognizable component`;
}

function parseArrows(
  elements: LocalDrawElement[],
  elementIndex: Map<string, LocalDrawElement>,
  componentMap: Map<string, ParsedComponent>,
): { relationships: ParsedRelationship[]; openQuestions: string[] } {
  const relationships: ParsedRelationship[] = [];
  const openQuestions: string[] = [];
  const arrows = elements.filter(
    (element): element is ArrowElement => element.type === "arrow",
  );

  for (const arrow of arrows) {
    const from = resolveComponentRef(
      arrow.startBindingId,
      elementIndex,
      componentMap,
    );
    const to = resolveComponentRef(
      arrow.endBindingId,
      elementIndex,
      componentMap,
    );

    relationships.push({
      id: relationshipId(arrow.id),
      from,
      to,
      label: arrow.label?.trim() || undefined,
      elementId: arrow.id,
    });

    const issues = [
      describeBindingIssue("source", arrow.startBindingId, from, elementIndex),
      describeBindingIssue("target", arrow.endBindingId, to, elementIndex),
    ].filter((issue): issue is string => issue !== undefined);

    if (issues.length > 0) {
      openQuestions.push(`Arrow ${arrow.id}: ${issues.join("; ")}.`);
    }
  }

  return { relationships, openQuestions };
}

function parseNotes(
  elements: LocalDrawElement[],
  consumedTextIds: Set<string>,
): ParsedNote[] {
  return elements
    .filter(
      (element): element is TextElement =>
        element.type === "text" && !consumedTextIds.has(element.id),
    )
    .map((textElement) => ({
      id: noteId(textElement.id),
      text: textElement.text,
      elementId: textElement.id,
    }));
}

export function parseDiagram(elements: LocalDrawElement[]): ParsedDiagram {
  const elementIndex = buildElementIndex(elements);
  const componentMap = buildComponentMap(elements);
  const consumedTextIds = applyOverlappingTextNames(elements, componentMap);
  const { relationships, openQuestions } = parseArrows(
    elements,
    elementIndex,
    componentMap,
  );
  const notes = parseNotes(elements, consumedTextIds);

  return {
    components: Array.from(componentMap.values()),
    relationships,
    notes,
    assumptions: [],
    openQuestions,
  };
}
