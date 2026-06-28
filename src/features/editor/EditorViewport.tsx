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
  const [isPanning, setIsPanning] = useState(false);

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

    if (!ellipseSession || ellipseSession.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    setEllipsePreview(
      getEllipsePreviewBounds(ellipseSession, getCanvasPoint(event)),
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

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    stopPan(event);
    stopSelectDrag(event);
    stopRectangleDraw(event);
    stopEllipseDraw(event);
  };

  const handlePointerLeave = () => {
    if (!isPanning) {
      setPointerPosition(null);
    }
  };

  const selectedElementId = state.selectedElementIds[0];
  const selectedElement = selectedElementId
    ? findElementById(state.elements, selectedElementId)
    : undefined;

  return (
    <div
      className={`editor-viewport ${isPanning ? "is-panning" : ""} ${state.activeTool === selectToolId ? "is-select-tool" : ""} ${state.activeTool === rectangleToolId ? "is-rectangle-tool" : ""} ${state.activeTool === ellipseToolId ? "is-ellipse-tool" : ""}`}
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
        <ElementRenderer elements={state.elements} />
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
        {selectedElement ? <SelectionBox element={selectedElement} /> : null}
        {state.elements.length === 0 ? (
          <text className="canvas-empty-state" x="600" y="400" textAnchor="middle">
            Empty drawing
          </text>
        ) : null}
      </svg>
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
