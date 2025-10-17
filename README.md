# University Degree Tokenization on the Blockchain ⛓️🎓

![Banner](./assets/Banner.png)

## Table of Contents

  - [Overview](https://www.google.com/search?q=%23overview)
  - [The Problem](https://www.google.com/search?q=%23the-problem)
  - [Technical Solution](https://www.google.com/search?q=%23technical-solution)
  - [Tech Stack](https://www.google.com/search?q=%23tech-stack)
  - [Key Features](https://www.google.com/search?q=%23key-features)
  - [Testing and Security](https://www.google.com/search?q=%23testing-and-security)
  - [Roadmap](https://www.google.com/search?q=%23roadmap)
  - [References](https://www.google.com/search?q=%23references)
  - [Presentation Slides](https://www.google.com/search?q=%23presentation-slides)
  - [Getting Started & Running Tests](https://www.google.com/search?q=%23getting-started--running-tests)

## Overview

This project introduces a blockchain-based system for tokenizing university degrees as non-transferable NFTs. It uses Hardhat and smart contracts written in Solidity 0.8.20 with OpenZeppelin standards to ensure:

✅ **Authenticity** of academic credentials
✅ **Prevention** of forgery
✅ **Global verification** in seconds
✅ **Elimination** of bureaucratic processes

## The Problem

  - **800+ diploma mills** operate globally (UNESCO, 2024)
  - **30% of degrees are altered** in Latin American hiring processes (IDB, 2024)
  - **Cuba requires 60 business days** and 4 different entities for degree legalization
  - Costs can exceed **10,000 CUP** per document

## Technical Solution

### Technological Pillars

1.  **Non-Transferable NFTs**
      - A unique and immutable digital representation of a degree.
2.  **Cryptographic Hashes (SHA-3/Keccak256)**
      - Secure storage that guarantees data integrity and privacy.
3.  **Smart Contracts**
      - Manages the issuance, verification, and revocation logic without intermediaries.

### Contract Architecture

```solidity
contract UniversityDegree is ERC721, Ownable {
    struct Degree {
        bytes32 dataHash;   // Hash of the degree's data
        bool revoked;       // Revocation status
    }

    mapping(uint256 => Degree) private _degrees; // Degree storage
    uint256 private _nextTokenId;                // ID counter

    event DegreeIssued(uint256 indexed tokenId, address indexed graduate);
    event DegreeRevoked(uint256 indexed tokenId);

  // ... contract continues
}
```

## Tech Stack

| Component           | Technology                     |
|---------------------|--------------------------------|
| Development Env     | Hardhat Network                |
| Smart Contracts     | Solidity 0.8.20                |
| Standards           | OpenZeppelin ERC721, Ownable   |
| Hashing Algorithm   | SHA-3 (Keccak256)              |
| Testing             | 100% coverage + malicious cases |

## Key Features

  - ⚡ **Verification in Seconds**: Down from the traditional 60 days.
  - 🔒 **Non-Transferable & Non-Marketable**: Tokens are soul-bound to the graduate.
  - 🛡️ **Permanent Revocation**: The university can permanently revoke a degree if necessary.
  - 🌐 **Global Standards Alignment**: In line with W3C Verifiable Credentials.
  - 📉 **Reduced Operational Costs**: By up to 40% (based on the Tec de Monterrey case).
  - 🔐 **Data-less Verification**: Verify credentials without exposing personal data (similar to Zero-Knowledge Proofs).

## Testing and Security

  - ✅ **100% test coverage** of all functionalities.
  - ✅ Simulation of malicious scenarios and common attacks.
  - ✅ Reverse engineering tests.
  - ✅ Protection against:
      - Minimal data alteration (avalanche effect).
      - Unauthorized transfers.
      - Illegitimate revocation attempts.

## Benefits

  - ❌ **Eliminates 4 bureaucratic steps**.
  - 💰 **Saves \>10,000 CUP** per degree.
  - 🚀 **Reduces verification time** from 60 days to seconds.
  - 🌎 **Positions Cuba as a pioneer** in digital transformation for education.

## Roadmap

  - 🚀 Pilot program at the **University of Havana**.
  - 🔗 Integration with the **national legalization platform**.
  - 🌍 Full adaptation to **W3C Verifiable Credentials** standards.
  - 🧩 Tokenization of **specific skills** (e.g., "Machine Learning" certificate).
  - 🤝 Interoperability with **28 EU countries** (ESBI project).
  - 📜 Linkage with **Decentralized Identities (DID)**.

## References

1.  IDB (2024). Report on alterations in university degrees in Latin America.
2.  UNESCO (2024). Global study on diploma mills and economic losses.
3.  NIST (2025). SHA-3 Standard: Permutation-Based Hash and Extendable-Output Functions.
4.  W3C Verifiable Credentials Data Model.
5.  Success Story: Instituto Tecnológico de Monterrey (Mexico).
6.  OpenCerts Implementation (Singapore).

## Presentation Slides

The slides used during the project presentation can be accessed here:
[Implementation of a Degree Issuance and Verification System](https://gamma.app/docs/Implementacion-de-un-Sistema-de-Emision-y-Verificacion-de-Titulos-p2dk7lx3unnjqn0)

## Getting Started & Running Tests

First, in one terminal, run the local Hardhat node:

```shell
npx hardhat node
```

Then, in another terminal, run the tests:

```shell
# To test against the local hardhat network
npx hardhat test --network hardhat

# To run the standard test suite
npx hardhat test
```
