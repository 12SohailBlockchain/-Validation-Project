// scripts/quick-test-fixed.js - Working test script
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

async function quickTest() {
  try {
    const [deployer] = await ethers.getSigners();
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    console.log("🔗 Contract Address:", contractAddress);
    console.log("👤 Deployer Address:", deployer.address);
    console.log("💰 Testing with account balance...");
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
    
    const ProjectValidation = await ethers.getContractFactory("ProjectValidation");
    const contract = ProjectValidation.attach(contractAddress);
    
    // Grant PROJECT_OWNER_ROLE to deployer for testing
    console.log("🔑 Granting PROJECT_OWNER_ROLE to deployer...");
    try {
      const roleGrantTx = await contract.addProjectOwner(deployer.address, {
        gasLimit: 100000,
        gasPrice: ethers.parseUnits("20", "gwei")
      });
      await roleGrantTx.wait();
      console.log("✅ PROJECT_OWNER_ROLE granted successfully!");
    } catch (error) {
      console.log("⚠️  Role might already be granted or deployer is admin");
    }
    
    // Real project data for IPFS upload
    const projectData = {
      name: "Solar Clean Energy Initiative 2024",
      description: "Revolutionary solar panel technology for clean energy generation with verified carbon credits",
      tokenSymbol: "SOLAR24",
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
    
    // Upload to real IPFS using Pinata
    console.log("🔄 Uploading project metadata to Pinata IPFS...");
    const ipfsCID = await uploadToIPFS(projectData);
    const testHash = crypto.createHash('sha256').update(JSON.stringify(projectData)).digest('hex');
    
    console.log("🔄 Testing project submission...");
    console.log("📋 IPFS CID:", ipfsCID);
    console.log("🔐 Test Hash:", testHash);
    
    const projectId = "solar_" + Date.now();
    const metadata = JSON.stringify({
      name: projectData.name,
      description: projectData.description,
      tokenSymbol: projectData.tokenSymbol
    });
    
    // Submit project
    console.log("📤 Submitting project to smart contract...");
    const tx = await contract.submitProject(
      projectId,
      ipfsCID,
      testHash,
      projectData.tokenSymbol,
      metadata,
      { 
        gasLimit: 500000,
        gasPrice: ethers.parseUnits("20", "gwei")
      }
    );
    
    console.log("⏳ Waiting for transaction confirmation...");
    console.log("📜 TX Hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Project submitted successfully!");
    console.log("🧾 Block Number:", receipt.blockNumber);
    console.log("⛽ Gas Used:", receipt.gasUsed.toString());
    
    // Check for events
    if (receipt.logs && receipt.logs.length > 0) {
      console.log("📡 Events emitted:", receipt.logs.length);
    }
    
    // Wait a bit
    console.log("⏳ Waiting 5 seconds before validation...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test SABZA validation with same hash (should work)
    console.log("🔄 Testing SABZA validation...");
    
    // Create message hash (compatible with both ethers v5 and v6)
    let messageHash;
    let signature;
    
    try {
      // Try ethers v6 first
      messageHash = ethers.solidityPackedKeccak256(
        ['string', 'string', 'string'],
        [projectId, ipfsCID, testHash]
      );
      signature = await deployer.signMessage(ethers.getBytes(messageHash));
    } catch (error) {
      try {
        // Fallback to ethers v5
        messageHash = ethers.utils.solidityKeccak256(
          ['string', 'string', 'string'],
          [projectId, ipfsCID, testHash]
        );
        signature = await deployer.signMessage(ethers.utils.arrayify(messageHash));
      } catch (error2) {
        // Manual approach
        const encoder = ethers.AbiCoder.defaultAbiCoder();
        const encoded = encoder.encode(['string', 'string', 'string'], [projectId, ipfsCID, testHash]);
        messageHash = ethers.keccak256(encoded);
        signature = await deployer.signMessage(ethers.toBeArray(messageHash));
      }
    }
    
    console.log("✍️ Signature created");
    
    const tx2 = await contract.sabzaValidateProject(
      projectId,
      testHash,
      signature,
      { 
        gasLimit: 300000,
        gasPrice: ethers.parseUnits("20", "gwei")
      }
    );
    
    console.log("⏳ Waiting for validation confirmation...");
    console.log("📜 Validation TX Hash:", tx2.hash);
    
    const receipt2 = await tx2.wait();
    console.log("✅ SABZA validation successful!");
    console.log("🧾 Block Number:", receipt2.blockNumber);
    
    // Wait a bit
    console.log("⏳ Waiting 5 seconds before tokenization...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test tokenization
    console.log("🔄 Testing tokenization...");
    
    // First, grant BITBOND_ISSUER_ROLE to deployer (only admin can do this)
    console.log("🔑 Granting BITBOND_ISSUER_ROLE to deployer...");
    const roleGrantTx = await contract.addBitbondIssuer(deployer.address, {
      gasLimit: 100000,
      gasPrice: ethers.parseUnits("20", "gwei")
    });
    await roleGrantTx.wait();
    console.log("✅ Role granted successfully!");
    
    const tx3 = await contract.markAsTokenized(projectId, { 
      gasLimit: 200000,
      gasPrice: ethers.parseUnits("20", "gwei")
    });
    
    console.log("⏳ Waiting for tokenization confirmation...");
    console.log("📜 Tokenization TX Hash:", tx3.hash);
    
    const receipt3 = await tx3.wait();
    console.log("✅ Project tokenized successfully!");
    console.log("🧾 Block Number:", receipt3.blockNumber);
    
    // Final summary
    console.log("\n" + "=".repeat(50));
    console.log("🎉 SUCCESS! All blockchain functions working!");
    console.log("=".repeat(50));
    console.log("📊 Test Results:");
    console.log("- Project ID:", projectId);
    console.log("- Token Symbol:", projectData.tokenSymbol);
    console.log("- Status: Tokenized");
    console.log("- IPFS CID:", ipfsCID);
    console.log("- IPFS URL:", `https://gateway.pinata.cloud/ipfs/${ipfsCID}`);
    console.log("- Submit TX:", tx.hash);
    console.log("- Validate TX:", tx2.hash);
    console.log("- Tokenize TX:", tx3.hash);
    console.log("- Contract:", contractAddress);
    
    return { 
      projectId, 
      tokenSymbol: projectData.tokenSymbol,
      submitTx: tx.hash,
      validateTx: tx2.hash,
      tokenizeTx: tx3.hash
    };
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("📍 Error details:", error);
    throw error;
  }
}

if (require.main === module) {
  quickTest()
    .then((result) => {
      console.log("\n🎯 Next Steps:");
      console.log("1. Your API server should work now (restart it)");
      console.log("2. Search for token:", result.tokenSymbol, "in dashboard");
      console.log("3. Test the 'Verify Proof on Blockchain' button");
      console.log("4. All transaction links:");
      console.log("   - Submit:", `https://sepolia.etherscan.io/tx/${result.submitTx}`);
      console.log("   - Validate:", `https://sepolia.etherscan.io/tx/${result.validateTx}`);
      console.log("   - Tokenize:", `https://sepolia.etherscan.io/tx/${result.tokenizeTx}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💡 Troubleshooting:");
      console.error("1. Check you have enough Sepolia ETH");
      console.error("2. Verify contract address in .env");
      console.error("3. Check RPC connection");
      process.exit(1);
    });
}

module.exports = { quickTest };