"use client";

// ---------- DATOS REALES CAMPAÑA 2025-26 (Fuente: Resultados Fundo Azul · Agroextiende) ----------
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

// Pronóstico referencial: recuperación hacia ~US$10 (presentación Fundo Azul)
const PRONOSTICO = [
  { mes: "Abr", precio: 9.2 },
  { mes: "May", precio: 9.6 },
  { mes: "Jun", precio: 10.0 },
];

const KILOS_DESTINO = [
  { destino: "Asia", kilos: 37440 },
  { destino: "Europa", kilos: 161264 },
  { destino: "Latam", kilos: 1440 },
  { destino: "Norteam.", kilos: 306510 },
];

// Producción real mensual (kg) y programado proporcional = real × 1.2
// (objetivo ~2.0 kg/planta vs rendimiento real 1.65 kg/planta, según informe)
export const RENDIMIENTO = [
  { mes: "Ago", programado: 45214, real: 37678 },
  { mes: "Set", programado: 58445, real: 48704 },
  { mes: "Oct", programado: 43535, real: 36279 },
  { mes: "Nov", programado: 115651, real: 96376 },
  { mes: "Dic", programado: 160836, real: 134030 },
  { mes: "Ene", programado: 180023, real: 150019 },
  { mes: "Feb", programado: 119814, real: 99845 },
  { mes: "Mar", programado: 62333, real: 51944 },
];

/** Barras agrupadas: programado (violeta) vs real (verde) */
export function GraficoRendimiento() {
  const max = Math.max(...RENDIMIENTO.map(d => Math.max(d.programado, d.real)));
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
      <div className="flex items-end gap-1 sm:gap-4 h-40">
        {RENDIMIENTO.map(d => (
          <div key={d.mes} className="flex-1 flex flex-col items-center justify-end h-full">
            <div
              className="flex items-end gap-0.5 sm:gap-1 w-full justify-center h-full"
              title={`${d.mes}: programado ${d.programado.toLocaleString("en-US")} kg / real ${d.real.toLocaleString("en-US")} kg`}
            >
              <div
                className="w-2 sm:w-5 bg-violet-500 rounded-t"
                style={{ height: `${(d.programado / max) * 100}%` }}
              />
              <div className="w-2 sm:w-5 bg-lime-500 rounded-t" style={{ height: `${(d.real / max) * 100}%` }} />
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
