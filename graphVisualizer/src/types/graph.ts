export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  a: string;
  b: string;
  forward: boolean;
  backward: boolean;
}

export type GraphMode = "directed" | "undirected";
export type LayoutMode = "gravitational" | "free";