import type { GraphNode } from "../types/graph";
export const NODE_RADIUS = 38;
export const MIN_DIST = Math.round((NODE_RADIUS * 2 + 30) * 1.2);
export function clamp(value: number, min: number, max: number) {
  if (max < min) return (min + max) / 2;
  return Math.min(max, Math.max(min, value));
}
export function clampToBounds(
  pos: { x: number; y: number },
  width: number,
  height: number
) {
  return {
    x: clamp(pos.x, NODE_RADIUS + 4, Math.max(NODE_RADIUS + 4, width - NODE_RADIUS - 4)),
    y: clamp(pos.y, NODE_RADIUS + 4, Math.max(NODE_RADIUS + 4, height - NODE_RADIUS - 4)),
  };
}
export function resolveCollisions(
  pos: { x: number; y: number },
  others: GraphNode[],
  width: number,
  height: number,
  iterations = 8
) {
  let p = { ...pos };
  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;
    for (const o of others) {
      const dx = p.x - o.x;
      const dy = p.y - o.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      if (dist < MIN_DIST) {
        const overlap = MIN_DIST - dist;
        const ux = dx / dist;
        const uy = dy / dist;
        p.x += ux * overlap;
        p.y += uy * overlap;
        moved = true;
      }
    }
    p = clampToBounds(p, width, height);
    if (!moved) break;
  }
  return p;
}
export function resolveAllCollisions(
  nodes: GraphNode[],
  fixedId: string,
  width: number,
  height: number,
  iterations = 6
) {
  const next = nodes.map((n) => ({ ...n }));
  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;
    for (let i = 0; i < next.length; i++) {
      for (let j = i + 1; j < next.length; j++) {
        const a = next[i];
        const b = next[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        if (dist < MIN_DIST) {
          const overlap = MIN_DIST - dist;
          const ux = dx / dist;
          const uy = dy / dist;
          const aFixed = a.id === fixedId;
          const bFixed = b.id === fixedId;
          if (aFixed && bFixed) continue;
          if (aFixed) {
            b.x += ux * overlap;
            b.y += uy * overlap;
          } else if (bFixed) {
            a.x -= ux * overlap;
            a.y -= uy * overlap;
          } else {
            a.x -= ux * (overlap / 2);
            a.y -= uy * (overlap / 2);
            b.x += ux * (overlap / 2);
            b.y += uy * (overlap / 2);
          }
          moved = true;
        }
      }
    }
    for (const n of next) {
      if (n.id === fixedId) continue;
      const c = clampToBounds(n, width, height);
      n.x = c.x;
      n.y = c.y;
    }
    if (!moved) break;
  }
  return next;
}