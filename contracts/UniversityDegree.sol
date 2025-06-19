// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UniversityDegree is ERC721, Ownable {
    struct Degree {
        bytes32 dataHash;   // Hash de los datos del titulo
        bool revoked;       // Estado de revocacion
    }

    mapping(uint256 => Degree) private _degrees;    // Almacenamiento de titulos
    uint256 private _nextTokenId;                   // Contador de IDs

    event DegreeIssued(uint256 indexed tokenId, address indexed graduate);
    event DegreeRevoked(uint256 indexed tokenId);

    error InvalidDataHash();
    error DegreeAlreadyRevoked();
    error NonTransferableToken();

    constructor() ERC721("UniversityDegree", "UDEG") Ownable(msg.sender) {}  // Constructor asigna a la universidad como dueña

    // Bloquear transferencias después de la creación
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Permitir creación inicial (minting)
        if (from == address(0)) {
            return super._update(to, tokenId, auth);
        }
        
        // Bloquear transferencias
        if (to != address(0)) {
            revert NonTransferableToken();
        }
        
        return super._update(to, tokenId, auth);
    }

    // Bloquear explícitamente las aprobaciones
    function approve(address to, uint256 tokenId) public virtual override {
        revert NonTransferableToken();
    }

    // Bloquear explícitamente las aprobaciones globales
    function setApprovalForAll(address operator, bool approved) public virtual override {
        revert NonTransferableToken();
    }

    function issueDegree(
        address graduate,
        bytes32 dataHash
    ) external onlyOwner returns (uint256) // Modificador onlyOwner en funciones críticas 
    {
        if (dataHash == bytes32(0)) {
            revert InvalidDataHash();
        }

        uint256 tokenId = _nextTokenId++;
        _safeMint(graduate, tokenId);
        _degrees[tokenId] = Degree(dataHash, false);
        emit DegreeIssued(tokenId, graduate);
        return tokenId;
    }

    function revokeDegree(uint256 tokenId) external onlyOwner // Modificador onlyOwner en funciones críticas
    {
        // Usamos la verificación de existencia de OpenZeppelin
        require(_ownerOf(tokenId) != address(0), "ERC721NonexistentToken");
        
        if (_degrees[tokenId].revoked) {
            revert DegreeAlreadyRevoked();
        }
        
        _degrees[tokenId].revoked = true;
        emit DegreeRevoked(tokenId);
    }

    function verifyDegree(
        uint256 tokenId,
        bytes32 dataHash
    ) external view returns (bool) {
        // Usamos la verificación de existencia de OpenZeppelin
        require(_ownerOf(tokenId) != address(0), "ERC721NonexistentToken");
        
        Degree memory degree = _degrees[tokenId];
        return (degree.dataHash == dataHash && !degree.revoked);
    }

    function getDegreeHash(uint256 tokenId) external view returns (bytes32) {
        // Usamos la verificación de existencia de OpenZeppelin
        require(_ownerOf(tokenId) != address(0), "ERC721NonexistentToken");
        return _degrees[tokenId].dataHash;
    }

    function getDegreeInfo(uint256 tokenId) external view returns (bytes32, bool) {
        // Usamos la verificación de existencia de OpenZeppelin
        require(_ownerOf(tokenId) != address(0), "ERC721NonexistentToken");
        Degree memory degree = _degrees[tokenId];
        return (degree.dataHash, degree.revoked);
    }
}