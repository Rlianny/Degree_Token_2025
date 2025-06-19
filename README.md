# Tokenización de Títulos Universitarios en Blockchain ⛓️🎓

![Banner](./assets/Banner.png)

## Tabla de Contenidos
- [Visión General](#visión-general)
- [Problemática](#problemática)
- [Solución Técnica](#solución-técnica)
- [Tecnologías Implementadas](#tecnologías-implementadas)
- [Características Clave](#características-clave)
- [Pruebas y Seguridad](#pruebas-y-seguridad)
- [Futuras Implementaciones](#futuras-implementaciones)
- [Referencias](#referencias)
- [Para probar el proyecto](#para-probar-el-proyecto)

## Visión General
Sistema basado en blockchain para tokenización de títulos universitarios mediante NFTs no transferibles. Utiliza Hardhat y contratos inteligentes en Solidity 0.8.20 con estándares OpenZeppelin para garantizar:

✅ Autenticidad de credenciales académicas  
✅ Prevención de falsificaciones  
✅ Verificación internacional en segundos  
✅ Eliminación de trámites burocráticos  

## Problemática
- **800+ universidades fantasma** operan globalmente (UNESCO, 2024)
- **30% de títulos alterados** en procesos de contratación en Latinoamérica (BID, 2024)
- **Cuba requiere 60 días hábiles** y 4 instancias para legalización
- Costos superiores a **10,000 CUP** por documento

## Solución Técnica
### Pilares Tecnológicos
1. **NFTs No Transferibles**  
   - Representación digital única e inmutable de títulos
2. **Hashes Criptográficos (SHA-3/Keccak256)**  
   - Almacenamiento seguro que garantiza integridad y privacidad
3. **Contratos Inteligentes**  
   - Lógica de emisión, verificación y revocación sin intermediarios

### Arquitectura del Contrato
```solidity
contract UniversityDegree is ERC721, Ownable {
    struct Degree {
        bytes32 dataHash;   // Hash de los datos del titulo
        bool revoked;       // Estado de revocacion
    }

    mapping(uint256 => Degree) private _degrees;    // Almacenamiento de titulos
    uint256 private _nextTokenId;                   // Contador de IDs

    event DegreeIssued(uint256 indexed tokenId, address indexed graduate);
    event DegreeRevoked(uint256 indexed tokenId);contract UniversityDegree is ERC721, Ownable {
    struct Degree {
        bytes32 dataHash;   // Hash de los datos del titulo
        bool revoked;       // Estado de revocacion
    }

    mapping(uint256 => Degree) private _degrees;    // Almacenamiento de titulos
    uint256 private _nextTokenId;                   // Contador de IDs

    event DegreeIssued(uint256 indexed tokenId, address indexed graduate);
    event DegreeRevoked(uint256 indexed tokenId);

  // El  contrato cccontinua
```
## Tecnologías Implementadas

| Componente          | Tecnología                     |
|---------------------|--------------------------------|
| Entorno Desarrollo  | Hardhat Network               |
| Lenguaje Contratos  | Solidity 0.8.20               |
| Estándares          | OpenZeppelin ERC721, Ownable  |
| Algoritmo Hash      | SHA-3 (Keccak256)             |
| Pruebas             | Cubrimiento 100% + casos maliciosos |

## Características Clave
- ⚡ **Verificación en segundos** (vs 60 días tradicionales)
- 🔒 **Títulos "pegajosos"** (no transferibles ni comercializables)
- 🛡️ **Revocación permanente** por la universidad
- 🌐 **Alineado con estándares globales** (W3C Verifiable Credentials)
- 📉 **Costo operativo reducido** en un 40% (caso Tec de Monterrey)
- 🔐 **Verificación sin exponer datos** (similar Zero-Knowledge Proofs)

## Pruebas y Seguridad
- ✅ Cobertura al **100%** de funcionalidades
- ✅ Escenarios maliciosos y ataques simulados
- ✅ Pruebas de ingeniería inversa
- ✅ Protección contra:
  - Alteración mínima de datos (efecto avalancha)
  - Transferencia no autorizada
  - Revocación ilegítima

 ## Beneficios
- ❌ Eliminación de 4 pasos burocráticos
- 💰 Ahorro de >10,000 CUP por título
- 🚀 Reducción de 60 días a segundos en verificación
- 🌎 Posicionamiento de Cuba como pionero en transformación digital educativa

## Futuras Implementaciones
- 🚀 Piloto en **Universidad de La Habana**
- 🔗 Integración con **plataforma nacional de legalización**
- 🌍 Adaptación a **estándares W3C Verifiable Credentials**
- 🧩 Tokenización de **habilidades específicas** (e.g., "Machine Learning")
- 🤝 Interoperabilidad con **28 países UE** (proyecto ESBI)
- 📜 Vinculación con **identidades descentralizadas (DID)**

## Referencias
1. BID (2024). Reporte sobre alteraciones en títulos universitarios en América Latina  
2. UNESCO (2024). Estudio global sobre universidades fantasma y pérdidas económicas  
3. NIST (2025). SHA-3 Standard: Permutation-Based Hash and Extendable-Output Functions  
4. W3C Verifiable Credentials Data Model  
5. Caso de éxito: Instituto Tecnológico de Monterrey (México)  
6. Implementación OpenCerts (Singapur)

## Para probar el proyecto
En una primera terminal
```shell
npx hardhat node
```
En otra terminal
```shell
npx hardhat test --network hardhat
npx hardhat test
```
