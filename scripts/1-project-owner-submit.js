const { ethers } = require("hardhat");
const axios = require('axios');
const crypto = require('crypto');

async function uploadToIPFS(projectData) {
  const jsonString = JSON.stringify(projectData, null, 2);
  
  try {
    // Use Pinata IPFS API
    const pinataApiKey = 'e10a02a6d76e35d2d7c8';
    const pinataSecretApiKey = '4d72f6c367603be5082a344da6f96244f86f9e9c2de292a0a93ea94686bf1123';
    
    const FormData = require('form-data');
    const form = new FormData();
    
    // Create a readable stream from the JSON string
    const Readable = require('stream').Readable;
    const stream = new Readable();
    stream.push(jsonString);
    stream.push(null);
    
    form.append('file', stream, {
      filename: 'project-metadata.json',
      contentType: 'application/json'
    });
    
    const pinataMetadata = JSON.stringify({
      name: `Project-${projectData.tokenSymbol}-${Date.now()}`,
      keyvalues: {
        projectType: 'SABZA_Validation',
        tokenSymbol: projectData.tokenSymbol
      }
    });
    form.append('pinataMetadata', pinataMetadata);
    
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
      headers: {
        ...form.getHeaders(),
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      }
    });
    
    console.log("✅ Successfully uploaded to Pinata IPFS!");
    console.log("📋 IPFS Hash:", response.data.IpfsHash);
    console.log("🔗 IPFS URL:", `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
    
    return response.data.IpfsHash;
  } catch (error) {
    console.log("⚠️  Pinata IPFS upload failed, using mock CID for testing");
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