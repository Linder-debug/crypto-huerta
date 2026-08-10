"use client";

import { useEffect, useState } from "react";

const FALLBACK_ETH_USD = 3000; // Solo se usa si fallan TODAS las APIs (marcado como "referencial")

/**
 * Obtiene el tipo de cambio ETH/USD en vivo (CoinGecko, con Binance de respaldo).
 */
export function useEthUsdPrice() {
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchPrice = async () => {
      // 1) CoinGecko
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        if (res.ok) {
          const data = await res.json();
          const price = data?.ethereum?.usd;
          if (typeof price === "number" && price > 0 && !cancelled) {
            setEthUsd(price);
            setIsLive(true);
            return;
          }
        }
      } catch {
        // silencioso, intenta el respaldo
      }
      // 2) Binance (respaldo)
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
        if (res.ok) {
          const data = await res.json();
          const price = parseFloat(data?.price);
          if (!isNaN(price) && price > 0 && !cancelled) {
            setEthUsd(price);
            setIsLive(true);
            return;
          }
        }
      } catch {
        // silencioso
      }
      // 3) Fallback
      if (!cancelled) {
        setEthUsd(FALLBACK_ETH_USD);
        setIsLive(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { ethUsd, isLive };
}

/** Formatea números pequeños como precios de token sin perder decimales */
export function formatUsd(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return "$—";
  if (value === 0) return "$0.00";
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(6)}`;
}
