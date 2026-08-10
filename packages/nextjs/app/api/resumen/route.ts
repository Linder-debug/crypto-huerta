// packages/nextjs/app/api/resumen/route.ts
import { NextResponse } from "next/server";

// Forzar que esta ruta NUNCA se cacheé en Next.js
export const dynamic = "force-dynamic";
export const revalidate = 0;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

const loteData = {
  ubicacion: "Piura, Perú",
  cultivo: "Arándanos Premium",
  lote: "1000 m² (500 plantas)",
  precio: "0.001 ETH",
  ultimoHash: "0x...",
};

function construirPrompt() {
  const timestamp = new Date().toISOString();
  return `Genera un resumen ejecutivo breve (máximo 120 palabras) del estado semanal de un lote de arándanos premium en CryptoHuerta. 

Datos del lote: ubicación ${loteData.ubicacion}, cultivo ${loteData.cultivo}, tamaño ${loteData.lote}.

Fecha actual: ${timestamp}

Incluye: 
1) estimación de producción de la semana, 
2) un riesgo a vigilar (clima, plagas, riego), 
3) una recomendación concreta. 

Tono profesional pero cercano, en español. Sé específico y variado en cada respuesta.`;
}

// Resumen simulado con datos reales del lote
function resumenSimulado(ultimoHash?: string): string {
  const semana = Math.ceil((Date.now() / (1000 * 60 * 60 * 24 * 7)) % 52);
  const hashMostrar =
    ultimoHash && ultimoHash !== "0x0000000000000000000000000000000000000000000000000000000000000000"
      ? ultimoHash.slice(0, 10) + "..."
      : "no registrado";

  const variaciones = [
    "El cultivo se encuentra en etapa de desarrollo vegetativo activo, con proyección de rendimiento dentro del rango esperado.",
    "Las plantas muestran un buen desarrollo foliar y se espera una floración uniforme en las próximas semanas.",
    "El monitoreo agronómico indica condiciones óptimas para el desarrollo del fruto.",
  ];
  const riesgoVariaciones = [
    "condiciones de humedad relativa en la zona costera de Piura — se recomienda monitoreo del sistema de riego tecnificado.",
    "posibles variaciones de temperatura nocturna que podrían afectar la floración — mantener cobertores activos.",
    "presencia de trips en monitoreos preliminares — aplicar control biológico según protocolo.",
  ];
  const recomendacionVariaciones = [
    "mantener el calendario de fertirriego según el plan agronómico y verificar el próximo hash de trazabilidad.",
    "realizar muestreo de suelo para ajustar dosis de fertilización en el próximo ciclo.",
    "programar poda de formación en las plantas jóvenes para optimizar estructura de la planta.",
  ];

  const randomIdx = semana % 3;
  const randomRiesgo = (semana + 1) % 3;
  const randomRecom = (semana + 2) % 3;

  return (
    `📊 Resumen semana ${semana} — Lote ${loteData.lote}, ${loteData.cultivo}, ${loteData.ubicacion}.\n\n` +
    `🔍 Producción estimada: ${variaciones[randomIdx]}\n\n` +
    `⚠️ Riesgo a vigilar: ${riesgoVariaciones[randomRiesgo]}\n\n` +
    `✅ Recomendación: ${recomendacionVariaciones[randomRecom]}\n\n` +
    `🔗 Último hash de trazabilidad: ${hashMostrar}`
  );
}

// Función para intentar la IA real usando openrouter
async function llamarOpenRouter(prompt: string): Promise<string | null> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openrouter/auto", // Auto selecciona el mejor modelo disponible
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.8, // Más variación en las respuestas
      }),
      cache: "no-store", // Evitar cache del proxy
    });

    if (!response.ok) {
      console.warn(`OpenRouter falló con status ${response.status}`);
      const errorText = await response.text();
      console.warn("Error response:", errorText);
      return null;
    }

    const data = await response.json();
    const resumen = data.choices?.[0]?.message?.content;
    return resumen || null;
  } catch (error) {
    console.warn("Error llamando a OpenRouter:", error);
    return null;
  }
}

export async function GET() {
  // Sin API key -> resumen simulado
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ resumen: resumenSimulado(), fuente: "simulado (sin API key)" });
  }

  const prompt = construirPrompt();
  const resumen = await llamarOpenRouter(prompt);

  if (resumen) {
    return NextResponse.json({ resumen, fuente: "ia (openrouter)" });
  }

  // Si la IA falla, usamos el resumen simulado
  return NextResponse.json({ resumen: resumenSimulado(), fuente: "simulado (fallback)" });
}
