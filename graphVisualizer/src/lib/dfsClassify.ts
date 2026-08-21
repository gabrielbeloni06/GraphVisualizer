import type { GraphEdge, GraphMode } from "../types/graph";

export type EdgeType = "tree" | "back" | "forward" | "cross";

export interface EdgeClassification {
  forwardType?: EdgeType;
  backwardType?: EdgeType;
}

export interface DfsResult {
  discovery: Record<string, number>;
  finish: Record<string, number>;
  edgeClass: Record<string, EdgeClassification>;
}

type Color = "white" | "gray" | "black";
export function computeDfsClassification(
  nodeIds: string[],
  edges: GraphEdge[],
  mode: GraphMode
): DfsResult {
  const color = new Map<string, Color>();
  const discovery: Record<string, number> = {};
  const finish: Record<string, number> = {};
  const edgeClass: Record<string, EdgeClassification> = {};
  for (const id of nodeIds) color.set(id, "white");
  let time = 0;

  if (mode === "directed") {
    interface Arc {
      to: string;
      edgeId: string;
      dir: "forward" | "backward";
    }
    const adjacency = new Map<string, Arc[]>();
    for (const id of nodeIds) adjacency.set(id, []);
    for (const e of edges) {
      if (e.forward) adjacency.get(e.a)?.push({ to: e.b, edgeId: e.id, dir: "forward" });
      if (e.backward) adjacency.get(e.b)?.push({ to: e.a, edgeId: e.id, dir: "backward" });
    }

    const visit = (u: string) => {
      color.set(u, "gray");
      time += 1;
      discovery[u] = time;

      for (const arc of adjacency.get(u) ?? []) {
        const v = arc.to;
        const cv = color.get(v) ?? "white";
        let type: EdgeType;
        if (cv === "white") {
          type = "tree";
        } else if (cv === "gray") {
          type = "back";
        } else {
          type = discovery[u] < discovery[v] ? "forward" : "cross";
        }
        const rec = edgeClass[arc.edgeId] ?? (edgeClass[arc.edgeId] = {});
        if (arc.dir === "forward") rec.forwardType = type;
        else rec.backwardType = type;

        if (type === "tree") visit(v);
      }

      color.set(u, "black");
      time += 1;
      finish[u] = time;
    };

    for (const id of nodeIds) {
      if (color.get(id) === "white") visit(id);
    }
  } else {
    interface Arc {
      to: string;
      edgeId: string;
    }
    const adjacency = new Map<string, Arc[]>();
    for (const id of nodeIds) adjacency.set(id, []);
    for (const e of edges) {
      adjacency.get(e.a)?.push({ to: e.b, edgeId: e.id });
      adjacency.get(e.b)?.push({ to: e.a, edgeId: e.id });
    }
    const classified = new Set<string>();

    const visit = (u: string) => {
      color.set(u, "gray");
      time += 1;
      discovery[u] = time;

      for (const arc of adjacency.get(u) ?? []) {
        if (classified.has(arc.edgeId)) continue;
        const v = arc.to;
        const cv = color.get(v) ?? "white";
        if (cv === "white") {
          edgeClass[arc.edgeId] = { forwardType: "tree" };
          classified.add(arc.edgeId);
          visit(v);
        } else if (cv === "gray") {
          edgeClass[arc.edgeId] = { forwardType: "back" };
          classified.add(arc.edgeId);
        }
      }

      color.set(u, "black");
      time += 1;
      finish[u] = time;
    };

    for (const id of nodeIds) {
      if (color.get(id) === "white") visit(id);
    }
  }

  return { discovery, finish, edgeClass };
}