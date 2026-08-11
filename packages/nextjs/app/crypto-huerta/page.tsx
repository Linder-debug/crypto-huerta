"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { formatEther, parseEther } from "viem";
import { useAccount, useWatchBlockNumber } from "wagmi";
import {
  GraficoKilosDestino,
  GraficoPrecioFOB,
  GraficoRendimiento,
  PRODUCCION_MENSUAL,
  TOTAL_25_26,
} from "~~/components/GraficosFundoAzul";
import { useScaffoldReadContract, useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { formatUsd, useEthUsdPrice } from "~~/hooks/useEthUsdPrice";
import { useGasBuffer } from "~~/hooks/useGasBuffer";

type IoTData = {
  temperatura: number;
  humedad: number;
  riego: "activo" | "inactivo";
  timestamp: number;
};

export default function CryptoHuertaPage() {
  const { address, isConnected } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const [cantidadTokens, setCantidadTokens] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [isComprando, setIsComprando] = useState(false);
  const [isVendiendo, setIsVendiendo] = useState(false);

  const [resumenIA, setResumenIA] = useState("");
  const [cargandoIA, setCargandoIA] = useState(false);

  const [mostrarTabla, setMostrarTabla] = useState(false);

  const [iotData, setIoTData] = useState<IoTData>({
    temperatura: 0,
    humedad: 0,
    riego: "inactivo",
    timestamp: 0,
  });
  const [historicoIoT, setHistoricoIoT] = useState<IoTData[]>([]);

  const { ethUsd, isLive } = useEthUsdPrice();
  const { getGasOverrides } = useGasBuffer();

  // ---- LECTURAS ----
  const { data: balance, refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "CryptoHuertaToken",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: precio } = useScaffoldReadContract({
    contractName: "CryptoHuertaToken",
    functionName: "obtenerPrecio",
  });

  const { data: ultimoHash } = useScaffoldReadContract({
    contractName: "CryptoHuertaToken",
    functionName: "ultimoHash",
  });

  const { data: ubicacion } = useScaffoldReadContract({
    contractName: "CryptoHuertaToken",
    functionName: "ubicacion",
  });

  const { data: cultivo } = useScaffoldReadContract({
    contractName: "CryptoHuertaToken",
    functionName: "cultivo",
  });

  const { data: historial } = useScaffoldReadContract({
    contractName: "CryptoHuertaToken",
    functionName: "obtenerHistorial",
  });

  useWatchBlockNumber({
    chainId: targetNetwork.id,
    onBlockNumber() {
      refetchBalance();
    },
  });

  const { writeContractAsync: writeCryptoHuertaAsync } = useScaffoldWriteContract({
    contractName: "CryptoHuertaToken",
  });

  // ---- DERIVADOS PRICING USDC ----
  const precioEth = precio !== undefined ? Number(formatEther(precio)) : null;
  const precioUsd = precioEth !== null && ethUsd ? precioEth * ethUsd : null;

  const usdNum = parseFloat(usdAmount);
  const ethEquivalente = !isNaN(usdNum) && usdNum > 0 && ethUsd ? usdNum / ethUsd : null;
  const tokensEstimados = ethEquivalente !== null && precioEth ? ethEquivalente / precioEth : null;

  const tokensAVender = parseFloat(cantidadTokens);
  const ethVenta = !isNaN(tokensAVender) && tokensAVender > 0 && precioEth ? tokensAVender * precioEth : null;
  const usdVenta = ethVenta !== null && ethUsd ? ethVenta * ethUsd : null;

  const handleComprar = async () => {
    if (!usdAmount || isNaN(usdNum) || usdNum <= 0) {
      toast.error("Ingresa un monto válido en USDC");
      return;
    }
    if (!ethUsd) {
      toast.error("Esperando el tipo de cambio ETH/USD...");
      return;
    }
    try {
      setIsComprando(true);
      const gas = await getGasOverrides();
      await writeCryptoHuertaAsync({
        functionName: "buyTokens",
        value: parseEther((usdNum / ethUsd).toFixed(9)),
        ...gas,
      });
      toast.success("✅ Tokens comprados!");
      setUsdAmount("");
      await refetchBalance();
    } catch (e) {
      console.error(e);
      toast.error("❌ Error al comprar tokens");
    } finally {
      setIsComprando(false);
    }
  };

  const handleVender = async () => {
    if (!cantidadTokens || isNaN(tokensAVender) || tokensAVender <= 0) {
      toast.error("Ingresa una cantidad válida de tokens");
      return;
    }
    try {
      setIsVendiendo(true);
      const gas = await getGasOverrides();
      await writeCryptoHuertaAsync({
        functionName: "venderTokens",
        args: [parseEther(cantidadTokens)],
        ...gas,
      });
      toast.success("✅ Tokens vendidos!");
      setCantidadTokens("");
      await refetchBalance();
    } catch (e) {
      console.error(e);
      toast.error("❌ Error al vender tokens");
    } finally {
      setIsVendiendo(false);
    }
  };

  const handleGenerarResumen = async () => {
    setCargandoIA(true);
    setResumenIA("");
    try {
      const res = await fetch("/api/resumen");
      const data = await res.json();
      let texto = data.resumen || "No se pudo generar el resumen.";
      texto = texto.replace(/User Safety:\s*safe/gi, "");
      texto = texto.replace(/We need to produce a brief executive summary.*?(?=\n\n|$)/gi, "");
      texto = texto.replace(/^Draft:/i, "");
      texto = texto.replace(/^Response:/i, "");
      texto = texto.trim();
      if (!texto) {
        texto = "No se pudo generar un resumen válido. Intenta nuevamente.";
      }
      setResumenIA(texto);
    } catch (error) {
      console.error(error);
      setResumenIA("Error al generar el resumen.");
    } finally {
      setCargandoIA(false);
    }
  };

  useEffect(() => {
    const generarDatos = (): IoTData => {
      const temp = 20 + Math.random() * 10;
      const hum = 45 + Math.random() * 35;
      const riego = hum < 50 ? "activo" : "inactivo";
      return {
        temperatura: Math.round(temp * 10) / 10,
        humedad: Math.round(hum * 10) / 10,
        riego,
        timestamp: Date.now(),
      };
    };

    const primerDato = generarDatos();
    setIoTData(primerDato);
    setHistoricoIoT([primerDato]);

    const intervalo = setInterval(() => {
      const nuevoDato = generarDatos();
      setIoTData(nuevoDato);
      setHistoricoIoT(prev => {
        const nuevo = [...prev, nuevoDato];
        if (nuevo.length > 20) nuevo.shift();
        return nuevo;
      });
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Conecta tu wallet para ver tu inversión en CryptoHuerta</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🌱 CryptoHuerta - Tu inversión en arándanos</h1>

      {/* Información del lote */}

      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6 relative overflow-hidden">
        {/* Fondo solo en móvil */}
        <div
          className="absolute inset-0 md:hidden bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/img/arandanos.jpg')" }}
        />
        <div className="relative flex flex-col md:flex-row gap-4 md:gap-6 items-stretch md:items-center">
          <div className="flex-1 w-full">
            <h2 className="text-xl font-semibold mb-2">Información del lote</h2>
            <p>
              <span className="font-medium">Ubicación:</span> {ubicacion || "Cargando..."}
            </p>
            <p>
              <span className="font-medium">Cultivo:</span> {cultivo || "Cargando..."}
            </p>
            <p>
              <span className="font-medium">Precio actual (1 CHT):</span>{" "}
              {precioUsd !== null ? (
                <>
                  <span className="font-bold text-success">{formatUsd(precioUsd)} USDC</span>{" "}
                  <span className="text-xs text-base-content/60">
                    ({precio !== undefined ? formatEther(precio) : "..."} ETH)
                  </span>
                </>
              ) : (
                "..."
              )}
            </p>
            <p className="text-xs text-base-content/60 mt-1">
              <span className="font-medium">Tipo de cambio ETH/USD:</span>{" "}
              {ethUsd ? <span className="font-semibold">{formatUsd(ethUsd)}</span> : "cargando..."}
              {ethUsd && !isLive && " (referencial)"}
            </p>
          </div>
          {/* Imagen al costado solo en laptop */}
          <div className="hidden md:block w-64 shrink-0">
            <Image
              src="/img/arandanos.jpg"
              width={256}
              height={192}
              alt="Arándanos premium del lote"
              className="rounded-lg w-full h-64 object-cover shadow"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">Arándanos premium, Piura</p>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Tu balance</h2>
        <p className="text-2xl font-bold">{balance !== undefined ? formatEther(balance) : "0"} CHT</p>
        {balance !== undefined && precioUsd !== null && (
          <p className="text-sm text-gray-500">≈ {formatUsd(Number(formatEther(balance)) * precioUsd)} USDC</p>
        )}
      </div>

      {/* Hash actual */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Último informe de trazabilidad</h2>
        <p className="text-sm font-mono break-all">{ultimoHash || "No hay informes aún"}</p>
      </div>

      {/* Historial de informes */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">📋 Historial de informes</h2>
        {historial && historial.length > 0 ? (
          <ul className="list-disc pl-4 max-h-32 overflow-y-auto">
            {historial.map((hash: string, index: number) => (
              <li key={index} className="text-xs font-mono break-all">
                #{index + 1}: {hash}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay informes registrados aún.</p>
        )}
      </div>

      {/* Gráfico de rendimiento */}
      {/* Rendimiento del lote */}

      {/* Rendimiento de campañas */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">📊 Rendimiento: real 25-26 vs programado 26-27</h2>
        <p className="text-sm text-gray-500 mb-4">
          Producción real de la campaña cerrada y meta oficial por lote de la campaña actual (hoy, ago 2026).
        </p>
        <GraficoRendimiento />
        <button className="btn btn-ghost btn-sm mt-4" onClick={() => setMostrarTabla(v => !v)}>
          {mostrarTabla ? "▲ Ocultar tabla detallada" : "▼ Ver tabla detallada"}
        </button>
        {mostrarTabla && (
          <div className="overflow-x-auto mt-3">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Producción real (kg)</th>
                  <th>% de la campaña</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCCION_MENSUAL.map(d => (
                  <tr key={d.mes}>
                    <td>{d.mes}</td>
                    <td>{d.kg.toLocaleString("en-US")}</td>
                    <td>{((d.kg / TOTAL_25_26) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500">
          Fuente: Resultados integrales campaña 2025-26 y proyección 2026-27 · Fundo Azul (Agroextiende).
        </div>
      </div>

      {/* Mercado del arándano */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">🫐 Mercado del arándano · Campaña 2025-26</h2>
        <p className="text-sm text-gray-500 mb-4">
          Comportamiento real de ventas: precio promedio FOB y kilos exportados por destino.
        </p>
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Precio promedio FOB (US$/kg)</h3>
          <GraficoPrecioFOB />
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1.5 bg-lime-400 inline-block rounded" /> Real campaña 25-26
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1.5 bg-gray-400 inline-block rounded" /> Proyección campaña 26-27 (hacia ~US$10)
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Kilos exportados por destino</h3>
          <GraficoKilosDestino />
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Fuente: Resultados campaña 2025-26 · Fundo Azul (Agroextiende).
        </div>
      </div>

      {/* IoT */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">📡 Datos del huerto (IoT)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Datos simulados de sensores en tiempo real (actualización cada 5 segundos).
        </p>
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
          <div className="bg-base-200 p-2 md:p-4 rounded-lg text-center">
            <p className="text-xs md:text-sm text-gray-500">🌡️ Temperatura</p>
            <p className="text-lg md:text-2xl font-bold">{iotData.temperatura} °C</p>
          </div>
          <div className="bg-base-200 p-2 md:p-4 rounded-lg text-center">
            <p className="text-xs md:text-sm text-gray-500">💧 Humedad del suelo</p>
            <p className="text-lg md:text-2xl font-bold">{iotData.humedad} %</p>
          </div>
          <div className="bg-base-200 p-2 md:p-4 rounded-lg text-center">
            <p className="text-xs md:text-sm text-gray-500">💦 Riego</p>
            <p
              className={`text-lg md:text-2xl font-bold ${iotData.riego === "activo" ? "text-success" : "text-gray-400"}`}
            >
              {iotData.riego === "activo" ? "🟢 Activo" : "⚪ Inactivo"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">📊 Tendencia de temperatura (últimos registros)</p>
          <div className="flex items-end gap-1 h-24">
            {historicoIoT.slice(-10).map((dato, index) => (
              <div key={index} className="flex-1 flex flex-col items-center" style={{ height: "100%" }}>
                <div
                  className="w-full bg-primary rounded-t"
                  style={{ height: `${Math.min((dato.temperatura / 35) * 100, 100)}%`, minHeight: "4px" }}
                />
                <span className="text-[8px] text-gray-400 mt-1">
                  {new Date(dato.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprar */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Comprar CHT</h2>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            placeholder="Monto a invertir en USDC (ej. 5)"
            className="input input-bordered w-full"
            value={usdAmount}
            onChange={e => setUsdAmount(e.target.value)}
          />
          {ethEquivalente !== null && (
            <p className="text-sm text-gray-500">
              ≈ {ethEquivalente.toFixed(6)} ETH · Recibirás ≈{" "}
              {tokensEstimados !== null ? tokensEstimados.toFixed(2) : "0"} CHT
            </p>
          )}
          <button className="btn btn-primary" onClick={handleComprar} disabled={isComprando}>
            {isComprando ? "Procesando..." : "Comprar tokens"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          El pago se ejecuta en ETH de Arbitrum Sepolia, al equivalente en USDC del momento.
        </p>
      </div>

      {/* Vender */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Vender CHT</h2>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            placeholder="Cantidad de CHT a vender"
            className="input input-bordered w-full"
            value={cantidadTokens}
            onChange={e => setCantidadTokens(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Precio actual:{" "}
            {precioUsd !== null ? (
              <span className="font-medium text-success">{formatUsd(precioUsd)} USDC por CHT</span>
            ) : (
              "..."
            )}
          </p>
          {ethVenta !== null && (
            <p className="text-sm font-medium text-success">
              Recibirás ≈ {formatUsd(usdVenta)} USDC{" "}
              <span className="text-xs text-gray-500">({ethVenta.toFixed(6)} ETH)</span>
            </p>
          )}
          <button className="btn btn-secondary" onClick={handleVender} disabled={isVendiendo}>
            {isVendiendo ? "Procesando..." : "Vender tokens"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          El pago se ejecuta en ETH de Arbitrum Sepolia, al equivalente en USDC del momento.
        </p>
      </div>

      {/* IA */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">🤖 Resumen del lote con IA</h2>
        <p className="text-sm text-gray-500 mb-4">
          Genera un resumen ejecutivo del estado del lote basado en los datos actuales.
        </p>
        <button className="btn btn-accent" onClick={handleGenerarResumen} disabled={cargandoIA}>
          {cargandoIA ? "Generando..." : "Generar resumen"}
        </button>
        {resumenIA && <div className="mt-4 p-4 bg-base-200 rounded-lg whitespace-pre-wrap">{resumenIA}</div>}
      </div>
    </div>
  );
}
