"use client";

// ===== DATA REAL CAMPAÑA 2025-26 (Fuente: Resultados Fundo Azul · Agroextiende) =====
export const PRODUCCION_MENSUAL = [
  { mes: "Jun", kg: 1020 },
  { mes: "Jul", kg: 8348 },
  { mes: "Ago", kg: 37678 },
  { mes: "Set", kg: 48704 },
  { mes: "Oct", kg: 36279 },
  { mes: "Nov", kg: 96376 },
  { mes: "Dic", kg: 134030 },
  { mes: "Ene", kg: 150019 },
  { mes: "Feb", kg: 99845 },
  { mes: "Mar", kg: 51944 },
];

export const TOTAL_25_26 = 662579; // kg cosechados según informe

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

// Proyección campaña ACTUAL 2026-27: recuperación hacia ~US$10 (presentación Fundo Azul)
const PRONOSTICO_26_27 = [
  { mes: "Ago 26", precio: 9.0 },
  { mes: "Oct 26", precio: 9.6 },
  { mes: "Dic 26", precio: 10.0 },
];

const KILOS_DESTINO = [
  { destino: "Asia", kilos: 37440 },
  { destino: "Europa", kilos: 161264 },
  { destino: "Latam", kilos: 1440 },
  { destino: "Norteam.", kilos: 306510 },
];

/** KPIs reales + producción mensual real 25-26 */
export function GraficoRendimiento() {
  const max = Math.max(...PRODUCCION_MENSUAL.map(d => d.kg));
  return (
    <div>
      {/* KPIs del informe */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        <div className="bg-base-200 rounded-lg p-2 md:p-3 text-center">
          <p className="text-[10px] md:text-xs text-gray-500">Real 25-26</p>
          <p className="text-sm md:text-lg font-bold text-lime-500">816 kg/lote</p>
        </div>
        <div className="bg-base-200 rounded-lg p-2 md:p-3 text-center">
          <p className="text-[10px] md:text-xs text-gray-500">Programado 26-27</p>
          <p className="text-sm md:text-lg font-bold text-violet-500">1,960 kg/lote</p>
        </div>
        <div className="bg-base-200 rounded-lg p-2 md:p-3 text-center">
          <p className="text-[10px] md:text-xs text-gray-500">Cosechado 25-26</p>
          <p className="text-sm md:text-lg font-bold">662,579 kg</p>
        </div>
        <div className="bg-base-200 rounded-lg p-2 md:p-3 text-center">
          <p className="text-[10px] md:text-xs text-gray-500">Rendimiento</p>
          <p className="text-sm md:text-lg font-bold">1.65 kg/planta</p>
        </div>
      </div>

      {/* Producción mensual real */}
      <p className="text-sm font-medium mb-2">Producción mensual real · Campaña 2025-26 (kg)</p>
      <div className="flex items-end gap-1 sm:gap-2 h-36">
        {PRODUCCION_MENSUAL.map(d => (
          <div key={d.mes} className="flex-1 flex flex-col items-center justify-end h-full">
            <div
              className="w-full max-w-[34px] bg-lime-500 rounded-t"
              style={{ height: `${(d.kg / max) * 100}%` }}
              title={`${d.mes}: ${d.kg.toLocaleString("en-US")} kg`}
            />
            <span className="text-[9px] text-gray-400 mt-1">{d.mes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Línea verde: precio FOB real 25-26 · punteada gris: proyección campaña actual 26-27 */
export function GraficoPrecioFOB() {
  const todos = [...PRECIO_FOB, ...PRONOSTICO_26_27];
  const max = 12;
  const min = 4;
  const W = 360;
  const H = 150;
  const padX = 16;
  const padTop = 16;
  const padBottom = 24;
  const x = (i: number) => padX + (i * (W - padX * 2)) / (todos.length - 1);
  const y = (p: number) => padTop + (1 - (p - min) / (max - min)) * (H - padTop - padBottom);

  const lineaReal = PRECIO_FOB.map((d, i) => `${x(i)},${y(d.precio)}`).join(" ");
  const lineaPron = [PRECIO_FOB[PRECIO_FOB.length - 1], ...PRONOSTICO_26_27]
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
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="6.5" fill="#9ca3af">
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
