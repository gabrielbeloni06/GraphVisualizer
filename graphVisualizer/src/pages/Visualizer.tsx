import { useState } from "react";
import { Link } from "react-router-dom";
import GraphCanvas, { EDGE_TYPE_META } from "../components/GraphCanvas";
import type { GraphMode, LayoutMode } from "../types/graph";
import type { EdgeType } from "../lib/dfsClassify";

function SettingRow({
  label,
  options,
}: {
  label: string;
  options: { text: string; active: boolean; onClick: () => void }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-black/40">
        {label}
      </span>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.text}
            onClick={opt.onClick}
            className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium border-2 border-black/80 transition-colors ${
              opt.active ? "bg-black text-white" : "bg-white hover:bg-black/5"
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

const ALL_TYPES: EdgeType[] = ["tree", "back", "forward", "cross"];

export default function Visualizer() {
  const [mode, setMode] = useState<GraphMode>("directed");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("free");
  const [showClassification, setShowClassification] = useState(false);
  const [showTimes, setShowTimes] = useState(false);
  const [stats, setStats] = useState({ nodes: 0, edges: 0 });

  const visibleTypes = mode === "directed" ? ALL_TYPES : (["tree", "back"] as EdgeType[]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <header className="flex items-center px-6 py-3 border-b-2 border-black/10 bg-[var(--paper)] z-10">
        <Link
          to="/"
          className="font-hand text-2xl font-bold hover:opacity-70 transition-opacity"
        >
          ← grafo
        </Link>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-white/90 border-2 border-black/80 px-5 py-2 shadow-[3px_3px_0_rgba(0,0,0,0.8)] font-hand text-xl font-bold pointer-events-none">
            N = {stats.nodes} · arestas = {stats.edges}
          </div>
          <GraphCanvas
            mode={mode}
            layoutMode={layoutMode}
            showClassification={showClassification}
            showTimes={showTimes}
            onStats={setStats}
          />
        </div>

        <aside className="w-64 shrink-0 border-l-2 border-black/10 bg-[var(--paper)] px-5 py-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="font-hand text-2xl font-bold mb-1">configurações</h2>
            <p className="text-xs text-black/40">
              cada característica do grafo, uma linha.
            </p>
          </div>

          <SettingRow
            label="Direção"
            options={[
              {
                text: "Direcional",
                active: mode === "directed",
                onClick: () => setMode("directed"),
              },
              {
                text: "Não direcional",
                active: mode === "undirected",
                onClick: () => setMode("undirected"),
              },
            ]}
          />

          <SettingRow
            label="Layout"
            options={[
              {
                text: "Gravitacional",
                active: layoutMode === "gravitational",
                onClick: () => setLayoutMode("gravitational"),
              },
              {
                text: "Livre",
                active: layoutMode === "free",
                onClick: () => setLayoutMode("free"),
              },
            ]}
          />

          <SettingRow
            label="Classificação de arestas"
            options={[
              {
                text: "Visível",
                active: showClassification,
                onClick: () => setShowClassification(true),
              },
              {
                text: "Não visível",
                active: !showClassification,
                onClick: () => setShowClassification(false),
              },
            ]}
          />

          {showClassification && (
            <div className="flex flex-col gap-1.5 -mt-3 rounded-lg bg-black/5 p-3 text-xs">
              {visibleTypes.map((t) => {
                const meta = EDGE_TYPE_META[t];
                return (
                  <div key={t} className="flex items-center gap-2">
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 font-bold"
                      style={{ borderColor: meta.color, color: meta.color, fontSize: "10px" }}
                    >
                      {meta.letter}
                    </span>
                    <span className="text-black/60">{meta.label}</span>
                  </div>
                );
              })}
              {mode === "undirected" && (
                <p className="text-black/40 pt-1">
                  avanço e cruzamento só existem em grafos direcionados.
                </p>
              )}
            </div>
          )}

          <SettingRow
            label="Tempo desc. / fim"
            options={[
              {
                text: "Visível",
                active: showTimes,
                onClick: () => setShowTimes(true),
              },
              {
                text: "Não visível",
                active: !showTimes,
                onClick: () => setShowTimes(false),
              },
            ]}
          />
          {showTimes && (
            <p className="text-xs text-black/40 -mt-3">
              [descoberta, finalização] de cada nó, via DFS.
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-black/10 text-xs text-black/45 flex flex-col gap-1.5">
            <span>clique no quadro: cria um nó</span>
            <span>clique e arraste: reposiciona (empurra vizinhos)</span>
            <span>clique em dois nós: cria/ajusta a aresta</span>
            <span>clique na ponta da seta: remove a direção</span>
            <span>mouse em cima + Del: apaga nó/aresta</span>
          </div>
        </aside>
      </div>
    </div>
  );
}