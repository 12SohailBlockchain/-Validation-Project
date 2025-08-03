// Update existing project with enhanced Rajasthan Solar PV metadata
const { ethers } = require("ethers");
const axios = require('axios');
require('dotenv').config();

// Enhanced metadata for Rajasthan Solar PV
const enhancedMetadata = {
  "projectInfo": {
    "projectTitle": "Rajasthan Solar PV - Large Scale Clean Energy Initiative",
    "projectId": "solar_1753173315014",
    "submissionNumber": "S00454",
    "tokenSymbol": "RSOLAR",
    "projectType": "Solar Photovoltaic",
    "forecasted_project_type": "Type A1"
  },
  "location": {
    "country": "India",
    "state": "Rajasthan",
    "region": "Western India",
    "coordinates": {
      "latitude": "26.9124",
      "longitude": "75.7873"
    }
  },
  "carbonCredits": {
    "vintageYear": 2023,
    "totalOffset": "27,850 tCO₂e",
    "annualReduction": "99,100 tCO₂e/Year",
    "methodology": "ACM0002",
    "gccMethodology": "GCCM001 (Version - 3.0)",
    "verifiedBy": "UNFCCC-CDM",
    "additionalVerifier": "GCC",
    "corsiaEligible": true
  },
  "technicalSpecifications": {
    "capacity": "150 MW",
    "technology": "Solar Photovoltaic",
    "installationType": "Ground-mounted",
    "expectedLifespan": "25 years",
    "operationalStatus": "Active",
    "commissioningDate": "2023-01-15"
  },
  "sustainability": {
    "sdgGoals": ["SDG-7", "SDG-8", "SDG-13"],
    "sdgPlusLabel": "Silver",
    "coBenefits": [
      "Air Quality Improvement",
      "Rural Employment Generation",
      "Clean Energy Access",
      "Community Development"
    ],
    "environmentalImpact": {
      "airQualityImprovement": true,
      "biodiversityProtection": true,
      "waterConservation": true
    }
  },
  "compliance": {
    "marketEligibility": "GCC Requirements",
    "regulatoryStatus": "Approved",
    "certifications": [
      "UNFCCC-CDM",
      "GCC Verified",
      "CORSIA Eligible"
    ],
    "elLabel": "N/A",
    "slLabel": "N/A"
  },
  "businessDetails": {
    "projectDeveloper": "Rajasthan Solar Energy Ltd.",
    "operator": "Clean Energy Solutions India",
    "financialModel": "Private Investment with Carbon Credit Revenue",
    "projectRegistrationDate": "2024-04-04",
    "validationDate": "2023-12-20"
  },
  "economicImpact": {
    "totalInvestment": "$180,000,000 USD",
    "jobsCreated": "1,200 direct, 3,000 indirect",
    "localCommunityBenefit": "Education and healthcare programs",
    "energyGeneration": "300 GWh annually"
  },
  "monitoring": {
    "monitoringFrequency": "Continuous",
    "reportingSchedule": "Annual",
    "verificationSchedule": "Bi-annual",
    "lastVerificationDate": "2023-11-15",
    "nextVerificationDate": "2024-11-15"
  },
  "riskAssessment": {
    "technicalRisk": "Low",
    "financialRisk": "Low",
    "regulatoryRisk": "Low",
    "climaticRisk": "Medium",
    "mitigationMeasures": [
      "Insurance coverage",
      "Diversified revenue streams",
      "Regular maintenance protocols"
    ]
  },
  "documentation": {
    "projectDesignDocument": "https://gateway.pinata.cloud/ipfs/QmRajasthanPDD2023",
    "monitoringReport": "https://gateway.pinata.cloud/ipfs/QmRajasthanMR2023",
    "verificationReport": "https://gateway.pinata.cloud/ipfs/QmRajasthanVR2023",
    "certificates": [
      "https://gateway.pinata.cloud/ipfs/QmRajasthanCert2023"
    ]
  },
  "blockchain": {
    "tokenizationDate": "2024-01-20",
    "totalTokensIssued": "27,850",
    "tokenStandard": "ERC-20",
    "smartContractAddress": "0x058976FD969398b868C2D88d9193B16Ad458aC67",
    "ipfsHash": "QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS"
  },
  "additionalAttributes": {
    "projectPhase": "Operation",
    "credibilityScore": "A+",
    "transparencyRating": "High",
    "additionalCertifications": [
      "Gold Standard",
      "Verified Carbon Standard (VCS)",
      "GCC Verified"
    ],
    "stakeholderEngagement": "Community consultations completed",
    "grievanceMechanism": "Active complaint handling system"
  },
  
  // Backward compatibility with old structure
  "name": "Rajasthan Solar PV - Large Scale Clean Energy Initiative",
  "description": "Large-scale solar photovoltaic project in Rajasthan generating clean energy and supporting local communities with GCC verification and comprehensive environmental impact.",
  "tokenSymbol": "RSOLAR"
};

async function uploadEnhancedMetadataToPinata() {
  try {
    console.log("🔄 Uploading enhanced Rajasthan Solar PV metadata to Pinata IPFS...");
    
    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', enhancedMetadata, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
      }
    });

    const ipfsHash = response.data.IpfsHash;
    console.log("✅ Enhanced metadata uploaded to IPFS!");
    console.log("📋 New IPFS Hash:", ipfsHash);
    console.log("🔗 IPFS URL:", `https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    
    return ipfsHash;
  } catch (error) {
    console.error("❌ Error uploading to Pinata:", error.response?.data || error.message);
    return null;
  }
}

async function updateProjectMetadata() {
  try {
    console.log("🔗 Setting up blockchain connection...");
    
    // Setup provider and wallet (compatible with both ethers v5 and v6)
    let provider, wallet;
    
    try {
      // Try ethers v6 syntax first
      provider = new ethers.JsonRpcProvider(process.env.QUICKNODE_RPC_URL || process.env.ALCHEMY_RPC_URL);
      wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    } catch (error) {
      // Fallback to ethers v5 syntax
      provider = new ethers.providers.JsonRpcProvider(process.env.QUICKNODE_RPC_URL || process.env.ALCHEMY_RPC_URL);
      wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    }
    
    // Contract setup
    const contractAddress = "0x058976FD969398b868C2D88d9193B16Ad458aC67";
    const contractABI = [
      "function updateProjectMetadata(string projectId, string newIpfsCID, string newSHA256Hash) external",
      "function getProject(string projectId) external view returns (tuple(string projectId, string ipfsCID, string expectedSHA256Hash, string actualSHA256Hash, string tokenSymbol, address projectOwner, address sabzaValidator, uint8 status, uint256 submissionTime, uint256 sabzaValidationTime, uint256 tokenizationTime, string metadata, bool isReadyForBitbond))"
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
    console.log("👤 Wallet Address:", wallet.address);
    console.log("💰 Checking balance...");
    const balance = await wallet.getBalance();
    // Format balance (compatible with both ethers v5 and v6)
    let formattedBalance;
    try {
      // Try ethers v6 syntax
      formattedBalance = ethers.formatEther(balance);
    } catch (error) {
      // Fallback to ethers v5 syntax
      formattedBalance = ethers.utils.formatEther(balance);
    }
    console.log("💰 Balance:", formattedBalance, "ETH");
    
    // Upload enhanced metadata to IPFS
    const newIpfsHash = await uploadEnhancedMetadataToPinata();
    if (!newIpfsHash) {
      console.log("❌ Failed to upload metadata to IPFS");
      return;
    }
    
    // Calculate new SHA-256 hash for the enhanced metadata
    const crypto = require('crypto');
    const newSHA256Hash = crypto.createHash('sha256')
      .update(JSON.stringify(enhancedMetadata))
      .digest('hex');
    
    console.log("🔐 New SHA-256 Hash:", newSHA256Hash);
    
    // Update the project on blockchain
    console.log("📤 Updating project metadata on blockchain...");
    console.log("📋 Project ID: solar_1753173315014");
    console.log("📋 New IPFS CID:", newIpfsHash);
    console.log("🔐 New Hash:", newSHA256Hash);
    
    const tx = await contract.updateProjectMetadata(
      "solar_1753173315014",
      newIpfsHash,
      newSHA256Hash
    );
    
    console.log("⏳ Waiting for transaction confirmation...");
    console.log("📜 TX Hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Metadata updated successfully!");
    console.log("🧾 Block Number:", receipt.blockNumber);
    console.log("⛽ Gas Used:", receipt.gasUsed.toString());
    
    // Verify the update
    console.log("\n🔍 Verifying updated project...");
    const project = await contract.getProject("solar_1753173315014");
    console.log("✅ Updated Project Details:");
    console.log("- Project ID:", project.projectId);
    console.log("- New IPFS CID:", project.ipfsCID);
    console.log("- New Expected Hash:", project.expectedSHA256Hash);
    console.log("- Token Symbol:", project.tokenSymbol);
    console.log("- Status:", project.status);
    
    console.log("\n🎉 SUCCESS! Enhanced Rajasthan Solar PV metadata updated!");
    console.log("🔗 New IPFS URL:", `https://gateway.pinata.cloud/ipfs/${newIpfsHash}`);
    console.log("🔗 Etherscan TX:", `https://sepolia.etherscan.io/tx/${tx.hash}`);
    
    return {
      txHash: tx.hash,
      ipfsHash: newIpfsHash,
      sha256Hash: newSHA256Hash
    };
    
  } catch (error) {
    console.error("❌ Error updating metadata:", error);
  }
}

if (require.main === module) {
  updateProjectMetadata()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { updateProjectMetadata, enhancedMetadata }; 