# 🔒 Documento de Seguridad - CryptoHuerta

> Resumen de las medidas de seguridad implementadas en el smart contract **CryptoHuertaToken (CHT)** desplegado en Arbitrum Sepolia.

📍 **Contrato:** [`0xf01d8ecb37649fd75a2ff062192a23c9c9b9cba5`](https://sepolia.arbiscan.io/address/0xf01d8ecb37649fd75a2ff062192a23c9c9b9cba5)

---

## 1. 🛡️ Protecciones de acceso (Access Control)

### Patrón Ownable (OpenZeppelin)
El contrato hereda de `Ownable` de OpenZeppelin, implementando el patrón de propietario único:

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoHuertaToken is ERC20, Ownable {
    constructor(...) Ownable(msg.sender) {
        // El deployer se convierte en owner
    }
}
```

Funciones restringidas al owner mediante el modificador `onlyOwner`:
- `registrarInforme(bytes32)` — solo el operador puede registrar hashes de trazabilidad.
- `actualizarPrecio(uint256)` — solo el operador puede ajustar el precio del token.

Cualquier intento de llamar estas funciones desde una wallet distinta al owner revierte automáticamente (`Ownable: caller is not the owner`), verificado y probado durante el desarrollo.

**Límite importante de este diseño**: el owner es una única wallet (Externally Owned Account), no una multisig. Esto significa que existe un único punto de confianza/fallo — si esa clave privada se compromete, un atacante podría registrar hashes falsos o alterar el precio. Para producción real, el roadmap contempla migrar el rol de owner a una wallet multisig (ej. Safe) o a gobernanza descentralizada.

---

## 2. 🔁 Protección contra reentrancy

Las funciones `buyTokens()` y `venderTokens()` siguen el patrón **checks-effects-interactions**:

1. **Checks**: se validan las condiciones (`msg.value > 0`, balance suficiente, etc.) antes de cualquier cambio de estado.
2. **Effects**: el balance del token se actualiza primero (`_transfer(...)`).
3. **Interactions**: recién después se envía o recibe ETH.

En `venderTokens()`, el envío de ETH usa `payable(msg.sender).transfer(ethDevuelto)`, que limita el gas disponible en la llamada externa a 2300 unidades — esto reduce significativamente la superficie de ataque de reentrancy, aunque no la elimina por completo si en el futuro se cambia a `.call()` sin las validaciones adecuadas. No se usa un modifier `nonReentrant` explícito de OpenZeppelin en esta versión del MVP; queda como mejora recomendada antes de manejar fondos reales.

---

## 3. 💰 Manejo de fondos y balances

- El owner **no tiene ninguna función que le permita mover o quemar los tokens de otros usuarios**. Solo puede transferir desde su propia reserva (`buyTokens()`) o ajustar el precio (`actualizarPrecio()`), nunca tocar balances ajenos directamente.
- No existe una función de "retiro de emergencia" que permita al owner extraer el ETH depositado por los inversores fuera del flujo normal de `venderTokens()`. Esto es intencional: refuerza la narrativa de trazabilidad y confianza del proyecto.

---

## 4. 📢 Transparencia mediante eventos

Cada acción relevante emite un evento verificable públicamente en el explorador:

| Evento | Se emite en |
|---|---|
| `TokensComprados` | `buyTokens()` |
| `TokensVendidos` | `venderTokens()` |
| `InformeRegistrado` | `registrarInforme()` |
| `PrecioActualizado` | `actualizarPrecio()` |

Cualquier persona puede auditar el historial completo de la actividad del contrato desde Arbiscan, sin depender de la base de datos del frontend.

---

## 5. ⚠️ Límites conocidos de este MVP (divulgación honesta)

Siguiendo el mismo principio de transparencia que promueve el proyecto, documentamos explícitamente lo que este contrato **no** hace todavía:

- **Sin auditoría externa**: este es un contrato de hackathon, no auditado por un tercero. No debe usarse con fondos reales sin una auditoría previa.
- **Precio fijado manualmente, no por oráculo on-chain**: `actualizarPrecio()` depende de que el owner lo actualice manualmente. No hay integración con Chainlink ni ningún oráculo de precio descentralizado en esta versión.
- **Pago en ETH nativo, no en stablecoin real**: el frontend cotiza en USDC como referencia visual (vía un tipo de cambio ETH/USD consultado off-chain), pero la transacción on-chain se liquida en ETH nativo de Arbitrum Sepolia. No hay integración real con un token ERC20 de USDC todavía.
- **Sin mecanismo de pausa de emergencia**: el contrato no implementa `Pausable` de OpenZeppelin. Si se detectara una vulnerabilidad activa, no hay forma de detener las funciones de compra/venta sin desplegar un nuevo contrato.
- **Solo testnet**: el contrato vive en Arbitrum Sepolia, sin valor económico real. No representa custodia de fondos reales de ningún inversor.

## 6. 🗺️ Roadmap de seguridad (post-hackathon)

- [ ] Integración de un oráculo de precios real (Chainlink Price Feeds)
- [ ] Migración del rol owner a una wallet multisig
- [ ] Auditoría externa antes de cualquier despliegue en mainnet
- [ ] Integración de un token ERC20 real de USDC en vez de ETH nativo
- [ ] Modifier `nonReentrant` explícito en funciones de compra/venta
- [ ] Mecanismo de pausa de emergencia (`Pausable`)

---

## 7. 📬 Divulgación responsable

Si encuentras una vulnerabilidad en este contrato, repórtala directamente a:

📧 **cryptohuerta1@gmail.com**

No abras un issue público en GitHub con detalles de la vulnerabilidad antes de que el equipo la haya podido revisar.