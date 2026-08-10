"use client";

// ---------- Datos reales campaña 2025-26 (Fuente: Resultados Fundo Azul) ----------
const PRECIO_FOB = [
  { mes: "Ago", precio: 11.07 },
  { mes: "Set", precio: 10.85 },
  { mes: "Oct", precio: 11.14 },
  { mes: "Nov", precio: 6.82 },
  { mes: "Dic", precio: 5.75 },
  { mes: "Ene", precio: 7.46 },
  { mes: "Feb", precio: 8.62 },
  { mes: "Mar", precio: 8.62 },
];

// Pronóstico referencial: estabilidad al precio de cierre de campaña
const PRONOSTICO = [
  { mes: "Abr", precio: 8.62 },
  { mes: "May", precio: 8.62 },
  { mes: "Jun", precio: 8.62 },
];

const KILOS_DESTINO = [
  { destino: "Asia", kilos: 37440 },
  { destino: "Europa", kilos: 161264 },
  { destino: "Latam", kilos: 1440 },
  { destino: "Norteam.", kilos: 306510 },
];

type DatoRendimiento = { mes: string; esperado: number; real: number };

/** Barras agrupadas: programado (violeta) vs real (verde) */
export function GraficoRendimiento({ datos }: { datos: DatoRendimiento[] }) {
  const max = Math.max(...datos.map(d => Math.max(d.esperado, d.real)));
  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-violet-500 inline-block" /> Programado
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-lime-500 inline-block" /> Real
        </span>
      </div>
      <div className="flex items-end gap-2 sm:gap-4 h-40">
        {datos.map(d => (
          <div key={d.mes} className="flex-1 flex flex-col items-center justify-end h-full">
            <div
              className="flex items-end gap-1 w-full justify-center h-full"
              title={`${d.mes}: programado ${d.esperado} kg / real ${d.real} kg`}
            >
              <div className="w-3 sm:w-5 bg-violet-500 rounded-t" style={{ height: `${(d.esperado / max) * 100}%` }} />
              <div className="w-3 sm:w-5 bg-lime-500 rounded-t" style={{ height: `${(d.real / max) * 100}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 mt-1">{d.mes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Línea verde: precio FOB real · línea gris punteada: pronóstico referencial */
export function GraficoPrecioFOB() {
  const todos = [...PRECIO_FOB, ...PRONOSTICO];
  const max = 12;
  const min = 4;
  const W = 340;
  const H = 150;
  const padX = 16;
  const padTop = 16;
  const padBottom = 24;
  const x = (i: number) => padX + (i * (W - padX * 2)) / (todos.length - 1);
  const y = (p: number) => padTop + (1 - (p - min) / (max - min)) * (H - padTop - padBottom);

  const lineaReal = PRECIO_FOB.map((d, i) => `${x(i)},${y(d.precio)}`).join(" ");
  const lineaPron = [PRECIO_FOB[PRECIO_FOB.length - 1], ...PRONOSTICO]
    .map((d, i) => `${x(PRECIO_FOB.length - 1 + i)},${y(d.precio)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <polyline points={lineaReal} fill="none" stroke="#a3e635" strokeWidth="2" />
      <polyline points={lineaPron} fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4 3" />
      {todos.map((d, i) => (
        <g key={d.mes}>
          <circle cx={x(i)} cy={y(d.precio)} r="2.5" fill={i < PRECIO_FOB.length ? "#a3e635" : "#9ca3af"} />
          <text x={x(i)} y={y(d.precio) - 5} textAnchor="middle" fontSize="7" fill="#9ca3af">
            {d.precio.toFixed(2)}
          </text>
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="7" fill="#9ca3af">
            {d.mes}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Barras fucsia: kilos exportados por destino */
export function GraficoKilosDestino() {
  const max = Math.max(...KILOS_DESTINO.map(k => k.kilos));
  return (
    <div className="flex items-end gap-2 sm:gap-6 h-40">
      {KILOS_DESTINO.map(k => (
        <div key={k.destino} className="flex-1 flex flex-col items-center justify-end h-full">
          <span className="text-[9px] sm:text-[11px] text-gray-400 mb-1">{k.kilos.toLocaleString("en-US")}</span>
          <div
            className="w-full max-w-[60px] bg-fuchsia-600 rounded-t"
            style={{ height: `${(k.kilos / max) * 85}%` }}
            title={`${k.destino}: ${k.kilos.toLocaleString("en-US")} kg`}
          />
          <span className="text-[10px] sm:text-xs text-gray-400 mt-1">{k.destino}</span>
        </div>
      ))}
    </div>
  );
}
