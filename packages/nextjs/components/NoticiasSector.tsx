"use client";

import { useEffect, useState } from "react";

type Noticia = { emoji: string; titulo: string; detalle: string };
type NoticiasData = { noticias: Noticia[]; pronostico: string; fuente: string };

const FALLBACK: NoticiasData = {
  noticias: [
    {
      emoji: "🇵🇪",
      titulo: "Perú, líder mundial",
      detalle: "Perú se mantiene como el primer exportador mundial de arándanos, con campañas que crecen año tras año.",
    },
    {
      emoji: "🌏",
      titulo: "Demanda global al alza",
      detalle:
        "Europa, Asia y Norteamérica aumentan sus importaciones de arándano peruano en la ventana octubre–abril.",
    },
    {
      emoji: "🔗",
      titulo: "Tokenización del agro",
      detalle:
        "La tokenización de activos reales abre el agro a inversores fraccionales con liquidez y trazabilidad verificable.",
    },
  ],
  pronostico:
    "Se espera que la demanda global de arándanos siga creciendo a doble dígito, impulsada por Asia y Europa.",
  fuente: "referencial",
};

export default function NoticiasSector() {
  const [data, setData] = useState<NoticiasData>(FALLBACK);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/noticias", { cache: "no-store" });
        if (res.ok) {
          const d = await res.json();
          if (!cancelled && Array.isArray(d?.noticias) && d.noticias.length >= 3) {
            setData(d);
          }
        }
      } catch {
        // mantiene el fallback
      } finally {
        if (!cancelled) setCargando(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">
        📰 El mercado nos respalda
      </h2>
      <div className="grid grid-cols-3 gap-2 sm:gap-8">
        {data.noticias.map((n, i) => (
          <div key={i} className="card bg-base-200 shadow-xl">
            <div className="card-body p-2 sm:p-6">
              <h3 className="card-title text-xs sm:text-base">
                {n.emoji} {n.titulo}
              </h3>
              {cargando ? (
                <div className="flex flex-col gap-2 animate-pulse">
                  <div className="h-2 bg-base-300 rounded w-full" />
                  <div className="h-2 bg-base-300 rounded w-full" />
                  <div className="h-2 bg-base-300 rounded w-2/3" />
                </div>
              ) : (
                <p className="text-[10px] sm:text-sm">{n.detalle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {!cargando && data.pronostico && (
        <p className="text-center text-xs sm:text-base mt-4 sm:mt-6 italic text-gray-500 px-2">🔮 {data.pronostico}</p>
      )}
      <p className="text-center text-[10px] sm:text-sm text-gray-500 mt-2 sm:mt-4">
        {data.fuente === "ia" ? "Resumen del sector generado con IA" : "Resumen referencial del sector"} · Agosto 2026
      </p>
    </section>
  );
}
