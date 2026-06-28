import type {
  ArrowElement,
  EllipseElement,
  LocalDrawElement,
  RectangleElement,
  TextElement,
} from "../elements/elementTypes";
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

function elementCenter(element: LocalDrawElement): { x: number; y: number } {
  return {
    x: element.x + element.width / 2,
    y: element.y + element.height / 2,
  };
}

function isPointInRectangle(
  px: number,
  py: number,
  rect: RectangleElement,
): boolean {
  return (
    px >= rect.x &&
    px <= rect.x + rect.width &&
    py >= rect.y &&
    py <= rect.y + rect.height
  );
}

function isPointInEllipse(
  px: number,
  py: number,
  ellipse: EllipseElement,
): boolean {
  const cx = ellipse.x + ellipse.width / 2;
  const cy = ellipse.y + ellipse.height / 2;
  const rx = ellipse.width / 2;
  const ry = ellipse.height / 2;

  if (rx === 0 || ry === 0) {
    return false;
  }

  const dx = (px - cx) / rx;
  const dy = (py - cy) / ry;

  return dx * dx + dy * dy <= 1;
}

function isPointInShape(
  px: number,
  py: number,
  element: RectangleElement | EllipseElement,
): boolean {
  switch (element.type) {
    case "rectangle":
      return isPointInRectangle(px, py, element);
    case "ellipse":
      return isPointInEllipse(px, py, element);
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}

function buildComponentMap(
  elements: LocalDrawElement[],
): Map<string, ParsedComponent> {
  const map = new Map<string, ParsedComponent>();

  for (const element of elements) {
    switch (element.type) {
      case "rectangle":
        map.set(element.id, {
          id: componentId(element.id),
          name: element.text?.trim() || undefined,
          type: "service",
          elementId: element.id,
        });
        break;
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
  elements: LocalDrawElement[],
  componentMap: Map<string, ParsedComponent>,
): string | undefined {
  if (!bindingId) {
    return undefined;
  }

  const target = elements.find((element) => element.id === bindingId);
  if (!target || (target.type !== "rectangle" && target.type !== "ellipse")) {
    return undefined;
  }

  return componentMap.get(bindingId)?.id;
}

function parseArrows(
  elements: LocalDrawElement[],
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
      elements,
      componentMap,
    );
    const to = resolveComponentRef(arrow.endBindingId, elements, componentMap);

    relationships.push({
      id: relationshipId(arrow.id),
      from,
      to,
      label: arrow.label?.trim() || undefined,
      elementId: arrow.id,
    });

    if (!arrow.startBindingId) {
      openQuestions.push(`Arrow ${arrow.id} has no clear source component.`);
    } else if (!from) {
      const target = elements.find((element) => element.id === arrow.startBindingId);
      if (!target) {
        openQuestions.push(
          `Arrow ${arrow.id} references missing source element ${arrow.startBindingId}.`,
        );
      } else {
        openQuestions.push(
          `Arrow ${arrow.id} source is not a recognizable component.`,
        );
      }
    }

    if (!arrow.endBindingId) {
      openQuestions.push(`Arrow ${arrow.id} has no clear target component.`);
    } else if (!to) {
      const target = elements.find((element) => element.id === arrow.endBindingId);
      if (!target) {
        openQuestions.push(
          `Arrow ${arrow.id} references missing target element ${arrow.endBindingId}.`,
        );
      } else {
        openQuestions.push(
          `Arrow ${arrow.id} target is not a recognizable component.`,
        );
      }
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
  const componentMap = buildComponentMap(elements);
  const consumedTextIds = applyOverlappingTextNames(elements, componentMap);
  const { relationships, openQuestions } = parseArrows(elements, componentMap);
  const notes = parseNotes(elements, consumedTextIds);

  return {
    components: Array.from(componentMap.values()),
    relationships,
    notes,
    assumptions: [],
    openQuestions,
  };
}
