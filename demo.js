const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  // 1. Setup inicial
  const [university, employer, graduate] = await ethers.getSigners();
  const Contract = await ethers.getContractFactory("UniversityDegree");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  
  console.log("✅ Contrato desplegado en:", contract.target);
  console.log("🏫 Universidad:", university.address);
  console.log("👨‍💼 Empleador:", employer.address);
  console.log("🎓 Graduado:", graduate.address);
  console.log("-------------------------------------------");

  // 2. Emisión de título
  const degreeData = {
    nombre: "María Rodríguez",
    carrera: "Ingeniería Informática",
    universidad: "Universidad Ejemplo",
    fecha: "2024-05-15",
    id: "ABC123XYZ"
  };
  
  const dataString = JSON.stringify(degreeData);
  const dataHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
  
  const tx = await contract.connect(university).issueDegree(graduate.address, dataHash);
  await tx.wait();
  
  console.log("📜 Título emitido exitosamente!");
  console.log("🔐 Hash de datos:", dataHash);
  console.log("📄 Datos reales (fuera de blockchain):", degreeData);
  console.log("-------------------------------------------");

  // 3. Verificación exitosa
  console.log("🔍 Empleador intenta verificar título válido...");
  const isValid = await contract.connect(employer).verifyDegree(0, dataHash);
  console.log(isValid ? "✅ Verificación EXITOSA: Título válido" : "❌ Verificación FALLIDA");
  console.log("-------------------------------------------");

  // 4. Intento de fraude
  console.log("🕵️‍♂️ Intento de fraude con datos modificados...");
  const fakeData = {...degreeData, carrera: "Medicina"};
  const fakeHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(fakeData)));
  
  const isFakeValid = await contract.connect(employer).verifyDegree(0, fakeHash);
  console.log(isFakeValid ? "⚠️ ¡FALSO POSITIVO!" : "✅ Fraude detectado correctamente");
  console.log("-------------------------------------------");

  // 5. Revocación
  console.log("📛 Universidad revoca el título...");
  await contract.connect(university).revokeDegree(0);
  
  console.log("🔍 Verificación después de revocación...");
  const isRevokedValid = await contract.connect(employer).verifyDegree(0, dataHash);
  console.log(isRevokedValid ? "⚠️ ERROR: Título revocado aún válido" : "✅ Correcto: Título revocado inválido");
}

main().catch(console.error);