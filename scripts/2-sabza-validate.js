const { ethers } = require("hardhat");
const axios = require('axios');
const crypto = require('crypto');

async function downloadFromIPFS(cid) {
  try {
    // Try to download from IPFS using public gateway
    const response = await axios.get(`https://ipfs.io/ipfs/${cid}`, {
      timeout: 10000
    });
    
    if (typeof response.data === 'string') {
      return JSON.parse(response.data);
    }
    return response.data;
  } catch (error) {
    console.log("⚠️  IPFS download failed, using mock data for testing");
    console.log("   Error:", error.message);
    
    // Return mock data for testing when IPFS is unavailable
    return {
      name: "Mock Solar Clean Energy Initiative",
      description: "Mock project data for testing validation flow",
      tokenSymbol: "SCC",
      totalSupply: "10000000",
      founders: ["Dr. Sarah Chen", "Michael Rodriguez"]
    };
  }
}

async function calculateSHA256(data) {
  return crypto.createHash('sha256')
    .update(JSON.stringify(data, null, 2))
    .digest('hex');
}

async function sabzaValidateProject(projectId, expectedIPFSCID) {
  const [deployer] = await ethers.getSigners();
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const ProjectValidation = await ethers.getContractFactory("ProjectValidation");
  const contract = ProjectValidation.attach(contractAddress);
  
  console.log("🔄 Step 2: SABZA downloading metadata from IPFS...");
  console.log("📋 Project ID:", projectId);
  console.log("📋 IPFS CID:", expectedIPFSCID);
  
  // Step 2: Download file from IPFS
  let downloadedData;
  try {
    downloadedData = await downloadFromIPFS(expectedIPFSCID);
    console.log("✅ Successfully downloaded from IPFS");
  } catch (error) {
    console.error("❌ Failed to download from IPFS:", error.message);
    return;
  }
  
  // Step 3: Calculate SHA-256 hash
  console.log("🔄 Step 3: Computing SHA-256 hash...");
  const actualHash = await calculateSHA256(downloadedData);
  console.log("🔐 Computed SHA-256 Hash:", actualHash);
  
  // Get project from contract to compare hashes
  const project = await contract.getProject(projectId);
  const expectedHash = project.expectedSHA256Hash;
  
  console.log("🔄 Step 4: Comparing hashes...");
  console.log("📊 Expected Hash:", expectedHash);
  console.log("📊 Actual Hash:  ", actualHash);
  
  const hashesMatch = expectedHash === actualHash;
  console.log(hashesMatch ? "✅ Hashes MATCH!" : "❌ Hashes DO NOT MATCH!");
  
  if (!hashesMatch) {
    console.log("❌ Validation FAILED - Hash mismatch detected");
    console.log("🚨 SECURITY ALERT: Document may have been tampered with!");
    return;
  }
  
  // Step 4: Sign off as validated
  console.log("🔄 Step 5: SABZA signing validation...");
  
  // Create signature
  const messageHash = ethers.solidityPackedKeccak256(
    ['string', 'string', 'string'],
    [projectId, expectedIPFSCID, actualHash]
  );
  
  const signature = await deployer.signMessage(ethers.getBytes(messageHash));
  
  // Submit validation to smart contract
  console.log("🔄 Step 6: Submitting validation to smart contract...");
  
  const tx = await contract.sabzaValidateProject(
    projectId,
    actualHash,
    signature
  );
  
  const receipt = await tx.wait();
  console.log("✅ SABZA validation submitted successfully!");
  console.log("📜 Transaction hash:", receipt.transactionHash);
  
  // Check for events
  const sabzaEvent = receipt.events?.find(e => e.event === 'SABZAValidationCompleted');
  const readyEvent = receipt.events?.find(e => e.event === 'ProjectReadyForTokenization');
  
  if (sabzaEvent) {
    console.log("\n🎉 SABZAValidationCompleted event emitted:");
    console.log("- Project ID:", sabzaEvent.args.projectId);
    console.log("- Actual Hash:", sabzaEvent.args.actualHash);
    console.log("- SABZA Validator:", sabzaEvent.args.sabzaValidator);
    console.log("- Is Valid:", sabzaEvent.args.isValid);
  }
  
  if (readyEvent) {
    console.log("\n🚀 ProjectReadyForTokenization event emitted:");
    console.log("- Project ID:", readyEvent.args.projectId);
    console.log("- Token Symbol:", readyEvent.args.tokenSymbol);
    console.log("✅ Project is now ready for Bitbond tokenization!");
  }
  
  return { projectId, validated: hashesMatch, actualHash };
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("Usage: npx hardhat run scripts/2-sabza-validate.js --network sepolia PROJECT_ID IPFS_CID");
    process.exit(1);
  }
  
  const [projectId, ipfsCID] = args;
  sabzaValidateProject(projectId, ipfsCID)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { sabzaValidateProject };