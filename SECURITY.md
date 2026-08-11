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