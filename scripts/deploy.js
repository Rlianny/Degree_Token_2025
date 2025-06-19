const hre = require("hardhat");

async function main() {
  const [university] = await hre.ethers.getSigners();
  const contract = await hre.ethers.deployContract("UniversityDegree");
  await contract.waitForDeployment();

  console.log(`Contrato desplegado en: ${contract.target}`);
  console.log(`Universidad (owner): ${university.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});