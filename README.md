# 🌱 CryptoHuerta – Tokenización de inversión agrícola en Arbitrum

> **Democratizando el agro peruano con blockchain. Invierte desde fracciones de planta con transparencia radical y liquidez inmediata.**

[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel)](https://cryptohuerta.vercel.app)
[![Arbitrum](https://img.shields.io/badge/Network-Arbitrum_Sepolia-1A237E?style=for-the-badge&logo=ethereum)](https://sepolia.arbiscan.io/address/0xf01d8ecb37649fd75a2ff062192a23c9c9b9cba5)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.30-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Scaffold-ETH](https://img.shields.io/badge/Scaffold--ETH-2-4CAF50?style=for-the-badge)](https://scaffoldeth.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

- [📌 Resumen del proyecto](#resumen-del-proyecto)
- [🎯 Problema que resuelve](#problema-que-resuelve)
- [🔧 Solución técnica](#solución-técnica)
- [🏗️ Arquitectura del sistema](#arquitectura-del-sistema)
- [🚀 Demo en vivo](#demo-en-vivo)
- [📊 Modelo de negocio](#modelo-de-negocio)
- [🛠️ Tecnologías utilizadas](#tecnologías-utilizadas)
- [📦 Instalación y ejecución local](#instalación-y-ejecución-local)
- [📜 Smart Contract](#smart-contract)
- [👥 Equipo](#equipo)
- [📄 Licencia](#licencia)

---

## 📌 Resumen del proyecto

**CryptoHuerta** es una plataforma de tokenización de activos agrícolas construida sobre **Arbitrum Sepolia** que permite a pequeños inversores participar en la producción de arándanos de exportación desde montos accesibles, con trazabilidad verificable en blockchain y liquidez inmediata.

Nacimos de una experiencia real: **una inversión de S/53,800 en un lote de arándanos en Piura, con 11 años de capital atado y sin posibilidad de verificar el estado real de las plantas entre informe e informe.**

El proyecto utiliza **datos reales de la campaña 2025-26 de Fundo Azul (Agroextiende)** para sus gráficos de rendimiento, precio FOB y distribución de exportaciones.

---

## 🎯 Problema que resuelve

| Problema tradicional | Impacto |
|---|---|
| **Inversión mínima de S/53,800** | Excluye al 99% de los peruanos de la agroindustria |
| **Capital atado por 11 años** | Sin liquidez ni posibilidad de salida anticipada |
| **1 informe al año sin verificar** | Opacidad total, el inversor no puede auditar su inversión |
| **Sin trazabilidad** | No hay forma de saber si el rendimiento reportado es real |

**CryptoHuerta reduce la barrera de entrada en un 99.9%** (desde S/53,800 a fracciones de planta) y aporta transparencia radical con hash en blockchain.

---

## 🔧 Solución técnica

Tokenizamos **plantas de arándano**, no tierra. Cada token **CHT** representa una fracción de una planta real. El pricing se muestra en **USDC/USD** con tipo de cambio ETH/USD en vivo, para que el inversor no necesite entender ETH.

### Funcionalidades principales

| Módulo | Descripción |
|---|---|
| **Inversor** | Compra y vende CHT con pricing en USDC, consulta su balance, verifica el hash del último informe, ve gráficos de rendimiento (programado vs real) y de mercado (precio FOB y kilos por destino con data real de Fundo Azul), genera resúmenes con IA y monitorea datos IoT del huerto. |
| **Administrador (Owner)** | Sube informes (hash SHA-256 en blockchain), actualiza el precio del token en USDC, visualiza el historial completo de informes. |
| **IA** | Genera resúmenes ejecutivos del lote y noticias/pronóstico del sector agrícola vía OpenRouter, con fallback referencial si la API no está disponible. |
| **IoT simulado** | Muestra temperatura, humedad y riego en tiempo real con tendencias históricas. |
| **Trazabilidad** | Cada informe se registra con un hash en blockchain, verificable por cualquier persona en cualquier momento. |

---

## 🏗️ Arquitectura del sistema

```mermaid
flowchart TD
    A[Usuario] -->|Interactúa vía| B[Frontend Next.js]
    B -->|Lee/Escribe| C[Smart Contract CryptoHuertaToken]
    C -->|Desplegado en| D[Arbitrum Sepolia]
    B -->|Consulta| E[/api/resumen]
    B -->|Consulta| E2[/api/noticias]
    E -->|Llama a| F[OpenRouter]
    E2 -->|Llama a| F
    B -->|Tipo de cambio ETH/USD| M[CoinGecko / Binance]
    B -->|Simula| I[IoT: sensores de campo]
    B -->|Muestra| G[Dashboard del inversor]
    B -->|Muestra| H[Panel de administración]
    H -->|Sube informe| K[Calcula hash SHA-256]
    K -->|Registra en| C
    G -->|Verifica hash| J[Arbiscan]
```

---

## 🚀 Demo en vivo

🔗 **https://cryptohuerta.vercel.app**

### Cómo probarla
1. Abre la demo y entra con **MetaMask** en la red **Arbitrum Sepolia** (Chain ID `421614`).
2. Si no tienes ETH de prueba, obténlo en un faucet (Chainlink, Alchemy o `npx thirdweb faucet`).
3. Entra a **CryptoHuerta** para ver el dashboard del inversor: compra/vende CHT con pricing en USDC, revisa los gráficos con data real de Fundo Azul, el IoT y el resumen con IA.
4. El **panel de administración** (`/admin`) solo es accesible para la wallet owner: sube un informe y actualiza el precio.
5. Verifica los hashes en [Arbiscan](https://sepolia.arbiscan.io/address/0xf01d8ecb37649fd75a2ff062192a23c9c9b9cba5).

---

## 📊 Modelo de negocio

- **Activo real:** lote de arándanos de exportación en Piura (Fundo Azul, 1000 m², 500 plantas premium, riego tecnificado).
- **Tokenización:** piloto demo con 2,500 CHT emitidos (5 lotes × 500 plantas).
- **Rentabilidad de referencia (Fundo Azul):** Año 1 ~20% · Año 2 proyectado ~34%.
- **Resultados reales campaña 2025-26:** 662,579 kg cosechados · 506,654 kg exportados · precio promedio 7.61 US$/kg · ventas totales US$ 4.29 M · margen operativo 27% (proyección 2026-27: 41%).
- **Ganan todos:** el inversor obtiene liquidez y transparencia; el operador, capital de escalamiento sin deuda bancaria; la comunidad, formalización y desarrollo regional.

---

## 🛠️ Tecnologías utilizadas

- **Blockchain:** Solidity 0.8.30 · OpenZeppelin (ERC20 + Ownable) · Arbitrum Sepolia
- **Desarrollo contratos:** Hardhat 3 · hardhat-deploy · Alchemy
- **Frontend:** Next.js 16 · Scaffold-ETH 2 · wagmi / viem · RainbowKit · Tailwind CSS + daisyUI
- **IA:** OpenRouter (resúmenes del lote y noticias del sector)
- **Deploy:** Vercel (frontend) · Arbiscan (verificación pública)

---

## 📦 Instalación y ejecución local

### Requisitos
- Node.js ≥ 20
- Yarn 4 (corepack activado)

### Pasos

```bash
git clone https://github.com/Linder-debug/crypto-huerta.git
cd crypto-huerta
yarn install
```

### Variables de entorno

`packages/hardhat/.env` (solo para desplegar contratos):

```env
__RUNTIME_DEPLOYER_PRIVATE_KEY=0x_tu_clave_privada
ALCHEMY_API_KEY=tu_alchemy_key
```

`packages/nextjs/.env.local` (frontend local):

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=tu_alchemy_key
OPENROUTER_API_KEY=tu_openrouter_key
```

> ⚠️ Nunca subas claves reales al repositorio. En Vercel se configuran en Settings → Environment Variables.

### Ejecutar

```bash
# Frontend en local
yarn start

# Deploy del contrato en Arbitrum Sepolia
yarn deploy --network arbitrumSepolia

# Build de producción
cd packages/nextjs && yarn build
```

---

## 📜 Smart Contract

**CryptoHuertaToken (CHT)** — ERC20 + Ownable

📍 **Arbitrum Sepolia:** [`0xf01d8ecb37649fd75a2ff062192a23c9c9b9cba5`](https://sepolia.arbiscan.io/address/0xf01d8ecb37649fd75a2ff062192a23c9c9b9cba5)

| Función | Acceso | Descripción |
|---|---|---|
| `buyTokens()` | Público (payable) | Compra CHT enviando ETH; el frontend muestra el equivalente en USDC |
| `venderTokens(uint256)` | Público | Vende CHT y recibe ETH al precio vigente |
| `actualizarPrecio(uint256)` | Owner | Ajusta el precio del token para reflejar el mercado real |
| `registrarInforme(bytes32)` | Owner | Registra el hash SHA-256 de un informe de trazabilidad |
| `obtenerPrecio()` / `calcularTokens()` | Público | Lectura de precio y conversión ETH → tokens |
| `obtenerHistorial()` / `cantidadInformes()` | Público | Historial completo de hashes de informes |

**Eventos:** `TokensComprados`, `TokensVendidos`, `InformeRegistrado`, `PrecioActualizado`.

> ℹ️ La dirección es idéntica en Ethereum Sepolia y Arbitrum Sepolia: al ser el primer deploy (nonce 0) de la wallet owner en cada red, la dirección derivada (deployer + nonce) coincide.

---

## 👥 Equipo

| Nombre | Rol | |
|---|---|---|
| Linder López | Blockchain Developer & Project Lead | [LinkedIn](https://www.linkedin.com/in/linder-lopez-rivera) |
| Emmanuel Lopez | Frontend Developer | [LinkedIn](https://www.linkedin.com/in/emmanuel-haziel-lopez-yupanqui) |
| Enmanuel Girón | QA & Soporte Técnico | [LinkedIn](https://www.linkedin.com/in/enmanuel-gir%C3%B3n-l%C3%B3pez-b9297b3b4/) |

📧 cryptohuerta1@gmail.com · 🐦 @cryptohuerta1 · 📸 @cryptohuerta

---

## 📄 Licencia

MIT © 2026 CryptoHuerta
