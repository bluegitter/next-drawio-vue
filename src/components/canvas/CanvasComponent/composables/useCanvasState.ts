import type { ComputedRef, Ref } from 'vue';
import { computed, ref, shallowRef, watch } from 'vue';
import type { CanvasComponentProps, CanvasComponentRef, HistoryState, SVGShape } from '../types';

type EditingText = {
  id: string;
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  letterSpacing?: string;
  lineHeight?: string;
  color?: string;
} | null;

type DraggingHandle = {
  connectorId: string;
  end: 'start' | 'end';
  original: {
    x: number;
    y: number;
    shapeId?: string | null;
    portId?: string | null;
    dash?: string | null;
  };
} | null;

type DraggingPolylinePoint = { shapeId: string; index: number } | null;
type ActivePortHighlight = { shapeId: string; portId: string } | null;
type DraggingCornerHandle = { shapeId: string; handleType: string; startCornerRadius: number } | null;

export type CanvasState = {
  svgRef: Ref<SVGSVGElement | null>;
  shapes: Ref<SVGShape[]>;
  shapesRef: { value: SVGShape[] };
  setShapes: (next: SVGShape[]) => void;
  selectedIds: Ref<Set<string>>;
  selectedIdsRef: { value: Set<string> };
  setSelectedIds: (next: Set<string>) => void;
  selectedShape: ComputedRef<string | null>;
  setSelectedShape: (id: string | null) => void;
  setSelectedShapes: (ids: string[] | Set<string>) => void;
  history: Ref<HistoryState[]>;
  setHistory: (next: HistoryState[]) => void;
  historyIndex: Ref<number>;
  setHistoryIndex: (next: number) => void;
  zoom: Ref<number>;
  setZoom: (next: number) => void;
  isDragging: Ref<boolean>;
  setIsDragging: (next: boolean) => void;
  isResizing: Ref<boolean>;
  setIsResizing: (next: boolean) => void;
  isSelectingBox: Ref<boolean>;
  setIsSelectingBox: (next: boolean) => void;
  selectionRect: Ref<{ x: number; y: number; w: number; h: number } | null>;
  setSelectionRect: (next: { x: number; y: number; w: number; h: number } | null) => void;
  selectionOriginRef: { value: { x: number; y: number } | null };
  isConnecting: Ref<boolean>;
  setIsConnecting: (next: boolean) => void;
  connectionStart: Ref<string | null>;
  setConnectionStart: (next: string | null) => void;
  connectionStartPort: Ref<string | null>;
  setConnectionStartPort: (next: string | null) => void;
  dragStart: Ref<{ x: number; y: number }>;
  setDragStart: (next: { x: number; y: number }) => void;
  resizeHandle: Ref<string | null>;
  setResizeHandle: (next: string | null) => void;
  tempLine: Ref<SVGElement | null>;
  setTempLine: (next: SVGElement | null) => void;
  shapeIdCounter: { value: number };
  hasCalledReady: { value: boolean };
  methodsRef: { value: CanvasComponentRef | null };
  portElementsRef: { value: Map<string, SVGCircleElement[]> };
  connectorHandleRef: { value: Map<string, { start: SVGCircleElement; end: SVGCircleElement }> };
  skipNextCanvasClickClear: { value: boolean };
  editingText: Ref<EditingText>;
  setEditingText: (next: EditingText) => void;
  editingInputRef: Ref<HTMLInputElement | null>;
  draggingHandle: Ref<DraggingHandle>;
  setDraggingHandle: (next: DraggingHandle) => void;
  draggingPolylinePoint: Ref<DraggingPolylinePoint>;
  setDraggingPolylinePoint: (next: DraggingPolylinePoint) => void;
  activePortHighlight: Ref<ActivePortHighlight>;
  setActivePortHighlight: (next: ActivePortHighlight) => void;
  hoveredShapeId: Ref<string | null>;
  setHoveredShapeId: (next: string | null) => void;
  resizeHandlesRef: { value: Map<string, SVGRectElement[]> };
  cornerHandlesRef: { value: Map<string, SVGRectElement[]> };
  textSelectionRef: { value: Map<string, SVGRectElement> };
  handleConnectionRef: { value: boolean };
  lastPointerRef: { value: { x: number; y: number; clientX: number; clientY: number } };
  copyBufferRef: { value: { ids: string[]; shapes: SVGShape[] } | null };
  draggingCornerHandle: Ref<DraggingCornerHandle>;
  setDraggingCornerHandle: (next: DraggingCornerHandle) => void;
  viewBoxMinX: ComputedRef<number>;
  viewBoxMinY: ComputedRef<number>;
  viewBoxMaxX: ComputedRef<number>;
  viewBoxMaxY: ComputedRef<number>;
  getPointerPosition: (clientX: number, clientY: number) => { x: number; y: number };
  lastBoundsRef: { value: { minX: number; minY: number; maxX: number; maxY: number } | null };
};

export const useCanvasState = (props: CanvasComponentProps): CanvasState => {
  const svgRef = ref<SVGSVGElement | null>(null);
  const shapes = ref<SVGShape[]>([]);
  const shapesRef = shallowRef<SVGShape[]>([]);
  const selectedIds = ref<Set<string>>(new Set());
  const selectedIdsRef = shallowRef<Set<string>>(new Set());
  const history = ref<HistoryState[]>([{ shapes: [], selectedIds: [] }]);
  const historyIndex = ref(0);
  const zoom = ref(1);
  const isDragging = ref(false);
  const isResizing = ref(false);
  const isSelectingBox = ref(false);
  const selectionRect = ref<{ x: number; y: number; w: number; h: number } | null>(null);
  const selectionOriginRef = shallowRef<{ x: number; y: number } | null>(null);
  const isConnecting = ref(false);
  const connectionStart = ref<string | null>(null);
  const connectionStartPort = ref<string | null>(null);
  const dragStart = ref({ x: 0, y: 0 });
  const resizeHandle = ref<string | null>(null);
  const tempLine = ref<SVGElement | null>(null);
  const shapeIdCounter = shallowRef(0);
  const hasCalledReady = shallowRef(false);
  const methodsRef = shallowRef<CanvasComponentRef | null>(null);
  const portElementsRef = shallowRef<Map<string, SVGCircleElement[]>>(new Map());
  const connectorHandleRef = shallowRef<Map<string, { start: SVGCircleElement; end: SVGCircleElement }>>(new Map());
  const skipNextCanvasClickClear = shallowRef(false);
  const editingText = ref<EditingText>(null);
  const editingInputRef = ref<HTMLInputElement | null>(null);
  const draggingHandle = ref<DraggingHandle>(null);
  const draggingPolylinePoint = ref<DraggingPolylinePoint>(null);
  const activePortHighlight = ref<ActivePortHighlight>(null);
  const hoveredShapeId = ref<string | null>(null);
  const resizeHandlesRef = shallowRef<Map<string, SVGRectElement[]>>(new Map());
  const cornerHandlesRef = shallowRef<Map<string, SVGRectElement[]>>(new Map());
  const textSelectionRef = shallowRef<Map<string, SVGRectElement>>(new Map());
  const handleConnectionRef = shallowRef(false);
  const lastPointerRef = shallowRef({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const copyBufferRef = shallowRef<{ ids: string[]; shapes: SVGShape[] } | null>(null);
  const draggingCornerHandle = ref<DraggingCornerHandle>(null);

  const viewBoxMinX = computed(() => -(props.pageOffsetXPages || 0) * (props.pageWidth || 0));
  const viewBoxMinY = computed(() => -(props.pageOffsetYPages || 0) * (props.pageHeight || 0));
  const viewBoxMaxX = computed(() => viewBoxMinX.value + props.width);
  const viewBoxMaxY = computed(() => viewBoxMinY.value + props.height);

  const getPointerPosition = (clientX: number, clientY: number) => {
    if (!svgRef.value) return { x: 0, y: 0 };
    const rect = svgRef.value.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: 0, y: 0 };
    const scaleX = props.width / rect.width;
    const scaleY = props.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX + viewBoxMinX.value,
      y: (clientY - rect.top) * scaleY + viewBoxMinY.value,
    };
  };

  const lastBoundsRef = shallowRef<{ minX: number; minY: number; maxX: number; maxY: number } | null>(null);

  const selectedShape = computed(() => {
    const first = selectedIds.value.values().next();
    return first.done ? null : first.value;
  });

  const setSelectedShape = (id: string | null) => {
    const next = id ? new Set([id]) : new Set<string>();
    selectedIdsRef.value = next;
    selectedIds.value = next;
  };

  const setSelectedShapes = (ids: string[] | Set<string>) => {
    const next = new Set(ids);
    selectedIdsRef.value = next;
    selectedIds.value = next;
  };

  watch(selectedIds, (value) => {
    selectedIdsRef.value = value;
  });

  const setShapes = (next: SVGShape[]) => {
    shapes.value = next;
    shapesRef.value = next;
  };

  const setHistory = (next: HistoryState[]) => {
    history.value = next;
  };

  return {
    svgRef,
    shapes,
    shapesRef: shapesRef as { value: SVGShape[] },
    setShapes,
    selectedIds,
    selectedIdsRef: selectedIdsRef as { value: Set<string> },
    setSelectedIds: (next) => {
      selectedIds.value = next;
    },
    selectedShape,
    setSelectedShape,
    setSelectedShapes,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex: (next) => {
      historyIndex.value = next;
    },
    zoom,
    setZoom: (next) => {
      zoom.value = next;
    },
    isDragging,
    setIsDragging: (next) => {
      isDragging.value = next;
    },
    isResizing,
    setIsResizing: (next) => {
      isResizing.value = next;
    },
    isSelectingBox,
    setIsSelectingBox: (next) => {
      isSelectingBox.value = next;
    },
    selectionRect,
    setSelectionRect: (next) => {
      selectionRect.value = next;
    },
    selectionOriginRef: selectionOriginRef as { value: { x: number; y: number } | null },
    isConnecting,
    setIsConnecting: (next) => {
      isConnecting.value = next;
    },
    connectionStart,
    setConnectionStart: (next) => {
      connectionStart.value = next;
    },
    connectionStartPort,
    setConnectionStartPort: (next) => {
      connectionStartPort.value = next;
    },
    dragStart,
    setDragStart: (next) => {
      dragStart.value = next;
    },
    resizeHandle,
    setResizeHandle: (next) => {
      resizeHandle.value = next;
    },
    tempLine,
    setTempLine: (next) => {
      tempLine.value = next;
    },
    shapeIdCounter: shapeIdCounter as { value: number },
    hasCalledReady: hasCalledReady as { value: boolean },
    methodsRef: methodsRef as { value: CanvasComponentRef | null },
    portElementsRef: portElementsRef as { value: Map<string, SVGCircleElement[]> },
    connectorHandleRef: connectorHandleRef as {
      value: Map<string, { start: SVGCircleElement; end: SVGCircleElement }>;
    },
    skipNextCanvasClickClear: skipNextCanvasClickClear as { value: boolean },
    editingText,
    setEditingText: (next) => {
      editingText.value = next;
    },
    editingInputRef,
    draggingHandle,
    setDraggingHandle: (next) => {
      draggingHandle.value = next;
    },
    draggingPolylinePoint,
    setDraggingPolylinePoint: (next) => {
      draggingPolylinePoint.value = next;
    },
    activePortHighlight,
    setActivePortHighlight: (next) => {
      activePortHighlight.value = next;
    },
    hoveredShapeId,
    setHoveredShapeId: (next) => {
      hoveredShapeId.value = next;
    },
    resizeHandlesRef: resizeHandlesRef as { value: Map<string, SVGRectElement[]> },
    cornerHandlesRef: cornerHandlesRef as { value: Map<string, SVGRectElement[]> },
    textSelectionRef: textSelectionRef as { value: Map<string, SVGRectElement> },
    handleConnectionRef: handleConnectionRef as { value: boolean },
    lastPointerRef: lastPointerRef as { value: { x: number; y: number; clientX: number; clientY: number } },
    copyBufferRef: copyBufferRef as { value: { ids: string[]; shapes: SVGShape[] } | null },
    draggingCornerHandle,
    setDraggingCornerHandle: (next) => {
      draggingCornerHandle.value = next;
    },
    viewBoxMinX,
    viewBoxMinY,
    viewBoxMaxX,
    viewBoxMaxY,
    getPointerPosition,
    lastBoundsRef: lastBoundsRef as {
      value: { minX: number; minY: number; maxX: number; maxY: number } | null;
    },
  };
};
