"use client";

import { useAccount, useContractRead, useContractWrite, useWaitForTransactionReceipt } from "wagmi";
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { toast } from "react-hot-toast";
import deployedContracts from "~~/contracts/deployedContracts";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

export default function CryptoHuertaPage() {
  const { address, isConnected } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const [cantidadTokens, setCantidadTokens] = useState("");
  const [ethAmount, setEthAmount] = useState("");

  // Obtener el contrato desde deployedContracts (asegurando que exista en la red local)
  const contract = deployedContracts[targetNetwork.id]?.CryptoHuertaToken;

  // Estado para los datos del contrato
  const [balance, setBalance] = useState<bigint | undefined>(undefined);
  const [precio, setPrecio] = useState<bigint | undefined>(undefined);
  const [ultimoHash, setUltimoHash] = useState<string | undefined>(undefined);
  const [ubicacion, setUbicacion] = useState<string | undefined>(undefined);
  const [cultivo, setCultivo] = useState<string | undefined>(undefined);

  // Leer balance
  const { data: balanceData, refetch: refetchBalance } = useContractRead({
    address: contract?.address,
    abi: contract?.abi,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: !!contract && !!address },
  });

  // Leer precio
  const { data: precioData } = useContractRead({
    address: contract?.address,
    abi: contract?.abi,
    functionName: "obtenerPrecio",
    query: { enabled: !!contract },
  });

  // Leer último hash
  const { data: ultimoHashData } = useContractRead({
    address: contract?.address,
    abi: contract?.abi,
    functionName: "ultimoHash",
    query: { enabled: !!contract },
  });

  // Leer ubicación
  const { data: ubicacionData } = useContractRead({
    address: contract?.address,
    abi: contract?.abi,
    functionName: "ubicacion",
    query: { enabled: !!contract },
  });

  // Leer cultivo
  const { data: cultivoData } = useContractRead({
    address: contract?.address,
    abi: contract?.abi,
    functionName: "cultivo",
    query: { enabled: !!contract },
  });

  // Escribir: comprar tokens
  const { writeContractAsync: comprarTokens, data: comprarHash } = useContractWrite({
    address: contract?.address,
    abi: contract?.abi,
    functionName: "buyTokens",
  });

  // Escribir: vender tokens
  const { writeContractAsync: venderTokens, data: venderHash } = useContractWrite({
    address: contract?.address,
    abi: contract?.abi,
    functionName: "venderTokens",
  });

  // Esperar confirmación de compra y refrescar balance
  const { isLoading: isComprando } = useWaitForTransactionReceipt({
    hash: comprarHash,
    onSuccess: () => {
      refetchBalance();
      toast.success("✅ Tokens comprados!");
    },
  });

  // Esperar confirmación de venta
  const { isLoading: isVendiendo } = useWaitForTransactionReceipt({
    hash: venderHash,
    onSuccess: () => {
      refetchBalance();
      toast.success("✅ Tokens vendidos!");
    },
  });

  // Actualizar estado local cuando los datos de lectura cambien
  useEffect(() => {
    setBalance(balanceData);
    setPrecio(precioData);
    setUltimoHash(ultimoHashData);
    setUbicacion(ubicacionData);
    setCultivo(cultivoData);
  }, [balanceData, precioData, ultimoHashData, ubicacionData, cultivoData]);

  const handleComprar = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      toast.error("Ingresa un monto en ETH válido");
      return;
    }
    if (!contract) {
      toast.error("Contrato no disponible");
      return;
    }
    try {
      await comprarTokens({ value: parseEther(ethAmount) });
    } catch (e) {
      console.error(e);
      toast.error("❌ Error al comprar tokens");
    }
  };

  const handleVender = async () => {
    if (!cantidadTokens || parseFloat(cantidadTokens) <= 0) {
      toast.error("Ingresa una cantidad válida de tokens");
      return;
    }
    if (!contract) {
      toast.error("Contrato no disponible");
      return;
    }
    try {
      await venderTokens({ args: [parseEther(cantidadTokens)] });
    } catch (e) {
      console.error(e);
      toast.error("❌ Error al vender tokens");
    }
  };

  if (!contract) {
    return (
      <div className="p-4 text-error text-center">
        Contrato CryptoHuertaToken no encontrado. Asegúrate de que la red local (Hardhat) esté activa y el contrato
        desplegado.
      </div>
    );
  }

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

      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Información del lote</h2>
        <p>
          <span className="font-medium">Ubicación:</span> {ubicacion || "Cargando..."}
        </p>
        <p>
          <span className="font-medium">Cultivo:</span> {cultivo || "Cargando..."}
        </p>
        <p>
          <span className="font-medium">Precio actual (1 CHT):</span> {precio ? formatEther(precio) : "..."} ETH
        </p>
      </div>

      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Tu balance</h2>
        <p className="text-2xl font-bold">{balance ? formatEther(balance) : "0"} CHT</p>
      </div>

      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Último informe de trazabilidad</h2>
        <p className="text-sm font-mono break-all">{ultimoHash || "No hay informes aún"}</p>
        {ultimoHash &&
          ultimoHash !== "0x0000000000000000000000000000000000000000000000000000000000000000" && (
            <a
              href={`https://sepolia.etherscan.io/tx/${ultimoHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-2 inline-block"
            >
              Ver en explorador
            </a>
          )}
      </div>

      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Comprar CHT</h2>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            placeholder="Cantidad de ETH a invertir"
            className="input input-bordered w-full"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleComprar} disabled={isComprando}>
            {isComprando ? "Procesando..." : "Comprar tokens"}
          </button>
        </div>
      </div>

      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Vender CHT</h2>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            placeholder="Cantidad de CHT a vender"
            className="input input-bordered w-full"
            value={cantidadTokens}
            onChange={(e) => setCantidadTokens(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleVender} disabled={isVendiendo}>
            {isVendiendo ? "Procesando..." : "Vender tokens"}
          </button>
        </div>
      </div>
    </div>
  );
}