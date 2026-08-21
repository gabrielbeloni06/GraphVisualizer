import { Link } from "react-router-dom";
const heroNodes = [
  { id: "a", x: 70, y: 60, label: "a" },
  { id: "b", x: 40, y: 190, label: "b" },
  { id: "c", x: 220, y: 130, label: "c" },
  { id: "d", x: 230, y: 260, label: "d" },
];
const heroEdges: [string, string, boolean][] = [
  ["a", "b", false],
  ["a", "c", true],
  ["c", "b", false],
  ["c", "d", true],
];
function findNode(id: string) {
  return heroNodes.find((n) => n.id === id)!;
}
export default function Landing() {
  return (
    <div className="min-h-screen bg-dots flex flex-col">
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between">
        <span className="font-hand text-3xl font-bold">grafo</span>
        <Link
          to="/visualizer"
          className="rounded-full border-2 border-black/80 bg-white px-4 py-1.5 text-sm font-medium shadow-[3px_3px_0_rgba(0,0,0,0.8)] hover:-translate-y-0.5 transition-transform"
        >
          Abrir visualizador
        </Link>
      </header>
      <main className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-10 grid md:grid-cols-2 gap-12 items-center py-10">
          <div>
            <h1 className="font-hand text-6xl sm:text-7xl leading-[0.95] font-bold">
              monte grafos.
              <br />
              entenda grafos.
            </h1>
            <p className="mt-6 text-black/60 text-lg max-w-md">
              Clique para criar nós, clique para ligar arestas. Direcionado
              ou não — o grafo é seu. Classificação de arestas, grau e
              componentes conexos, tudo visual.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/visualizer"
                className="rounded-full bg-black text-white px-6 py-3 text-base font-medium shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-transform"
              >
                Começar a montar →
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-black/45">
              <li>nós &amp; arestas por clique</li>
              <li>direcionado / não direcionado</li>
              <li>grau &amp; componentes conexos</li>
              <li>árvore, retorno, avanço, cruzamento</li>
            </ul>
          </div>
          <div className="relative flex justify-center">
            <svg viewBox="0 0 300 320" className="w-full max-w-sm">
              <defs>
                <marker
                  id="heroArrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--ink)" />
                </marker>
              </defs>
              {heroEdges.map(([fromId, toId, directed], i) => {
                const from = findNode(fromId);
                const to = findNode(toId);
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const len = Math.hypot(dx, dy) || 1;
                const ux = dx / len;
                const uy = dy / len;
                const R = 34;
                const x1 = from.x + ux * R;
                const y1 = from.y + uy * R;
                const x2 = to.x - ux * R;
                const y2 = to.y - uy * R;
                return (
                  <g key={i}>
                    <line
                      x1={x1 + 3}
                      y1={y1 + 3}
                      x2={x2 + 3}
                      y2={y2 + 3}
                      stroke="var(--edge-glow)"
                      strokeWidth={9}
                      strokeLinecap="round"
                    />
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--ink)"
                      strokeWidth={3}
                      strokeLinecap="round"
                      markerEnd={directed ? "url(#heroArrow)" : undefined}
                    />
                  </g>
                );
              })}
              {heroNodes.map((n) => (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={34}
                    fill="var(--node-fill)"
                    stroke="var(--ink)"
                    strokeWidth={3}
                  />
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-hand"
                    fontSize={26}
                    fill="var(--ink)"
                  >
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}