# 🌱 CryptoHuerta

**Tokenización de inversión en arándanos con trazabilidad blockchain en Arbitrum.**

CryptoHuerta democratiza la inversión agrícola permitiendo a cualquier persona invertir desde S/50 en la producción de arándanos de exportación. Cada token (CHT) representa una fracción de la cosecha futura, con total transparencia y liquidez gracias a la trazabilidad verificable en blockchain.

---

## 📖 Historia real

> *"En 2023, invertí S/53,800 en un lote de arándanos en Piura. Descubrí que mi dinero quedaba atado por 11 años, con informes trimestrales sin verificar y sin posibilidad de salir antes de tiempo. CryptoHuerta nació para resolver eso."*

---

## 🎯 Problema que resuelve

| Problema tradicional | Solución con CryptoHuerta |
|---|---|
| Inversión mínima de S/53,800 | Inversión desde S/50 |
| Capital atado por 11 años | Tokens con liquidez inmediata |
| Informes sin verificar | Trazabilidad con hash en blockchain |
| Solo para grandes inversores | Accesible para cualquier persona |

---

## 🚀 Tecnologías utilizadas

- **Blockchain:** Arbitrum Sepolia (testnet)
- **Contrato inteligente:** Solidity (ERC20 + trazabilidad)
- **Frontend:** Scaffold-ETH 2 (Next.js + TailwindCSS)
- **Interacción:** Wagmi + Viem
- **Despliegue:** Hardhat + Vercel

---

## 📦 Instalación y ejecución local

```bash
# Clonar el repositorio
git clone https://github.com/Linder-debug/crypto-huerta.git
cd crypto-huerta

# Instalar dependencias
yarn install

# Terminal 1: Iniciar blockchain local
yarn chain

# Terminal 2: Desplegar contrato
yarn deploy

# Terminal 3: Iniciar frontend
yarn start
