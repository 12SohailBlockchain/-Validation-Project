const hre = require("hardhat");

async function main() {
  const ProjectValidation = await hre.ethers.getContractFactory("ProjectValidation");
  const projectValidation = await ProjectValidation.deploy();

  // Wait for deployment to complete
  await projectValidation.waitForDeployment();

  console.log("ProjectValidation deployed to:", await projectValidation.getAddress());
  
  // Verify on Etherscan
  if (hre.network.name === "sepolia") {
    console.log("Waiting for block confirmations...");
    await projectValidation.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: await projectValidation.getAddress(),
        constructorArguments: [],
      });
    } catch (error) {
      console.log("Verification failed:", error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});