// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoHuertaToken is ERC20, Ownable {
    string public ubicacion;
    string public cultivo;
    uint256 public hectareas;
    uint256 public fechaSiembra;

    bytes32 public ultimoHash;
    uint256 public ultimaActualizacion;

    uint256 public precioToken = 0.001 ether;

    event TokensComprados(address indexed comprador, uint256 cantidad, uint256 ethPagado);
    event TokensVendidos(address indexed vendedor, uint256 cantidad, uint256 ethRecibido);
    event InformeRegistrado(bytes32 hash, uint256 timestamp);
    event PrecioActualizado(uint256 nuevoPrecio);

    constructor(
        string memory _nombre,
        string memory _simbolo,
        string memory _ubicacion,
        string memory _cultivo,
        uint256 _hectareas,
        uint256 _fechaSiembra
    ) ERC20(_nombre, _simbolo) Ownable(msg.sender) {
        ubicacion = _ubicacion;
        cultivo = _cultivo;
        hectareas = _hectareas;
        fechaSiembra = _fechaSiembra;
        _mint(msg.sender, 10000 * 10 ** 18);
    }

    //function comprarTokens() public payable {
    function buyTokens() public payable {
        require(msg.value > 0, "Debes enviar ETH");
        uint256 tokens = msg.value / precioToken;
        require(tokens > 0, "Monto insuficiente para comprar al menos 1 token");
        require(balanceOf(owner()) >= tokens, "No hay suficientes tokens en reserva");
        _transfer(owner(), msg.sender, tokens);
        emit TokensComprados(msg.sender, tokens, msg.value);
    }

    function venderTokens(uint256 cantidad) external {
        require(cantidad > 0, "Cantidad debe ser mayor a 0");
        require(balanceOf(msg.sender) >= cantidad, "No tienes suficientes tokens");
        uint256 ethDevuelto = cantidad * precioToken;
        require(address(this).balance >= ethDevuelto, "El contrato no tiene suficiente ETH");
        _transfer(msg.sender, owner(), cantidad);
        payable(msg.sender).transfer(ethDevuelto);
        emit TokensVendidos(msg.sender, cantidad, ethDevuelto);
    }

    function registrarInforme(bytes32 _hash) external onlyOwner {
        ultimoHash = _hash;
        ultimaActualizacion = block.timestamp;
        emit InformeRegistrado(_hash, block.timestamp);
    }

    function actualizarPrecio(uint256 _nuevoPrecio) external onlyOwner {
        require(_nuevoPrecio > 0, "El precio debe ser mayor a 0");
        precioToken = _nuevoPrecio;
        emit PrecioActualizado(_nuevoPrecio);
    }

    function obtenerPrecio() external view returns (uint256) {
        return precioToken;
    }

    function calcularTokens(uint256 ethAmount) external view returns (uint256) {
        return ethAmount / precioToken;
    }

    receive() external payable {
       // comprarTokens();
        buyTokens();
    }
}