import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

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

function construirPrompt(): string {
  const fecha = new Date().toISOString();
  return `Eres un analista del sector agrícola peruano. Fecha actual: ${fecha}.
Genera contenido informativo breve y orientativo (sin citar fuentes específicas) sobre el sector de arándanos y la tokenización de activos reales (RWA).

Devuelve ÚNICAMENTE un JSON válido, sin markdown y sin texto adicional, con este formato exacto:
{
  "noticias": [
    { "emoji": "🇵🇪", "titulo": "máx 30 caracteres", "detalle": "máx 180 caracteres" },
    { "emoji": "🌏", "titulo": "máx 30 caracteres", "detalle": "máx 180 caracteres" },
    { "emoji": "🔗", "titulo": "máx 30 caracteres", "detalle": "máx 180 caracteres" }
  ],
  "pronostico": "máx 200 caracteres: pronóstico del sector para los próximos meses"
}

Temas obligatorios: 1) posición de Perú como exportador mundial de arándanos, 2) demanda y precios internacionales, 3) tokenización de activos agrícolas reales (RWA) en blockchain.`;
}

function parsearJson(texto: string): Omit<NoticiasData, "fuente"> | null {
  try {
    const limpio = texto
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const inicio = limpio.indexOf("{");
    const fin = limpio.lastIndexOf("}");
    if (inicio === -1 || fin === -1) return null;
    const data = JSON.parse(limpio.slice(inicio, fin + 1));
    if (!Array.isArray(data.noticias) || data.noticias.length < 3) return null;
    return {
      noticias: (data.noticias as Array<Record<string, unknown>>).slice(0, 3).map(n => ({
        emoji: typeof n.emoji === "string" ? n.emoji : "📰",
        titulo: typeof n.titulo === "string" ? n.titulo : "Noticia del sector",
        detalle: typeof n.detalle === "string" ? n.detalle : "",
      })),
      pronostico: typeof data.pronostico === "string" ? data.pronostico : FALLBACK.pronostico,
    };
  } catch {
    return null;
  }
}

async function llamarOpenRouter(prompt: string): Promise<string | null> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.8,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.warn(`OpenRouter noticias falló con status ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.warn("Error llamando a OpenRouter (noticias):", error);
    return null;
  }
}

export async function GET() {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ ...FALLBACK });
  }
  const texto = await llamarOpenRouter(construirPrompt());
  if (texto) {
    const parsed = parsearJson(texto);
    if (parsed) {
      return NextResponse.json({ ...parsed, fuente: "ia" });
    }
  }
  return NextResponse.json({ ...FALLBACK });
}
