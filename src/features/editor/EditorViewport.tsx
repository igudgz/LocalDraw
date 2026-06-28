import { useEffect, useRef, useState } from "react";
import { ElementRenderer } from "../elements/ElementRenderer";
import { SelectionBox } from "../selection/SelectionBox";
import { findElementById, hitTestElementAtPoint } from "../selection/selectionUtils";
import {
  createSelectDragSession,
  getDraggedElementPosition,
  selectToolId,
  type SelectDragSession,
} from "../tools/selectTool";
import {
  createArrowDrawSession,
  createArrowElement,
  arrowToolId,
  getArrowPreviewLine,
  shouldCommitArrow,
  type ArrowDrawSession,
  type NormalizedArrowLine,
} from "../tools/arrowTool";
import {
  createEllipseDrawSession,
  createEllipseElement,
  ellipseToolId,
  getEllipsePreviewBounds,
  shouldCommitEllipse,
  type EllipseDrawSession,
  type NormalizedEllipseBounds,
} from "../tools/ellipseTool";
import {
  createRectangleDrawSession,
  createRectangleElement,
  getRectanglePreviewBounds,
  rectangleToolId,
  shouldCommitRectangle,
  type NormalizedRect,
  type RectangleDrawSession,
} from "../tools/rectangleTool";
import {
  createTextElement,
  DEFAULT_TEXT,
  textToolId,
} from "../tools/textTool";
import type { TextElement as TextElementType } from "../elements/elementTypes";
import type { Dispatch, KeyboardEvent, PointerEvent, WheelEvent } from "react";
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

type EditorViewportProps = {
  dispatch: Dispatch<EditorAction>;
  state: EditorState;
};

type ViewportSize = {
  width: number;
  height: number;
};

type CanvasPoint = {
  x: number;
  y: number;
};

type PanSession = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startScrollX: number;
  startScrollY: number;
};

type TextEditorOverlayProps = {
  element: TextElementType;
  draftText: string;
  scrollX: number;
  scrollY: number;
  zoom: number;
  onDraftChange: (value: string) => void;
  onCommit: () => void;
};

function TextEditorOverlay({
  element,
  draftText,
  onCommit,
  onDraftChange,
  scrollX,
  scrollY,
  zoom,
}: TextEditorOverlayProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.focus();
    input.select();
  }, [element.id]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onCommit();
    }
  };

  return (
    <textarea
      ref={inputRef}
      className="text-editor-overlay"
      aria-label="Edit text"
      value={draftText}
      rows={1}
      style={{
        left: (element.x - scrollX) * zoom,
        top: (element.y - element.height - scrollY) * zoom,
        width: Math.max(element.width, element.fontSize * 2) * zoom,
        minHeight: element.height * zoom,
        color: element.strokeColor,
        fontFamily: element.fontFamily,
        fontSize: element.fontSize * zoom,
        lineHeight: `${element.height * zoom}px`,
        opacity: element.opacity,
      }}
      onBlur={onCommit}
      onChange={(event) => onDraftChange(event.target.value)}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
    />
  );
}

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

export function EditorViewport({ dispatch, state }: EditorViewportProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const panSessionRef = useRef<PanSession | null>(null);
  const selectSessionRef = useRef<SelectDragSession | null>(null);
  const rectangleSessionRef = useRef<RectangleDrawSession | null>(null);
  const ellipseSessionRef = useRef<EllipseDrawSession | null>(null);
  const arrowSessionRef = useRef<ArrowDrawSession | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>(
    DEFAULT_VIEWPORT_SIZE,
  );
  const [pointerPosition, setPointerPosition] = useState<CanvasPoint | null>(
    null,
  );
  const [rectanglePreview, setRectanglePreview] = useState<NormalizedRect | null>(
    null,
  );
  const [ellipsePreview, setEllipsePreview] = useState<NormalizedEllipseBounds | null>(
    null,
  );
  const [arrowPreview, setArrowPreview] = useState<NormalizedArrowLine | null>(
    null,
  );
  const [isPanning, setIsPanning] = useState(false);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

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

  const startTextEditing = (element: TextElementType) => {
    setEditingElementId(element.id);
    setDraftText(element.text);
    dispatch({ type: "set-selection", elementId: element.id });
  };

  const commitTextEdit = () => {
    if (editingElementId === null) {
      return;
    }

    const trimmed = draftText.trim();
    const finalText = trimmed === "" ? DEFAULT_TEXT : trimmed;

    dispatch({
      type: "update-element-text",
      elementId: editingElementId,
      text: finalText,
    });
    setEditingElementId(null);
    setDraftText("");
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

    if (state.activeTool === rectangleToolId) {
      const canvasPoint = getCanvasPoint(event);

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      rectangleSessionRef.current = createRectangleDrawSession(
        event.pointerId,
        canvasPoint,
      );
      setRectanglePreview(getRectanglePreviewBounds(
        rectangleSessionRef.current,
        canvasPoint,
      ));
      return;
    }

    if (state.activeTool === ellipseToolId) {
      const canvasPoint = getCanvasPoint(event);

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      ellipseSessionRef.current = createEllipseDrawSession(
        event.pointerId,
        canvasPoint,
      );
      setEllipsePreview(getEllipsePreviewBounds(
        ellipseSessionRef.current,
        canvasPoint,
      ));
      return;
    }

    if (state.activeTool === arrowToolId) {
      const canvasPoint = getCanvasPoint(event);

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      arrowSessionRef.current = createArrowDrawSession(
        event.pointerId,
        canvasPoint,
      );
      setArrowPreview(getArrowPreviewLine(
        arrowSessionRef.current,
        canvasPoint,
      ));
      return;
    }

    if (state.activeTool === textToolId) {
      const canvasPoint = getCanvasPoint(event);
      const element = createTextElement(canvasPoint, state.styleDefaults);

      event.preventDefault();
      dispatch({ type: "add-element", element });
      dispatch({ type: "set-selection", elementId: element.id });
      startTextEditing(element);
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

    const rectangleSession = rectangleSessionRef.current;

    if (rectangleSession && rectangleSession.pointerId === event.pointerId) {
      event.preventDefault();
      setRectanglePreview(
        getRectanglePreviewBounds(rectangleSession, getCanvasPoint(event)),
      );
      return;
    }

    const ellipseSession = ellipseSessionRef.current;

    if (ellipseSession && ellipseSession.pointerId === event.pointerId) {
      event.preventDefault();
      setEllipsePreview(
        getEllipsePreviewBounds(ellipseSession, getCanvasPoint(event)),
      );
      return;
    }

    const arrowSession = arrowSessionRef.current;

    if (!arrowSession || arrowSession.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    setArrowPreview(
      getArrowPreviewLine(arrowSession, getCanvasPoint(event)),
    );
  };

  const stopPan = (event: PointerEvent<SVGSVGElement>) => {
    if (panSessionRef.current?.pointerId === event.pointerId) {
      panSessionRef.current = null;
      setIsPanning(false);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
  };

  const stopSelectDrag = (event: PointerEvent<SVGSVGElement>) => {
    if (selectSessionRef.current?.pointerId === event.pointerId) {
      selectSessionRef.current = null;
      dispatch({ type: "set-interaction", interaction: "idle" });

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
  };

  const stopRectangleDraw = (event: PointerEvent<SVGSVGElement>) => {
    const rectangleSession = rectangleSessionRef.current;

    if (!rectangleSession || rectangleSession.pointerId !== event.pointerId) {
      return;
    }

    const bounds = getRectanglePreviewBounds(
      rectangleSession,
      getCanvasPoint(event),
    );

    rectangleSessionRef.current = null;
    setRectanglePreview(null);

    if (shouldCommitRectangle(bounds)) {
      const element = createRectangleElement(bounds, state.styleDefaults);

      dispatch({ type: "add-element", element });
      dispatch({ type: "set-selection", elementId: element.id });
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const stopEllipseDraw = (event: PointerEvent<SVGSVGElement>) => {
    const ellipseSession = ellipseSessionRef.current;

    if (!ellipseSession || ellipseSession.pointerId !== event.pointerId) {
      return;
    }

    const bounds = getEllipsePreviewBounds(
      ellipseSession,
      getCanvasPoint(event),
    );

    ellipseSessionRef.current = null;
    setEllipsePreview(null);

    if (shouldCommitEllipse(bounds)) {
      const element = createEllipseElement(bounds, state.styleDefaults);

      dispatch({ type: "add-element", element });
      dispatch({ type: "set-selection", elementId: element.id });
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const promptArrowLabel = (elementId: string, currentLabel?: string) => {
    const label = window.prompt("Arrow label (optional):", currentLabel ?? "");

    if (label === null) {
      return;
    }

    dispatch({
      type: "update-element-label",
      elementId,
      label: label.trim(),
    });
  };

  const stopArrowDraw = (event: PointerEvent<SVGSVGElement>) => {
    const arrowSession = arrowSessionRef.current;

    if (!arrowSession || arrowSession.pointerId !== event.pointerId) {
      return;
    }

    const line = getArrowPreviewLine(arrowSession, getCanvasPoint(event));

    arrowSessionRef.current = null;
    setArrowPreview(null);

    if (shouldCommitArrow(line)) {
      const element = createArrowElement(line, state.styleDefaults);

      dispatch({ type: "add-element", element });
      dispatch({ type: "set-selection", elementId: element.id });
      promptArrowLabel(element.id);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    stopPan(event);
    stopSelectDrag(event);
    stopRectangleDraw(event);
    stopEllipseDraw(event);
    stopArrowDraw(event);
  };

  const handlePointerLeave = () => {
    if (!isPanning) {
      setPointerPosition(null);
    }
  };

  const handleDoubleClick = (event: PointerEvent<SVGSVGElement>) => {
    if (state.activeTool !== selectToolId || editingElementId !== null) {
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
      startTextEditing(hitElement);
      return;
    }

    if (hitElement.type === "arrow") {
      dispatch({ type: "set-selection", elementId: hitElementId });
      promptArrowLabel(hitElementId, hitElement.label);
    }
  };

  const selectedElementId = state.selectedElementIds[0];
  const selectedElement = selectedElementId
    ? findElementById(state.elements, selectedElementId)
    : undefined;
  const editingElement =
    editingElementId === null
      ? undefined
      : findElementById(state.elements, editingElementId);

  return (
    <div
      className={`editor-viewport ${isPanning ? "is-panning" : ""} ${state.activeTool === selectToolId ? "is-select-tool" : ""} ${state.activeTool === rectangleToolId ? "is-rectangle-tool" : ""} ${state.activeTool === ellipseToolId ? "is-ellipse-tool" : ""} ${state.activeTool === arrowToolId ? "is-arrow-tool" : ""} ${state.activeTool === textToolId ? "is-text-tool" : ""}`}
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
          editingElementId={editingElementId}
        />
        {rectanglePreview ? (
          <rect
            className="rectangle-preview"
            x={rectanglePreview.x}
            y={rectanglePreview.y}
            width={rectanglePreview.width}
            height={rectanglePreview.height}
            fill={state.styleDefaults.backgroundColor}
            opacity={state.styleDefaults.opacity}
            stroke={state.styleDefaults.strokeColor}
            strokeWidth={state.styleDefaults.strokeWidth}
            strokeDasharray="6 4"
            pointerEvents="none"
          />
        ) : null}
        {ellipsePreview ? (
          <ellipse
            className="ellipse-preview"
            cx={ellipsePreview.x + ellipsePreview.width / 2}
            cy={ellipsePreview.y + ellipsePreview.height / 2}
            rx={ellipsePreview.width / 2}
            ry={ellipsePreview.height / 2}
            fill={state.styleDefaults.backgroundColor}
            opacity={state.styleDefaults.opacity}
            stroke={state.styleDefaults.strokeColor}
            strokeWidth={state.styleDefaults.strokeWidth}
            strokeDasharray="6 4"
            pointerEvents="none"
          />
        ) : null}
        {arrowPreview ? (
          <line
            className="arrow-preview"
            x1={arrowPreview.startX}
            y1={arrowPreview.startY}
            x2={arrowPreview.endX}
            y2={arrowPreview.endY}
            stroke={state.styleDefaults.strokeColor}
            strokeWidth={state.styleDefaults.strokeWidth}
            opacity={state.styleDefaults.opacity}
            strokeDasharray="6 4"
            pointerEvents="none"
          />
        ) : null}
        {selectedElement && editingElementId !== selectedElement.id ? (
          <SelectionBox element={selectedElement} />
        ) : null}
        {state.elements.length === 0 ? (
          <text className="canvas-empty-state" x="600" y="400" textAnchor="middle">
            Empty drawing
          </text>
        ) : null}
      </svg>
      {editingElement?.type === "text" ? (
        <TextEditorOverlay
          draftText={draftText}
          element={editingElement}
          scrollX={boundedPosition.scrollX}
          scrollY={boundedPosition.scrollY}
          zoom={viewport.zoom}
          onCommit={commitTextEdit}
          onDraftChange={setDraftText}
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
