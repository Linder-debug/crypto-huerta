"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  // Leer el owner real del contrato (NO hardcodeado)
  const { data: owner } = useScaffoldReadContract({
    contractName: "CryptoHuertaToken",
    functionName: "owner",
  });

  // Leer el historial
  const { data: historial } = useScaffoldReadContract({
    contractName: "CryptoHuertaToken",
    functionName: "obtenerHistorial",
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "CryptoHuertaToken",
  });

  // Verificar si la wallet conectada es el owner
  const isOwner = owner?.toLowerCase() === address?.toLowerCase();

  const calcularHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleSubirInforme = async () => {
    if (!archivo) {
      toast.error("Selecciona un archivo primero");
      return;
    }
    try {
      const hash = await calcularHash(archivo);
      await writeContractAsync({
        functionName: "registrarInforme",
        args: [hash as `0x${string}`],
      });
      toast.success("✅ Informe registrado en blockchain");
      setArchivo(null);
      const input = document.getElementById("fileInput") as HTMLInputElement;
      if (input) input.value = "";
    } catch (e) {
      console.error(e);
      toast.error("❌ Error al registrar informe");
    }
  };

  const handleActualizarPrecio = async () => {
    if (!nuevoPrecio || parseFloat(nuevoPrecio) <= 0) {
      toast.error("Ingresa un precio válido en ETH");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "actualizarPrecio",
        args: [parseEther(nuevoPrecio)],
      });
      toast.success("✅ Precio actualizado");
      setNuevoPrecio("");
    } catch (e) {
      console.error(e);
      toast.error("❌ Error al actualizar precio");
    }
  };

  if (!isConnected) {
    return <div className="p-4">Conecta tu wallet para acceder al panel de administración</div>;
  }

  if (!isOwner) {
    return (
      <div className="p-4 space-y-2">
        <p className="text-error">⛔ No tienes permisos para acceder a esta página</p>
        <p className="text-sm">
          Owner del contrato: <span className="font-mono">{owner}</span>
        </p>
        <p className="text-sm">
          Tu wallet: <span className="font-mono">{address}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔧 Panel de administración</h1>

      {/* Subir informe */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Subir informe de trazabilidad</h2>
        <input
          id="fileInput"
          type="file"
          className="file-input file-input-bordered w-full mb-4"
          onChange={e => setArchivo(e.target.files?.[0] || null)}
        />
        <button className="btn btn-primary" onClick={handleSubirInforme}>
          Registrar hash en blockchain
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Se calculará el hash SHA-256 del archivo y se registrará en el contrato.
        </p>
      </div>

      {/* Actualizar precio */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Actualizar precio del token</h2>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            placeholder="Nuevo precio en ETH (ej. 0.002)"
            className="input input-bordered w-full"
            value={nuevoPrecio}
            onChange={e => setNuevoPrecio(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleActualizarPrecio}>
            Actualizar precio
          </button>
        </div>
      </div>

      {/* Historial de informes */}
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">📋 Historial de informes</h2>
        {historial && historial.length > 0 ? (
          <ul className="list-disc pl-4 max-h-48 overflow-y-auto">
            {historial.map((hash: string, index: number) => (
              <li key={index} className="text-sm font-mono break-all">
                #{index + 1}: {hash}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay informes registrados aún.</p>
        )}
      </div>
    </div>
  );
}
