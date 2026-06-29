import { estimateTextBounds } from "./elementGeometry";
import type { BaseElement, LocalDrawElement, TextElement } from "./elementTypes";

export type ElementStylePatch = Partial<
  Pick<
    BaseElement,
    "strokeColor" | "backgroundColor" | "strokeWidth" | "opacity"
  >
> &
  Partial<Pick<TextElement, "fontSize" | "fontFamily">>;

export function applyElementStylePatch(
  element: LocalDrawElement,
  patch: ElementStylePatch,
  updatedAt: string,
): LocalDrawElement {
  const withBase: LocalDrawElement = {
    ...element,
    ...(patch.strokeColor !== undefined
      ? { strokeColor: patch.strokeColor }
      : {}),
    ...(patch.backgroundColor !== undefined
      ? { backgroundColor: patch.backgroundColor }
      : {}),
    ...(patch.strokeWidth !== undefined
      ? { strokeWidth: patch.strokeWidth }
      : {}),
    ...(patch.opacity !== undefined ? { opacity: patch.opacity } : {}),
    updatedAt,
  };

  if (withBase.type !== "text") {
    return withBase;
  }

  const withText: TextElement = {
    ...withBase,
    ...(patch.fontSize !== undefined ? { fontSize: patch.fontSize } : {}),
    ...(patch.fontFamily !== undefined
      ? { fontFamily: patch.fontFamily }
      : {}),
  };

  if (patch.fontSize !== undefined) {
    const { width, height } = estimateTextBounds(
      withText.text,
      patch.fontSize,
    );
    return { ...withText, width, height };
  }

  return withText;
}
