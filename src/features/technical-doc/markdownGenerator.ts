import type {
  ParsedComponent,
  ParsedDiagram,
} from "./technicalDocTypes";

const SECTION_HEADINGS = [
  "Contexto",
  "Componentes identificados",
  "Fluxo principal",
  "Integrações",
  "Decisões assumidas",
  "Riscos e limitações",
  "Perguntas em aberto",
] as const;

function componentLabel(
  componentId: string | undefined,
  components: ParsedComponent[],
): string {
  if (!componentId) {
    return "(indeterminado)";
  }

  const component = components.find((item) => item.id === componentId);
  if (!component) {
    return componentId;
  }

  return component.name?.trim() || component.id;
}

function bulletList(items: string[], emptyMessage: string): string {
  if (items.length === 0) {
    return `${emptyMessage}\n`;
  }

  return `${items.map((item) => `- ${item}`).join("\n")}\n`;
}

function section(title: string, body: string): string {
  return `## ${title}\n\n${body}\n`;
}

function buildContext(parsed: ParsedDiagram): string {
  const lines: string[] = [];

  if (parsed.title?.trim()) {
    lines.push(`Diagrama: **${parsed.title.trim()}**`);
  } else {
    lines.push(
      "Documento gerado automaticamente a partir do diagrama analisado (sem IA).",
    );
  }

  if (parsed.notes.length > 0) {
    lines.push("");
    lines.push("Notas do diagrama:");
    for (const note of parsed.notes) {
      lines.push(`- ${note.text.trim()}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function buildComponents(parsed: ParsedDiagram): string {
  const items = parsed.components.map((component) => {
    const name = component.name?.trim() || "(sem nome)";
    return `**${name}** (\`${component.type}\`, id: \`${component.id}\`)`;
  });

  return bulletList(items, "_Nenhum componente identificado._");
}

function buildMainFlow(parsed: ParsedDiagram): string {
  const items = parsed.relationships.map((relationship) => {
    const from = componentLabel(relationship.from, parsed.components);
    const to = componentLabel(relationship.to, parsed.components);
    const label = relationship.label ? ` — _${relationship.label}_` : "";
    return `**${from}** → **${to}**${label}`;
  });

  return bulletList(items, "_Nenhuma relação identificada._");
}

function buildIntegrations(parsed: ParsedDiagram): string {
  const integrationComponents = parsed.components.filter(
    (component) => component.type === "external" || component.type === "actor",
  );
  const items: string[] = [];

  for (const component of integrationComponents) {
    const name = component.name?.trim() || component.id;
    const connected = parsed.relationships.filter(
      (relationship) =>
        relationship.from === component.id || relationship.to === component.id,
    );

    if (connected.length === 0) {
      items.push(
        `**${name}** (\`${component.type}\`) — sem conexões registradas`,
      );
      continue;
    }

    for (const relationship of connected) {
      const other =
        relationship.from === component.id
          ? componentLabel(relationship.to, parsed.components)
          : componentLabel(relationship.from, parsed.components);
      const direction =
        relationship.from === component.id
          ? `conecta com **${other}**`
          : `recebe de **${other}**`;
      const label = relationship.label ? ` (_${relationship.label}_)` : "";
      items.push(`**${name}** (\`${component.type}\`) ${direction}${label}`);
    }
  }

  return bulletList(items, "_Nenhuma integração externa ou ator identificada._");
}

function buildRisks(parsed: ParsedDiagram): string {
  const items: string[] = [];
  const unknownCount = parsed.components.filter(
    (component) => component.type === "unknown",
  ).length;

  if (unknownCount > 0) {
    items.push(
      `${unknownCount} componente(s) com tipo \`unknown\` — classificação incerta.`,
    );
  }

  const incompleteRelations = parsed.relationships.filter(
    (relationship) => !relationship.from || !relationship.to,
  ).length;

  if (incompleteRelations > 0) {
    items.push(
      `${incompleteRelations} relação(ões) com origem ou destino indeterminado.`,
    );
  }

  items.push(
    "Documento gerado offline sem inferência de IA; detalhes podem estar incompletos.",
  );

  return bulletList(items, "");
}

export function generateMarkdown(parsed: ParsedDiagram): string {
  const sections = [
    "# Technical Doc",
    "",
    section("Contexto", buildContext(parsed)),
    section("Componentes identificados", buildComponents(parsed)),
    section("Fluxo principal", buildMainFlow(parsed)),
    section("Integrações", buildIntegrations(parsed)),
    section("Decisões assumidas", bulletList(parsed.assumptions, "_Nenhuma decisão registrada._")),
    section("Riscos e limitações", buildRisks(parsed)),
    section(
      "Perguntas em aberto",
      bulletList(parsed.openQuestions, "_Nenhuma pergunta em aberto._"),
    ),
  ];

  return `${sections.join("\n").trimEnd()}\n`;
}

export { SECTION_HEADINGS };
