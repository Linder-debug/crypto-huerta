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

**CryptoHuerta** es una plataforma de tokenización de activos agrícolas construida sobre Arbitrum que permite a pequeños inversores participar en la producción de arándanos de exportación desde montos accesibles, con trazabilidad verificable en blockchain y liquidez inmediata.

Nacimos de una experiencia real: **una inversión de S/53,800 en un lote de arándanos en Piura, con 11 años de capital atado y sin posibilidad de verificar el estado real de las plantas entre informe e informe.**

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

Tokenizamos **plantas de arándano**, no tierra. Cada token **CHT** representa una fracción de una planta real.

### Funcionalidades principales

| Módulo | Descripción |
|---|---|
| **Inversor** | Compra y vende CHT, consulta su balance, verifica el hash del último informe de trazabilidad, genera resúmenes con IA y monitorea datos IoT del huerto. |
| **Administrador (Owner)** | Sube informes (hash SHA-256 en blockchain), actualiza el precio del token, visualiza el historial completo de informes. |
| **IA** | Genera automáticamente un resumen ejecutivo del estado del lote (producción estimada, riesgos, recomendaciones). |
| **IoT simulado** | Muestra temperatura, humedad y riego en tiempo real con tendencias históricas. |
| **Trazabilidad** | Cada informe se registra con un hash en blockchain, verificable por cualquier persona en cualquier momento. |

---

## 🏗️ Arquitectura del sistema

```mermaid
flowchart TD
    A[Usuario] -->|Interactúa vía| B[Frontend Next.js]
    B -->|Lee/Escribe| C[Smart Contract CryptoHuertaToken]
    C -->|Desplegado en| D[Arbitrum Sepolia]
    B -->|Consulta| E[API de IA /resumen]
    E -->|Llama a| F[OpenRouter / modelo gratuito]
    B -->|Muestra| G[Dashboard del inversor]
    B -->|Muestra| H[Panel de administración]
    B -->|Simula| I[IoT: sensores de campo]
    G -->|Verifica hash| J[Arbiscan / Explorador]
    H -->|Sube informe| K[Calcula hash SHA-256]
    K -->|Registra en| C
