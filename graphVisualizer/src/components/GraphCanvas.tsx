import { useCallback, useEffect, useRef, useState } from "react";
import type { GraphEdge, GraphMode, GraphNode, LayoutMode } from "../types/graph";
import { nextLabel } from "../lib/labels";
import { NODE_RADIUS, MIN_DIST, clampToBounds, resolveCollisions, resolveAllCollisions } from "../lib/layout";

const TIP_HIT_RADIUS = 13;
const ATTRACT_STRENGTH = 0.012;
const CLICK_THRESHOLD = 4;

let uid = 0;
const genId = (prefix: string) => `${prefix}-${uid++}-${Date.now()}`;

function unitVector(from: GraphNode, to: GraphNode) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len, len };
}

interface Props {
  mode: GraphMode;
  layoutMode: LayoutMode;
  onStats?: (stats: { nodes: number; edges: number }) => void;
}

export default function GraphCanvas({ mode, layoutMode, onStats }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [linkingFrom, setLinkingFrom] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [hoverEdge, setHoverEdge] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const sizeRef = useRef(size);
  sizeRef.current = size;
  const draggingIdRef = useRef<string | null>(null);
  draggingIdRef.current = draggingId;
  const dragInfo = useRef<{
    id: string;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const ignoreNextBgClick = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const box = entries[0].contentRect;
      setSize({ width: box.width, height: box.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    onStats?.({ nodes: nodes.length, edges: edges.length });
  }, [nodes, edges, onStats]);

  const findEdge = useCallback(
    (idA: string, idB: string) =>
      edges.find(
        (e) => (e.a === idA && e.b === idB) || (e.a === idB && e.b === idA)
      ),
    [edges]
  );

  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.a !== id && e.b !== id));
  }, []);

  const deleteEdge = useCallback((id: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (hoverNode) {
        e.preventDefault();
        deleteNode(hoverNode);
        setHoverNode(null);
      } else if (hoverEdge) {
        e.preventDefault();
        deleteEdge(hoverEdge);
        setHoverEdge(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hoverNode, hoverEdge, deleteNode, deleteEdge]);

  const handleBackgroundClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (ignoreNextBgClick.current) {
      ignoreNextBgClick.current = false;
      return;
    }
    if (e.target !== e.currentTarget) return;
    if (linkingFrom) {
      setLinkingFrom(null);
      return;
    }
    const rect = wrapRef.current!.getBoundingClientRect();
    const raw = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setNodes((prev) => {
      const pos = resolveCollisions(raw, prev, size.width, size.height);
      const label = nextLabel(prev.map((n) => n.label));
      const node: GraphNode = { id: genId("n"), label, ...pos };
      return [...prev, node];
    });
  };

  const runLinkLogic = (nodeId: string) => {
    if (!linkingFrom) {
      setLinkingFrom(nodeId);
      return;
    }
    if (linkingFrom === nodeId) {
      setLinkingFrom(null);
      return;
    }
    const from = linkingFrom;
    const to = nodeId;
    const existing = findEdge(from, to);

    if (!existing) {
      const edge: GraphEdge = {
        id: genId("e"),
        a: from,
        b: to,
        forward: true,
        backward: mode === "undirected",
      };
      setEdges((prev) => [...prev, edge]);
    } else if (mode === "directed") {
      setEdges((prev) =>
        prev.map((edg) => {
          if (edg.id !== existing.id) return edg;
          if (edg.a === from) return { ...edg, forward: true };
          return { ...edg, backward: true };
        })
      );
    }
    setLinkingFrom(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent<SVGGElement>, node: GraphNode) => {
    e.stopPropagation();
    ignoreNextBgClick.current = true;
    dragInfo.current = {
      id: node.id,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
  };
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (rect) setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      const info = dragInfo.current;
      if (!info) return;
      const dx = e.clientX - info.startX;
      const dy = e.clientY - info.startY;

      if (!info.moved && Math.hypot(dx, dy) > CLICK_THRESHOLD) {
        info.moved = true;
        setDraggingId(info.id);
        setLinkingFrom(null);
      }

      if (info.moved && rect) {
        const raw = clampToBounds(
          { x: e.clientX - rect.left, y: e.clientY - rect.top },
          sizeRef.current.width,
          sizeRef.current.height
        );
        setNodes((prev) => {
          const withMoved = prev.map((n) => (n.id === info.id ? { ...n, ...raw } : n));
          return resolveAllCollisions(withMoved, info.id, sizeRef.current.width, sizeRef.current.height);
        });
      }
    };

    const onUp = () => {
      const info = dragInfo.current;
      dragInfo.current = null;
      setDraggingId(null);
      if (info && !info.moved) {
        runLinkLogic(info.id);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [linkingFrom, mode, findEdge]);

  useEffect(() => {
    if (layoutMode !== "gravitational") return;
    let raf: number;

    const step = () => {
      setNodes((prev) => {
        if (prev.length === 0) return prev;
        const cx = sizeRef.current.width / 2;
        const cy = sizeRef.current.height / 2;
        const next = prev.map((n) => ({ ...n }));
        const dragId = draggingIdRef.current;

        for (const n of next) {
          if (n.id === dragId) continue;
          n.x += (cx - n.x) * ATTRACT_STRENGTH;
          n.y += (cy - n.y) * ATTRACT_STRENGTH;
        }

        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const a = next[i];
            const b = next[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            if (dist < MIN_DIST) {
              const overlap = (MIN_DIST - dist) / 2;
              const ux = dx / dist;
              const uy = dy / dist;
              if (a.id !== dragId) {
                a.x -= ux * overlap;
                a.y -= uy * overlap;
              }
              if (b.id !== dragId) {
                b.x += ux * overlap;
                b.y += uy * overlap;
              }
            }
          }
        }

        for (const n of next) {
          if (n.id === dragId) continue;
          const clamped = clampToBounds(n, sizeRef.current.width, sizeRef.current.height);
          n.x = clamped.x;
          n.y = clamped.y;
        }

        return next;
      });
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [layoutMode]);

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    setLinkingFrom(null);
  };

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div ref={wrapRef} className="relative w-full h-full bg-dots">
      <svg
        width={size.width}
        height={size.height}
        onClick={handleBackgroundClick}
        className="block cursor-crosshair select-none"
      >
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="9"
            markerHeight="9"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--ink)" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const a = getNode(edge.a);
          const b = getNode(edge.b);
          if (!a || !b) return null;
          const uv = unitVector(a, b);
          const ax = a.x + uv.x * NODE_RADIUS;
          const ay = a.y + uv.y * NODE_RADIUS;
          const bx = b.x - uv.x * NODE_RADIUS;
          const by = b.y - uv.y * NODE_RADIUS;
          const isDirected = mode === "directed";
          const showForward = edge.forward;
          const showBackward = edge.backward && isDirected;
          const isHovered = hoverEdge === edge.id;

          return (
            <g key={edge.id}>
              <line
                x1={ax + 3}
                y1={ay + 3}
                x2={bx + 3}
                y2={by + 3}
                stroke={isHovered ? "#f9c9c9" : "var(--edge-glow)"}
                strokeWidth={10}
                strokeLinecap="round"
              />

              {!isDirected && (
                <line
                  x1={ax}
                  y1={ay}
                  x2={bx}
                  y2={by}
                  stroke="var(--ink)"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              )}

              {isDirected && showForward && (
                <line
                  x1={ax}
                  y1={ay}
                  x2={bx}
                  y2={by}
                  stroke="var(--ink)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />
              )}

              {isDirected && showBackward && (
                <line
                  x1={bx}
                  y1={by}
                  x2={ax}
                  y2={ay}
                  stroke="var(--ink)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />
              )}

              <line
                x1={ax}
                y1={ay}
                x2={bx}
                y2={by}
                stroke="transparent"
                strokeWidth={16}
                onMouseEnter={() => setHoverEdge(edge.id)}
                onMouseLeave={() => setHoverEdge((cur) => (cur === edge.id ? null : cur))}
              />

              {isDirected && showForward && (
                <circle
                  cx={bx}
                  cy={by}
                  r={TIP_HIT_RADIUS}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEdges((prev) =>
                      prev
                        .map((edg) => (edg.id === edge.id ? { ...edg, forward: false } : edg))
                        .filter((edg) => edg.forward || edg.backward)
                    );
                  }}
                />
              )}
              {isDirected && showBackward && (
                <circle
                  cx={ax}
                  cy={ay}
                  r={TIP_HIT_RADIUS}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEdges((prev) =>
                      prev
                        .map((edg) => (edg.id === edge.id ? { ...edg, backward: false } : edg))
                        .filter((edg) => edg.forward || edg.backward)
                    );
                  }}
                />
              )}
            </g>
          );
        })}

        {linkingFrom &&
          (() => {
            const from = getNode(linkingFrom);
            if (!from) return null;
            return (
              <line
                x1={from.x}
                y1={from.y}
                x2={cursor.x}
                y2={cursor.y}
                stroke="var(--accent)"
                strokeWidth={2.5}
                strokeDasharray="6 6"
                strokeLinecap="round"
                pointerEvents="none"
              />
            );
          })()}

        {nodes.map((node) => {
          const isLinking = linkingFrom === node.id;
          const isHover = hoverNode === node.id;
          const isDragging = draggingId === node.id;
          return (
            <g
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              onMouseEnter={() => setHoverNode(node.id)}
              onMouseLeave={() => setHoverNode((cur) => (cur === node.id ? null : cur))}
              className={isDragging ? "cursor-grabbing" : "cursor-grab"}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS}
                fill={isHover ? "var(--node-fill-hover)" : "var(--node-fill)"}
                stroke="var(--ink)"
                strokeWidth={isLinking ? 4 : 3}
                strokeDasharray={isLinking ? "5 4" : undefined}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-hand select-none"
                fontSize={30}
                fill="var(--ink)"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-hand text-3xl text-black/30">
            clique em qualquer lugar para criar um nó
          </p>
        </div>
      )}

      <button
        onClick={clearAll}
        className="absolute bottom-5 right-5 rounded-full bg-white border-2 border-black/80 px-4 py-2 text-sm font-medium shadow-[3px_3px_0_rgba(0,0,0,0.8)] hover:-translate-y-0.5 transition-transform"
      >
        Limpar tudo
      </button>
    </div>
  );
}