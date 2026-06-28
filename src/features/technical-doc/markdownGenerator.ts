import type {
  ParsedComponent,
  ParsedDiagram,
  TechnicalDocInput,
  TechnicalDocOutputLanguage,
  TechnicalDocStyle,
} from "./technicalDocTypes";

type SectionKey =
  | "context"
  | "components"
  | "mainFlow"
  | "integrations"
  | "assumptions"
  | "risks"
  | "openQuestions";

const SECTION_LABELS: Record<
  TechnicalDocOutputLanguage,
  Record<SectionKey, string>
> = {
  "pt-BR": {
    context: "Contexto",
    components: "Componentes identificados",
    mainFlow: "Fluxo principal",
    integrations: "Integrações",
    assumptions: "Decisões assumidas",
    risks: "Riscos e limitações",
    openQuestions: "Perguntas em aberto",
  },
  "en-US": {
    context: "Context",
    components: "Identified components",
    mainFlow: "Main flow",
    integrations: "Integrations",
    assumptions: "Assumed decisions",
    risks: "Risks and limitations",
    openQuestions: "Open questions",
  },
};

export const SECTION_HEADINGS = Object.values(SECTION_LABELS["pt-BR"]);

function undeterminedLabel(language: TechnicalDocOutputLanguage): string {
  return language === "pt-BR" ? "(indeterminado)" : "(undetermined)";
}

function componentLabel(
  componentId: string | undefined,
  components: ParsedComponent[],
  language: TechnicalDocOutputLanguage,
): string {
  if (!componentId) {
    return undeterminedLabel(language);
  }

  const component = components.find((item) => item.id === componentId);
  if (!component) {
    return componentId;
  }

  return component.name?.trim() || component.id;
}

function bulletList(items: string[], emptyMessage: string): string {
  if (items.length === 0) {
    return emptyMessage ? `${emptyMessage}\n` : "";
  }

  return `${items.map((item) => `- ${item}`).join("\n")}\n`;
}

function section(title: string, body: string): string {
  return `## ${title}\n\n${body}\n`;
}

function buildContext(
  parsed: ParsedDiagram,
  input: TechnicalDocInput,
  language: TechnicalDocOutputLanguage,
): string {
  const lines: string[] = [];

  if (parsed.title?.trim()) {
    lines.push(`Diagrama: **${parsed.title.trim()}**`);
  } else {
    lines.push(
      language === "pt-BR"
        ? "Documento gerado automaticamente a partir do diagrama analisado (sem IA)."
        : "Document generated automatically from the analyzed diagram (no AI).",
    );
  }

  if (input.userContext) {
    lines.push("");
    lines.push(
      language === "pt-BR" ? "Contexto do usuário:" : "User context:",
    );
    lines.push(`- ${input.userContext}`);
  }

  if (parsed.notes.length > 0) {
    lines.push("");
    lines.push(language === "pt-BR" ? "Notas do diagrama:" : "Diagram notes:");
    for (const note of parsed.notes) {
      lines.push(`- ${note.text.trim()}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function buildComponents(
  parsed: ParsedDiagram,
  style: TechnicalDocStyle,
  language: TechnicalDocOutputLanguage,
): string {
  const unnamed = language === "pt-BR" ? "(sem nome)" : "(unnamed)";
  const items = parsed.components.map((component) => {
    const name = component.name?.trim() || unnamed;
    if (style === "concise") {
      return `**${name}** (\`${component.type}\`)`;
    }

    return `**${name}** (\`${component.type}\`, id: \`${component.id}\`)`;
  });

  const empty =
    language === "pt-BR"
      ? "_Nenhum componente identificado._"
      : "_No components identified._";

  return bulletList(items, empty);
}

function buildMainFlow(
  parsed: ParsedDiagram,
  language: TechnicalDocOutputLanguage,
): string {
  const items = parsed.relationships.map((relationship) => {
    const from = componentLabel(
      relationship.from,
      parsed.components,
      language,
    );
    const to = componentLabel(relationship.to, parsed.components, language);
    const label = relationship.label ? ` — _${relationship.label}_` : "";
    return `**${from}** → **${to}**${label}`;
  });

  const empty =
    language === "pt-BR"
      ? "_Nenhuma relação identificada._"
      : "_No relationships identified._";

  return bulletList(items, empty);
}

function buildIntegrations(
  parsed: ParsedDiagram,
  language: TechnicalDocOutputLanguage,
  style: TechnicalDocStyle,
): string {
  const integrationComponents = parsed.components.filter(
    (component) =>
      component.type === "external" ||
      component.type === "actor" ||
      component.type === "database",
  );
  const items: string[] = [];

  for (const component of integrationComponents) {
    const name = component.name?.trim() || component.id;
    const connected = parsed.relationships.filter(
      (relationship) =>
        relationship.from === component.id || relationship.to === component.id,
    );

    if (connected.length === 0) {
      const suffix =
        style === "concise"
          ? ""
          : language === "pt-BR"
            ? " — sem conexões registradas"
            : " — no recorded connections";
      items.push(`**${name}** (\`${component.type}\`)${suffix}`);
      continue;
    }

    for (const relationship of connected) {
      const other =
        relationship.from === component.id
          ? componentLabel(relationship.to, parsed.components, language)
          : componentLabel(relationship.from, parsed.components, language);
      const direction =
        relationship.from === component.id
          ? language === "pt-BR"
            ? `conecta com **${other}**`
            : `connects to **${other}**`
          : language === "pt-BR"
            ? `recebe de **${other}**`
            : `receives from **${other}**`;
      const label = relationship.label ? ` (_${relationship.label}_)` : "";
      items.push(`**${name}** (\`${component.type}\`) ${direction}${label}`);
    }
  }

  const empty =
    language === "pt-BR"
      ? "_Nenhuma integração externa ou ator identificada._"
      : "_No external integrations or actors identified._";

  return bulletList(items, empty);
}

function buildRisks(
  parsed: ParsedDiagram,
  language: TechnicalDocOutputLanguage,
  style: TechnicalDocStyle,
): string {
  const items: string[] = [];
  const unknownCount = parsed.components.filter(
    (component) => component.type === "unknown",
  ).length;

  if (unknownCount > 0) {
    items.push(
      language === "pt-BR"
        ? `${unknownCount} componente(s) com tipo \`unknown\` — classificação incerta.`
        : `${unknownCount} component(s) with \`unknown\` type — uncertain classification.`,
    );
  }

  const incompleteRelations = parsed.relationships.filter(
    (relationship) => !relationship.from || !relationship.to,
  ).length;

  if (incompleteRelations > 0) {
    items.push(
      language === "pt-BR"
        ? `${incompleteRelations} relação(ões) com origem ou destino indeterminado.`
        : `${incompleteRelations} relationship(s) with undetermined source or target.`,
    );
  }

  if (style === "detailed") {
    items.push(
      language === "pt-BR"
        ? "Documento gerado offline sem inferência de IA; detalhes podem estar incompletos."
        : "Document generated offline without AI inference; details may be incomplete.",
    );
  }

  return bulletList(items, "");
}

export function generateMarkdown(input: TechnicalDocInput): string {
  const parsed = input.diagram;
  const language = input.outputLanguage;
  const style = input.docStyle;
  const labels = SECTION_LABELS[language];
  const assumptionsEmpty =
    language === "pt-BR"
      ? "_Nenhuma decisão registrada._"
      : "_No decisions recorded._";
  const questionsEmpty =
    language === "pt-BR"
      ? "_Nenhuma pergunta em aberto._"
      : "_No open questions._";

  const sections = [
    "# Technical Doc",
    "",
    section(labels.context, buildContext(parsed, input, language)),
    section(labels.components, buildComponents(parsed, style, language)),
    section(labels.mainFlow, buildMainFlow(parsed, language)),
    section(labels.integrations, buildIntegrations(parsed, language, style)),
    section(
      labels.assumptions,
      bulletList(parsed.assumptions, assumptionsEmpty),
    ),
    section(labels.risks, buildRisks(parsed, language, style)),
    section(
      labels.openQuestions,
      bulletList(parsed.openQuestions, questionsEmpty),
    ),
  ];

  return `${sections.join("\n").trimEnd()}\n`;
}
