import { useEffect, useRef, useState } from "react";
import {
  DrawPreviewOverlay,
  SharedArrowheadMarker,
} from "./DrawPreviewOverlay";
import { ArrowLabelEditorOverlay } from "./ArrowLabelEditorOverlay";
import { TextEditorOverlay } from "./TextEditorOverlay";
import { ElementRenderer } from "../elements/ElementRenderer";
import { SelectionBox } from "../selection/SelectionBox";
import {
  findElementById,
  hitTestElementAtPoint,
  type CanvasPoint,
} from "../selection/selectionUtils";
import {
  createDragDrawSession,
  createElementFromDrawSession,
  getDrawPreview,
  isDragDrawToolId,
  shouldCommitDrawPreview,
  type DragDrawSession,
  type DrawPreview,
} from "../tools/dragDrawTool";
import {
  createSelectDragSession,
  getDraggedElementPosition,
  selectToolId,
  type SelectDragSession,
} from "../tools/selectTool";
import {
  createTextElement,
  DEFAULT_TEXT,
  textToolId,
} from "../tools/textTool";
import type { EditorTool } from "./editorTypes";
import type { Dispatch, PointerEvent, WheelEvent } from "react";
import type { EditorAction } from "./editorActions";
import type { EditorState } from "./editorTypes";

const CANVAS_WIDTH = 4000;
const CANVAS_HEIGHT = 3000;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const DEFAULT_VIEWPORT_SIZE = {
  width: 1200,
  height: 800,
};

const TOOL_VIEWPORT_CLASS: Partial<Record<EditorTool, string>> = {
  select: "is-select-tool",
  rectangle: "is-rectangle-tool",
  ellipse: "is-ellipse-tool",
  arrow: "is-arrow-tool",
  text: "is-text-tool",
};

type EditorViewportProps = {
  dispatch: Dispatch<EditorAction>;
  state: EditorState;
};

type ViewportSize = {
  width: number;
  height: number;
};

type PanSession = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startScrollX: number;
  startScrollY: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampViewportPosition(
  scrollX: number,
  scrollY: number,
  zoom: number,
  viewportSize: ViewportSize,
) {
  const maxScrollX = Math.max(0, CANVAS_WIDTH - viewportSize.width / zoom);
  const maxScrollY = Math.max(0, CANVAS_HEIGHT - viewportSize.height / zoom);

  return {
    scrollX: clamp(scrollX, 0, maxScrollX),
    scrollY: clamp(scrollY, 0, maxScrollY),
  };
}

function releasePointerCapture(
  event: PointerEvent<SVGSVGElement>,
  pointerId: number,
) {
  if (event.currentTarget.hasPointerCapture(pointerId)) {
    event.currentTarget.releasePointerCapture(pointerId);
  }
}

export function EditorViewport({ dispatch, state }: EditorViewportProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const panSessionRef = useRef<PanSession | null>(null);
  const selectSessionRef = useRef<SelectDragSession | null>(null);
  const drawSessionRef = useRef<DragDrawSession | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>(
    DEFAULT_VIEWPORT_SIZE,
  );
  const [pointerPosition, setPointerPosition] = useState<CanvasPoint | null>(
    null,
  );
  const [drawPreview, setDrawPreview] = useState<DrawPreview | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const [editingArrowLabelId, setEditingArrowLabelId] = useState<string | null>(
    null,
  );
  const [draftArrowLabel, setDraftArrowLabel] = useState("");

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const updateViewportSize = () => {
      const rect = svg.getBoundingClientRect();

      setViewportSize({
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      });
    };

    updateViewportSize();

    const resizeObserver = new ResizeObserver(updateViewportSize);
    resizeObserver.observe(svg);

    return () => resizeObserver.disconnect();
  }, []);

  const viewport = state.viewport;
  const boundedPosition = clampViewportPosition(
    viewport.scrollX,
    viewport.scrollY,
    viewport.zoom,
    viewportSize,
  );
  const viewBoxWidth = viewportSize.width / viewport.zoom;
  const viewBoxHeight = viewportSize.height / viewport.zoom;
  const viewBox = `${boundedPosition.scrollX} ${boundedPosition.scrollY} ${viewBoxWidth} ${viewBoxHeight}`;

  const setViewport = (nextViewport: EditorState["viewport"]) => {
    dispatch({ type: "set-viewport", viewport: nextViewport });
  };

  const startTextEditing = (elementId: string, text: string) => {
    setEditingTextId(elementId);
    setDraftText(text);
    dispatch({ type: "set-selection", elementId });
  };

  const commitTextEdit = () => {
    if (editingTextId === null) {
      return;
    }

    const trimmed = draftText.trim();
    const finalText = trimmed === "" ? DEFAULT_TEXT : trimmed;

    dispatch({
      type: "update-element-text",
      elementId: editingTextId,
      text: finalText,
    });
    setEditingTextId(null);
    setDraftText("");
  };

  const startArrowLabelEditing = (elementId: string, label?: string) => {
    setEditingArrowLabelId(elementId);
    setDraftArrowLabel(label ?? "");
    dispatch({ type: "set-selection", elementId });
  };

  const commitArrowLabelEdit = () => {
    if (editingArrowLabelId === null) {
      return;
    }

    dispatch({
      type: "update-element-label",
      elementId: editingArrowLabelId,
      label: draftArrowLabel.trim(),
    });
    setEditingArrowLabelId(null);
    setDraftArrowLabel("");
  };

  const getCanvasPoint = (
    event: PointerEvent<SVGSVGElement> | WheelEvent<SVGSVGElement>,
  ): CanvasPoint => {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: boundedPosition.scrollX + (event.clientX - rect.left) / viewport.zoom,
      y: boundedPosition.scrollY + (event.clientY - rect.top) / viewport.zoom,
    };
  };

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();
    const nextZoom = clamp(
      viewport.zoom * (event.deltaY > 0 ? 0.9 : 1.1),
      MIN_ZOOM,
      MAX_ZOOM,
    );

    if (nextZoom === viewport.zoom) {
      return;
    }

    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const canvasPoint = getCanvasPoint(event);
    const nextPosition = clampViewportPosition(
      canvasPoint.x - offsetX / nextZoom,
      canvasPoint.y - offsetY / nextZoom,
      nextZoom,
      viewportSize,
    );

    setPointerPosition(canvasPoint);
    setViewport({
      ...viewport,
      ...nextPosition,
      zoom: nextZoom,
    });
  };

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    const canPanWithPointer =
      event.button === 1 || (event.button === 0 && state.activeTool === "hand");

    if (canPanWithPointer) {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      panSessionRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startScrollX: boundedPosition.scrollX,
        startScrollY: boundedPosition.scrollY,
      };
      setIsPanning(true);
      return;
    }

    if (event.button !== 0) {
      return;
    }

    if (isDragDrawToolId(state.activeTool)) {
      const canvasPoint = getCanvasPoint(event);

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      drawSessionRef.current = createDragDrawSession(
        state.activeTool,
        event.pointerId,
        canvasPoint,
      );
      setDrawPreview(getDrawPreview(drawSessionRef.current, canvasPoint));
      return;
    }

    if (state.activeTool === textToolId) {
      const canvasPoint = getCanvasPoint(event);
      const element = createTextElement(canvasPoint, state.styleDefaults);

      event.preventDefault();
      dispatch({ type: "add-element", element });
      startTextEditing(element.id, element.text);
      return;
    }

    if (state.activeTool !== selectToolId) {
      return;
    }

    const canvasPoint = getCanvasPoint(event);
    const hitElementId = hitTestElementAtPoint(state.elements, canvasPoint);

    if (hitElementId === null) {
      dispatch({ type: "set-selection", elementId: null });
      return;
    }

    const hitElement = findElementById(state.elements, hitElementId);

    if (!hitElement) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dispatch({ type: "set-selection", elementId: hitElementId });
    dispatch({ type: "set-interaction", interaction: "dragging" });
    selectSessionRef.current = createSelectDragSession(
      event.pointerId,
      hitElementId,
      canvasPoint,
      hitElement.x,
      hitElement.y,
    );
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    setPointerPosition(getCanvasPoint(event));

    const panSession = panSessionRef.current;

    if (panSession && panSession.pointerId === event.pointerId) {
      event.preventDefault();

      const nextPosition = clampViewportPosition(
        panSession.startScrollX -
          (event.clientX - panSession.startClientX) / viewport.zoom,
        panSession.startScrollY -
          (event.clientY - panSession.startClientY) / viewport.zoom,
        viewport.zoom,
        viewportSize,
      );

      setViewport({
        ...viewport,
        ...nextPosition,
      });
      return;
    }

    const selectSession = selectSessionRef.current;

    if (selectSession && selectSession.pointerId === event.pointerId) {
      event.preventDefault();

      const nextPosition = getDraggedElementPosition(
        selectSession,
        getCanvasPoint(event),
      );

      dispatch({
        type: "update-element",
        elementId: selectSession.elementId,
        x: nextPosition.x,
        y: nextPosition.y,
      });
      return;
    }

    const drawSession = drawSessionRef.current;

    if (drawSession && drawSession.pointerId === event.pointerId) {
      event.preventDefault();
      setDrawPreview(getDrawPreview(drawSession, getCanvasPoint(event)));
    }
  };

  const stopPan = (event: PointerEvent<SVGSVGElement>) => {
    const panSession = panSessionRef.current;

    if (!panSession || panSession.pointerId !== event.pointerId) {
      return;
    }

    panSessionRef.current = null;
    setIsPanning(false);
    releasePointerCapture(event, event.pointerId);
  };

  const stopSelectDrag = (event: PointerEvent<SVGSVGElement>) => {
    const selectSession = selectSessionRef.current;

    if (!selectSession || selectSession.pointerId !== event.pointerId) {
      return;
    }

    selectSessionRef.current = null;
    dispatch({ type: "set-interaction", interaction: "idle" });
    releasePointerCapture(event, event.pointerId);
  };

  const stopDraw = (event: PointerEvent<SVGSVGElement>) => {
    const drawSession = drawSessionRef.current;

    if (!drawSession || drawSession.pointerId !== event.pointerId) {
      return;
    }

    const preview = getDrawPreview(drawSession, getCanvasPoint(event));

    drawSessionRef.current = null;
    setDrawPreview(null);

    if (shouldCommitDrawPreview(preview)) {
      const element = createElementFromDrawSession(
        drawSession,
        preview,
        state.styleDefaults,
      );

      dispatch({ type: "add-element", element });
      dispatch({ type: "set-selection", elementId: element.id });

      if (element.type === "arrow") {
        startArrowLabelEditing(element.id);
      }
    }

    releasePointerCapture(event, event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    stopPan(event);
    stopSelectDrag(event);
    stopDraw(event);
  };

  const handlePointerLeave = () => {
    if (!isPanning) {
      setPointerPosition(null);
    }
  };

  const handleDoubleClick = (event: PointerEvent<SVGSVGElement>) => {
    if (
      state.activeTool !== selectToolId ||
      editingTextId !== null ||
      editingArrowLabelId !== null
    ) {
      return;
    }

    const canvasPoint = getCanvasPoint(event);
    const hitElementId = hitTestElementAtPoint(state.elements, canvasPoint);

    if (hitElementId === null) {
      return;
    }

    const hitElement = findElementById(state.elements, hitElementId);

    if (!hitElement) {
      return;
    }

    event.preventDefault();

    if (hitElement.type === "text") {
      startTextEditing(hitElement.id, hitElement.text);
      return;
    }

    if (hitElement.type === "arrow") {
      startArrowLabelEditing(hitElement.id, hitElement.label);
    }
  };

  const selectedElementId = state.selectedElementIds[0];
  const selectedElement = selectedElementId
    ? findElementById(state.elements, selectedElementId)
    : undefined;
  const editingTextElement =
    editingTextId === null
      ? undefined
      : findElementById(state.elements, editingTextId);
  const editingArrowElement =
    editingArrowLabelId === null
      ? undefined
      : findElementById(state.elements, editingArrowLabelId);
  const toolClass = TOOL_VIEWPORT_CLASS[state.activeTool] ?? "";

  return (
    <div
      className={`editor-viewport ${isPanning ? "is-panning" : ""} ${toolClass}`.trim()}
      aria-label="Editor viewport"
    >
      <svg
        ref={svgRef}
        className="editor-surface"
        role="application"
        aria-label="LocalDraw canvas viewport"
        viewBox={viewBox}
        onPointerCancel={handlePointerUp}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <defs>
          <pattern
            id="editor-grid-pattern"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path className="canvas-grid-line" d="M 50 0 L 0 0 0 50" />
          </pattern>
          <SharedArrowheadMarker />
        </defs>
        <rect
          className="canvas-background"
          x="0"
          y="0"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
        {viewport.showGrid ? (
          <rect
            className="canvas-grid"
            x="0"
            y="0"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            fill="url(#editor-grid-pattern)"
          />
        ) : null}
        <ElementRenderer
          elements={state.elements}
          editingElementId={editingTextId}
        />
        {drawPreview ? (
          <DrawPreviewOverlay
            preview={drawPreview}
            styleDefaults={state.styleDefaults}
          />
        ) : null}
        {selectedElement &&
        editingTextId !== selectedElement.id &&
        editingArrowLabelId !== selectedElement.id ? (
          <SelectionBox element={selectedElement} />
        ) : null}
        {state.elements.length === 0 ? (
          <text className="canvas-empty-state" x="600" y="400" textAnchor="middle">
            Empty drawing
          </text>
        ) : null}
      </svg>
      {editingTextElement?.type === "text" ? (
        <TextEditorOverlay
          draftText={draftText}
          element={editingTextElement}
          scrollX={boundedPosition.scrollX}
          scrollY={boundedPosition.scrollY}
          zoom={viewport.zoom}
          onCommit={commitTextEdit}
          onDraftChange={setDraftText}
        />
      ) : null}
      {editingArrowElement?.type === "arrow" ? (
        <ArrowLabelEditorOverlay
          draftLabel={draftArrowLabel}
          element={editingArrowElement}
          scrollX={boundedPosition.scrollX}
          scrollY={boundedPosition.scrollY}
          zoom={viewport.zoom}
          onCommit={commitArrowLabelEdit}
          onDraftChange={setDraftArrowLabel}
        />
      ) : null}
      <div className="viewport-debug" aria-label="Viewport debug">
        <span>Zoom {Math.round(viewport.zoom * 100)}%</span>
        <span>
          View {Math.round(boundedPosition.scrollX)},{" "}
          {Math.round(boundedPosition.scrollY)}
        </span>
        <span>
          Cursor{" "}
          {pointerPosition
            ? `${Math.round(pointerPosition.x)}, ${Math.round(pointerPosition.y)}`
            : "--"}
        </span>
      </div>
    </div>
  );
}
