const { ethers } = require("hardhat");
const axios = require('axios');
const crypto = require('crypto');

async function uploadToIPFS(projectData) {
  const jsonString = JSON.stringify(projectData, null, 2);
  
  try {
    // Use a simple HTTP request to upload to IPFS
    const auth = Buffer.from(`${process.env.INFURA_IPFS_ID || 'demo'}:${process.env.INFURA_IPFS_SECRET || 'demo'}`).toString('base64');
    
    const response = await axios({
      method: 'post',
      url: 'https://ipfs.infura.io:5001/api/v0/add',
      data: Buffer.from(jsonString),
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      params: {
        'pin': 'true'
      }
    });
    
    return response.data.Hash;
  } catch (error) {
    console.log("⚠️  Infura IPFS not available, using mock CID for testing");
    console.log("   Error:", error.message);
    // Generate a mock CID for testing when IPFS is not available
    const hash = crypto.createHash('sha256').update(jsonString).digest('hex');
    return `QmMock${hash.substring(0, 40)}`; // Mock CID format
  }
}

async function calculateSHA256(data) {
  return crypto.createHash('sha256')
    .update(JSON.stringify(data, null, 2))
    .digest('hex');
}

async function projectOwnerSubmit() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const ProjectValidation = await ethers.getContractFactory("ProjectValidation");
  const contract = ProjectValidation.attach(contractAddress);
  
  // Sample project data
  const projectData = {
    name: "Solar Clean Energy Initiative",
    description: "Revolutionary solar panel technology for clean energy generation",
    tokenSymbol: "SCC", // Solar Clean Coin
    totalSupply: "10000000",
    founders: ["Dr. Sarah Chen", "Michael Rodriguez"],
    whitepaper: "https://example.com/solar-whitepaper.pdf",
    website: "https://solarcleanenergy.com",
    roadmap: {
      "Q1 2025": "Initial R&D and prototype development",
      "Q2 2025": "Pilot testing in 3 locations",
      "Q3 2025": "Commercial scale production",
      "Q4 2025": "International expansion"
    },
    financials: {
      fundingGoal: "5000000 USD",
      useOfFunds: {
        "R&D": "40%",
        "Manufacturing": "30%",
        "Marketing": "20%",
        "Operations": "10%"
      }
    },
    compliance: {
      jurisdiction: "Germany",
      licenses: ["Solar Energy License", "Environmental Compliance"],
      auditor: "GreenTech Auditors GmbH"
    }
  };
  
  console.log("🔄 Step 1: Project Owner uploading metadata to IPFS...");
  
  // Upload to IPFS and get CID
  const ipfsCID = await uploadToIPFS(projectData);
  console.log("✅ IPFS Upload Complete!");
  console.log("📋 IPFS CID:", ipfsCID);
  
  // Calculate expected SHA-256 hash
  const expectedHash = await calculateSHA256(projectData);
  console.log("🔐 Expected SHA-256 Hash:", expectedHash);
  
  // Submit to smart contract
  const projectId = "solar_clean_" + Date.now();
  const metadata = JSON.stringify({
    name: projectData.name,
    description: projectData.description,
    tokenSymbol: projectData.tokenSymbol
  });
  
  console.log("🔄 Submitting project to smart contract...");
  
  const tx = await contract.submitProject(
    projectId,
    ipfsCID,
    expectedHash,
    projectData.tokenSymbol,
    metadata
  );
  
  const receipt = await tx.wait();
  console.log("✅ Project submitted successfully!");
  console.log("📜 Transaction hash:", receipt.transactionHash);
  
  // Check for event
  const event = receipt.events?.find(e => e.event === 'ProjectSubmitted');
  if (event) {
    console.log("\n🎉 ProjectSubmitted event emitted:");
    console.log("- Project ID:", event.args.projectId);
    console.log("- IPFS CID:", event.args.ipfsCID);
    console.log("- Project Owner:", event.args.projectOwner);
    console.log("- Expected Hash:", event.args.expectedHash);
  }
  
  console.log("\n📋 Summary for SABZA Validation:");
  console.log("- Project ID:", projectId);
  console.log("- IPFS CID:", ipfsCID);
  console.log("- Expected Hash:", expectedHash);
  console.log("- Token Symbol:", projectData.tokenSymbol);
  console.log("\n⏳ Waiting for SABZA validation...");
  
  return { projectId, ipfsCID, expectedHash, tokenSymbol: projectData.tokenSymbol };
}

if (require.main === module) {
  projectOwnerSubmit()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { projectOwnerSubmit };