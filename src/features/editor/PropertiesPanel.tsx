import { useEditorDispatch, useEditorState } from "./EditorContext";
import { Input } from "../../shared/ui/Input";
import { Panel } from "../../shared/ui/Panel";

const FONT_FAMILIES = [
  {
    label: "Inter",
    value: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Times New Roman", value: '"Times New Roman", serif' },
] as const;

export function PropertiesPanel() {
  const state = useEditorState();
  const dispatch = useEditorDispatch();

  const selectedId = state.selectedElementIds[0];
  const element = selectedId
    ? state.elements.find((candidate) => candidate.id === selectedId)
    : undefined;

  if (!element) {
    return null;
  }

  const updateStyle = (
    fields: Partial<{
      strokeColor: string;
      backgroundColor: string;
      strokeWidth: number;
      opacity: number;
      fontSize: number;
      fontFamily: string;
    }>,
  ) => {
    dispatch({
      type: "update-element-style",
      elementId: element.id,
      ...fields,
    });
  };

  const fontFamilyOptions =
    element.type === "text" &&
    !FONT_FAMILIES.some((option) => option.value === element.fontFamily)
      ? [
          ...FONT_FAMILIES,
          { label: element.fontFamily, value: element.fontFamily },
        ]
      : FONT_FAMILIES;

  return (
    <Panel className="properties-panel" aria-label="Element properties">
      <div className="panel-heading">
        <h2>Properties</h2>
        <p>{element.type}</p>
      </div>

      <div className="properties-form">
        <label className="properties-field">
          <span>Stroke color</span>
          <Input
            className="properties-color-input"
            type="color"
            value={element.strokeColor}
            onChange={(event) =>
              updateStyle({ strokeColor: event.target.value })
            }
          />
        </label>

        <label className="properties-field">
          <span>Background color</span>
          <Input
            className="properties-color-input"
            type="color"
            value={element.backgroundColor}
            onChange={(event) =>
              updateStyle({ backgroundColor: event.target.value })
            }
          />
        </label>

        <label className="properties-field">
          <span>Stroke width ({element.strokeWidth})</span>
          <Input
            className="properties-range-input"
            type="range"
            min={1}
            max={20}
            step={1}
            value={element.strokeWidth}
            onChange={(event) =>
              updateStyle({ strokeWidth: Number(event.target.value) })
            }
          />
        </label>

        <label className="properties-field">
          <span>Opacity ({element.opacity.toFixed(2)})</span>
          <Input
            className="properties-range-input"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={element.opacity}
            onChange={(event) =>
              updateStyle({ opacity: Number(event.target.value) })
            }
          />
        </label>

        {element.type === "text" ? (
          <>
            <label className="properties-field">
              <span>Font size</span>
              <Input
                className="properties-number-input"
                type="number"
                min={8}
                max={96}
                value={element.fontSize}
                onChange={(event) =>
                  updateStyle({ fontSize: Number(event.target.value) })
                }
              />
            </label>

            <label className="properties-field">
              <span>Font family</span>
              <select
                className="properties-select"
                value={element.fontFamily}
                onChange={(event) =>
                  updateStyle({ fontFamily: event.target.value })
                }
              >
                {fontFamilyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : null}
      </div>
    </Panel>
  );
}
