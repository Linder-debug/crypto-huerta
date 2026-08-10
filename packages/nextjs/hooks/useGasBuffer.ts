"use client";

import { usePublicClient } from "wagmi";

/**
 * Buffer de gas (x2) para evitar el error intermitente de Arbitrum:
 * "max fee per gas less than block base fee"
 */
export function useGasBuffer() {
  const publicClient = usePublicClient();

  const getGasOverrides = async (): Promise<{ maxFeePerGas: bigint; maxPriorityFeePerGas?: bigint } | undefined> => {
    try {
      if (!publicClient) return undefined;
      const fees = await publicClient.estimateFeesPerGas();
      if (!fees || !fees.maxFeePerGas) return undefined;
      return {
        maxFeePerGas: fees.maxFeePerGas * 2n,
        maxPriorityFeePerGas: fees.maxPriorityFeePerGas ? fees.maxPriorityFeePerGas * 2n : undefined,
      };
    } catch (e) {
      console.error("No se pudo estimar gas, usando default", e);
      return undefined;
    }
  };

  return { getGasOverrides };
}
