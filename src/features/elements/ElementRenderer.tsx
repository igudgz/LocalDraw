import { ArrowElement } from "./ArrowElement";
import { EllipseElement } from "./EllipseElement";
import { RectangleElement } from "./RectangleElement";
import { TextElement } from "./TextElement";
import type { LocalDrawElement } from "./elementTypes";

type ElementRendererProps = {
  elements: LocalDrawElement[];
  editingElementId?: string | null;
};

export function ElementRenderer({
  elements,
  editingElementId = null,
}: ElementRendererProps) {
  return (
    <>
      {elements.map((element) => {
        switch (element.type) {
          case "rectangle":
            return <RectangleElement key={element.id} element={element} />;
          case "ellipse":
            return <EllipseElement key={element.id} element={element} />;
          case "arrow":
            return <ArrowElement key={element.id} element={element} />;
          case "text":
            if (element.id === editingElementId) {
              return null;
            }

            return <TextElement key={element.id} element={element} />;
        }
      })}
    </>
  );
}
