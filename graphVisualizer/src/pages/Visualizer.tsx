import { useState } from "react";
import { Link } from "react-router-dom";
import GraphCanvas from "../components/GraphCanvas";
import type { GraphMode, LayoutMode } from "../types/graph";

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

export default function Visualizer() {
  const [mode, setMode] = useState<GraphMode>("directed");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("free");
  const [stats, setStats] = useState({ nodes: 0, edges: 0 });

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b-2 border-black/10 px-6 py-3 bg-[var(--paper)] z-10">
        <Link
          to="/"
          className="font-hand text-2xl font-bold hover:opacity-70 transition-opacity"
        >
          ← grafo
        </Link>
        <span className="text-xs font-medium text-black/50 bg-black/5 rounded-full px-3 py-1">
          N = {stats.nodes} · arestas = {stats.edges}
        </span>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <GraphCanvas mode={mode} layoutMode={layoutMode} onStats={setStats} />
        </div>

        <aside className="w-60 shrink-0 border-l-2 border-black/10 bg-[var(--paper)] px-5 py-6 flex flex-col gap-6 overflow-y-auto">
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