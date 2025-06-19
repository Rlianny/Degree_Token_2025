const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("UniversityDegree", function () {
  // Fixture para despliegue inicial
  async function deployContractFixture() {
    const [university, employer, graduate, attacker] = await ethers.getSigners();
    
    const Contract = await ethers.getContractFactory("UniversityDegree");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();
    
    return { contract, university, employer, graduate, attacker };
  }

  // Fixture con título emitido
  async function degreeIssuedFixture() {
    const fixture = await deployContractFixture();
    const { contract, university, graduate } = fixture;
    
    const degreeData = JSON.stringify({
      name: "María Rodríguez",
      degree: "Computer Science",
      date: "2023-06-15",
      id: "CS-2023-001"
    });
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(degreeData));
    
    const tx = await contract.connect(university).issueDegree(graduate.address, dataHash);
    await tx.wait();
    
    return { 
      ...fixture, 
      storedDataHash: dataHash, 
      degreeData, 
      tokenId: 0 
    };
  }

  describe("Despliegue", () => {
    it("Debería asignar el owner correctamente", async () => {
      const { contract, university } = await loadFixture(deployContractFixture);
      expect(await contract.owner()).to.equal(university.address);
    });

    it("Debería tener el nombre y símbolo correctos", async () => {
      const { contract } = await loadFixture(deployContractFixture);
      expect(await contract.name()).to.equal("UniversityDegree");
      expect(await contract.symbol()).to.equal("UDEG");
    });
  });

  describe("Emisión de Títulos", () => {
    it("Debería emitir un título correctamente", async () => {
      const { contract, graduate, storedDataHash } = await loadFixture(degreeIssuedFixture);
      
      // Verificar propiedad del token
      expect(await contract.ownerOf(0)).to.equal(graduate.address);
      
      // Verificar hash almacenado
      expect(await contract.getDegreeHash(0)).to.equal(storedDataHash);
      
      // Verificar estado de revocación
      const [hash, revoked] = await contract.getDegreeInfo(0);
      expect(revoked).to.be.false;
    });

    it("Debería emitir el evento DegreeIssued", async () => {
      const { contract, university, graduate } = await loadFixture(deployContractFixture);
      
      const testData = "Test Degree Data";
      const testDataHash = ethers.keccak256(ethers.toUtf8Bytes(testData));
      
      await expect(contract.connect(university).issueDegree(graduate.address, testDataHash))
        .to.emit(contract, "DegreeIssued")
        .withArgs(0, graduate.address);
    });

    it("Debería incrementar el tokenId correctamente", async () => {
      const { contract, university, graduate } = await loadFixture(degreeIssuedFixture);
      
      const newData = "Second Degree";
      const newDataHash = ethers.keccak256(ethers.toUtf8Bytes(newData));
      await contract.connect(university).issueDegree(graduate.address, newDataHash);
      
      expect(await contract.ownerOf(1)).to.equal(graduate.address);
    });

    it("Debería fallar si un no-owner intenta emitir", async () => {
      const { contract, attacker, graduate } = await loadFixture(deployContractFixture);
      
      const testData = "Attacker Degree";
      const testDataHash = ethers.keccak256(ethers.toUtf8Bytes(testData));
      
      await expect(
        contract.connect(attacker).issueDegree(graduate.address, testDataHash)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("Debería prevenir la emisión con hash cero", async () => {
      const { contract, university, graduate } = await loadFixture(deployContractFixture);
      
      await expect(
        contract.connect(university).issueDegree(graduate.address, ethers.ZeroHash)
      ).to.be.revertedWithCustomError(contract, "InvalidDataHash");
    });
  });

  describe("Verificación de Títulos", () => {
    it("Debería verificar un título válido correctamente", async () => {
      const { contract, employer, storedDataHash } = await loadFixture(degreeIssuedFixture);
      expect(await contract.connect(employer).verifyDegree(0, storedDataHash)).to.be.true;
    });

    it("Debería detectar un hash incorrecto", async () => {
      const { contract, employer } = await loadFixture(degreeIssuedFixture);
      const fakeData = "Fake Data";
      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes(fakeData));
      expect(await contract.connect(employer).verifyDegree(0, fakeHash)).to.be.false;
    });

    it("Debería detectar un título revocado", async () => {
      const { contract, university, employer, storedDataHash } = await loadFixture(degreeIssuedFixture);
      
      // Revocar título
      await contract.connect(university).revokeDegree(0);
      
      // Verificar revocación
      expect(await contract.connect(employer).verifyDegree(0, storedDataHash)).to.be.false;
    });

    it("Debería fallar para un token inexistente", async () => {
      const { contract, employer, storedDataHash } = await loadFixture(degreeIssuedFixture);
      
      await expect(
        contract.connect(employer).verifyDegree(999, storedDataHash)
      ).to.be.revertedWith("ERC721NonexistentToken");
    });

    it("Debería mantener la integridad con múltiples títulos", async () => {
      const { contract, university, employer, graduate, storedDataHash } = await loadFixture(degreeIssuedFixture);
      
      // Emitir segundo título
      const secondData = "Second Degree Data";
      const secondHash = ethers.keccak256(ethers.toUtf8Bytes(secondData));
      await contract.connect(university).issueDegree(graduate.address, secondHash);
      
      // Verificar ambos títulos
      expect(await contract.connect(employer).verifyDegree(0, storedDataHash)).to.be.true;
      expect(await contract.connect(employer).verifyDegree(1, secondHash)).to.be.true;
      
      // Verificar cruce incorrecto
      expect(await contract.connect(employer).verifyDegree(0, secondHash)).to.be.false;
      expect(await contract.connect(employer).verifyDegree(1, storedDataHash)).to.be.false;
    });
  });

  describe("Revocación de Títulos", () => {
    it("Debería revocar un título correctamente", async () => {
      const { contract, university } = await loadFixture(degreeIssuedFixture);
      
      await expect(contract.connect(university).revokeDegree(0))
        .to.emit(contract, "DegreeRevoked")
        .withArgs(0);
      
      // Verificar estado
      const [hash, revoked] = await contract.getDegreeInfo(0);
      expect(revoked).to.be.true;
    });

    it("Debería fallar al revocar un título ya revocado", async () => {
      const { contract, university } = await loadFixture(degreeIssuedFixture);
      
      // Primera revocación
      await contract.connect(university).revokeDegree(0);
      
      // Intentar revocar nuevamente
      await expect(
        contract.connect(university).revokeDegree(0)
      ).to.be.revertedWithCustomError(contract, "DegreeAlreadyRevoked");
    });

    it("Debería fallar si un no-owner intenta revocar", async () => {
      const { contract, attacker } = await loadFixture(degreeIssuedFixture);
      
      await expect(
        contract.connect(attacker).revokeDegree(0)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("Debería fallar al revocar un token inexistente", async () => {
      const { contract, university } = await loadFixture(degreeIssuedFixture);
      
      await expect(
        contract.connect(university).revokeDegree(999)
      ).to.be.revertedWith("ERC721NonexistentToken");
    });
  });

  describe("Privacidad y Seguridad", () => {
    it("No debería exponer datos sensibles en blockchain", async () => {
      const { contract, degreeData } = await loadFixture(degreeIssuedFixture);
      
      // Obtener hash almacenado
      const storedHash = await contract.getDegreeHash(0);
      
      // Verificar que solo el hash está almacenado
      expect(storedHash).to.not.equal(degreeData);
      expect(storedHash).to.equal(ethers.keccak256(ethers.toUtf8Bytes(degreeData)));
    });

    it("Debería prevenir la suplantación con hashes similares", async () => {
      const { contract, employer, degreeData } = await loadFixture(degreeIssuedFixture);
      
      // Crear datos similares pero diferentes
      const similarData = degreeData.replace("Rodríguez", "Rodriguez"); // Cambio sutil
      const similarHash = ethers.keccak256(ethers.toUtf8Bytes(similarData));
      
      expect(await contract.connect(employer).verifyDegree(0, similarHash)).to.be.false;
    });

    it("Debería detectar modificación mínima en los datos", async () => {
      const { contract, employer, degreeData } = await loadFixture(degreeIssuedFixture);
      
      // Cambiar un solo carácter
      const modifiedData = degreeData.replace("2023", "2024");
      const modifiedHash = ethers.keccak256(ethers.toUtf8Bytes(modifiedData));
      
      expect(await contract.connect(employer).verifyDegree(0, modifiedHash)).to.be.false;
    });
  });

  describe("Manejo de Errores", () => {
    it("Debería revertir al transferir tokens (no transferibles)", async () => {
      const { contract, graduate, employer } = await loadFixture(degreeIssuedFixture);
      
      await expect(
        contract.connect(graduate).transferFrom(graduate.address, employer.address, 0)
      ).to.be.revertedWithCustomError(contract, "NonTransferableToken");
    });

    it("Debería revertir al intentar aprobar transferencias", async () => {
      const { contract, graduate, employer } = await loadFixture(degreeIssuedFixture);
      
      await expect(
        contract.connect(graduate).approve(employer.address, 0)
      ).to.be.revertedWithCustomError(contract, "NonTransferableToken");
    });

    it("Debería revertir al verificar título revocado", async () => {
      const { contract, university, employer, storedDataHash } = await loadFixture(degreeIssuedFixture);
      
      // Revocar título
      await contract.connect(university).revokeDegree(0);
      
      // Verificar que la verificación falla
      expect(await contract.connect(employer).verifyDegree(0, storedDataHash)).to.be.false;
    });
  });

  describe("Funciones de Consulta", () => {
    it("Debería devolver la información completa del título", async () => {
      const { contract, storedDataHash } = await loadFixture(degreeIssuedFixture);
      
      const [hash, revoked] = await contract.getDegreeInfo(0);
      expect(hash).to.equal(storedDataHash);
      expect(revoked).to.be.false;
    });

    it("Debería fallar al consultar token inexistente", async () => {
      const { contract } = await loadFixture(degreeIssuedFixture);
      
      await expect(
        contract.getDegreeInfo(999)
      ).to.be.revertedWith("ERC721NonexistentToken");
    });
  });
});