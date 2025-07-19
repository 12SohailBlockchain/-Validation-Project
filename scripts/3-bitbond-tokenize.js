const { ethers } = require("hardhat");

async function bitbondMarkTokenized(projectId) {
  const [deployer] = await ethers.getSigners();
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const ProjectValidation = await ethers.getContractFactory("ProjectValidation");
  const contract = ProjectValidation.attach(contractAddress);
  
  console.log("🔄 Bitbond: Marking project as tokenized...");
  console.log("📋 Project ID:", projectId);
  
  // Verify project is ready for tokenization
  const project = await contract.getProject(projectId);
  console.log("📊 Project Status:", project.status);
  console.log("📊 Ready for Bitbond:", project.isReadyForBitbond);
  
  if (project.status !== 1) { // 1 = SABZAValidated
    console.log("❌ Project is not SABZA validated yet");
    return;
  }
  
  if (!project.isReadyForBitbond) {
    console.log("❌ Project is not ready for tokenization");
    return;
  }
  
  // Mark as tokenized
  const tx = await contract.markAsTokenized(projectId);
  const receipt = await tx.wait();
  
  console.log("✅ Project marked as tokenized successfully!");
  console.log("📜 Transaction hash:", receipt.transactionHash);
  
  // Check for event
  const event = receipt.events?.find(e => e.event === 'ProjectTokenized');
  if (event) {
    console.log("\n🎉 ProjectTokenized event emitted:");
    console.log("- Project ID:", event.args.projectId);
    console.log("- Token Symbol:", event.args.tokenSymbol);
    console.log("- Bitbond Issuer:", event.args.bitbondIssuer);
    console.log("✅ Token is now live and available for investors!");
  }
  
  return { projectId, tokenized: true };
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("Usage: npx hardhat run scripts/3-bitbond-tokenize.js --network sepolia PROJECT_ID");
    process.exit(1);
  }
  
  const [projectId] = args;
  bitbondMarkTokenized(projectId)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { bitbondMarkTokenized };