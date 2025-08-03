// api/server-fixed.js - Fixed API server
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug environment variables
console.log("🔧 Debug: Environment variables loaded:");
console.log("- CONTRACT_ADDRESS:", process.env.CONTRACT_ADDRESS ? "✅ Found" : "❌ Missing");
console.log("- QUICKNODE_URL:", process.env.QUICKNODE_URL ? "✅ Found" : "❌ Missing");
console.log("- PRIVATE_KEY:", process.env.PRIVATE_KEY ? "✅ Found" : "❌ Missing");

// Contract setup with better RPC handling
let provider;
let rpcUrl;

// Try different RPC URL sources
if (process.env.QUICKNODE_URL) {
  rpcUrl = process.env.QUICKNODE_URL;
  console.log("🌐 Using QuickNode RPC");
} else if (process.env.ALCHEMY_API_URL) {
  rpcUrl = process.env.ALCHEMY_API_URL;
  console.log("🌐 Using Alchemy RPC");
} else if (process.env.ALCHEMY_API_KEY) {
  rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
  console.log("🌐 Using Alchemy RPC (constructed)");
} else {
  console.error("❌ No RPC URL found in environment variables!");
  console.log("💡 Add QUICKNODE_URL to your .env file");
  process.exit(1);
}

console.log("🔗 RPC URL:", rpcUrl.substring(0, 50) + "...");

try {
  provider = new ethers.JsonRpcProvider(rpcUrl);
  console.log("✅ Provider created successfully");
} catch (error) {
  console.error("❌ Failed to create provider:", error.message);
  process.exit(1);
}

const contractABI = [
  // Original ABI without vintage year
  "function getProjectByToken(string memory _tokenSymbol) external view returns (tuple(string projectId, string ipfsCID, string expectedSHA256Hash, string actualSHA256Hash, string tokenSymbol, address projectOwner, address sabzaValidator, uint8 status, uint256 submissionTimestamp, uint256 validationTimestamp, uint256 tokenizationTimestamp, string metadata, bool isReadyForBitbond))",
  "function getProject(string memory _projectId) external view returns (tuple(string projectId, string ipfsCID, string expectedSHA256Hash, string actualSHA256Hash, string tokenSymbol, address projectOwner, address sabzaValidator, uint8 status, uint256 submissionTimestamp, uint256 validationTimestamp, uint256 tokenizationTimestamp, string metadata, bool isReadyForBitbond))",
  "function getAllValidatedProjects() external view returns (tuple(string projectId, string ipfsCID, string expectedSHA256Hash, string actualSHA256Hash, string tokenSymbol, address projectOwner, address sabzaValidator, uint8 status, uint256 submissionTimestamp, uint256 validationTimestamp, uint256 tokenizationTimestamp, string metadata, bool isReadyForBitbond)[])",
  "function getProjectsByStatus(uint8 _status) external view returns (tuple(string projectId, string ipfsCID, string expectedSHA256Hash, string actualSHA256Hash, string tokenSymbol, address projectOwner, address sabzaValidator, uint8 status, uint256 submissionTimestamp, uint256 validationTimestamp, uint256 tokenizationTimestamp, string metadata, bool isReadyForBitbond)[])",
  "function verifyProjectProof(string memory _projectId) external view returns (bool isValid, string memory ipfsCID, string memory expectedHash, string memory actualHash, address sabzaValidator, uint8 status)"
];

let contract;
try {
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, provider);
  console.log("✅ Contract connected successfully");
} catch (error) {
  console.error("❌ Failed to connect to contract:", error.message);
}

// Status enum mapping
const ValidationStatus = {
  0: "Pending",
  1: "SABZAValidated", 
  2: "ReadyForTokenization",
  3: "Tokenized",
  4: "Rejected"
};

function formatProject(project) {
  // Convert BigInt values to strings safely
  const submissionTimestamp = project.submissionTimestamp.toString();
  const validationTimestamp = project.validationTimestamp.toString();
  const tokenizationTimestamp = project.tokenizationTimestamp.toString();
  
  return {
    projectId: project.projectId,
    ipfsCID: project.ipfsCID,
    expectedSHA256Hash: project.expectedSHA256Hash,
    actualSHA256Hash: project.actualSHA256Hash,
    tokenSymbol: project.tokenSymbol,
    projectOwner: project.projectOwner,
    sabzaValidator: project.sabzaValidator,
    status: ValidationStatus[Number(project.status)] || "Unknown",
    statusCode: Number(project.status),
    submissionTimestamp: submissionTimestamp,
    validationTimestamp: validationTimestamp,
    tokenizationTimestamp: tokenizationTimestamp,

    metadata: (() => {
      try {
        return JSON.parse(project.metadata || '{}');
      } catch {
        return {};
      }
    })(),
    isReadyForBitbond: Boolean(project.isReadyForBitbond),
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${project.ipfsCID}`,
    submissionDate: new Date(parseInt(submissionTimestamp) * 1000).toISOString(),
    validationDate: validationTimestamp !== "0" ? new Date(parseInt(validationTimestamp) * 1000).toISOString() : null,
    tokenizationDate: tokenizationTimestamp !== "0" ? new Date(parseInt(tokenizationTimestamp) * 1000).toISOString() : null
  };
}

// Health check endpoint (test first)
app.get('/api/health', async (req, res) => {
  try {
    // Test blockchain connection
    const blockNumber = await provider.getBlockNumber();
    res.json({
      success: true,
      message: "SABZA Validation API is running",
      timestamp: new Date().toISOString(),
      contract: process.env.CONTRACT_ADDRESS,
      provider: rpcUrl.substring(0, 50) + "...",
      blockNumber: blockNumber,
      network: "sepolia"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "API running but blockchain connection failed",
      error: error.message
    });
  }
});

// Statistics endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const pendingProjects = await contract.getProjectsByStatus(0);
    const validatedProjects = await contract.getProjectsByStatus(1);
    const tokenizedProjects = await contract.getProjectsByStatus(3);
    const rejectedProjects = await contract.getProjectsByStatus(4);
    
    res.json({
      success: true,
      data: {
        total: pendingProjects.length + validatedProjects.length + tokenizedProjects.length + rejectedProjects.length,
        pending: pendingProjects.length,
        validated: validatedProjects.length,
        tokenized: tokenizedProjects.length,
        rejected: rejectedProjects.length
      }
    });
  } catch (error) {
    console.error(`❌ Error fetching statistics:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics: " + error.message
    });
  }
});

// Get project by token symbol
app.get('/api/project/token/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`🔍 Searching for token: ${symbol}`);
    
    const project = await contract.getProjectByToken(symbol.toUpperCase());
    
    res.json({
      success: true,
      data: formatProject(project)
    });
  } catch (error) {
    console.error(`❌ Error searching token ${req.params.symbol}:`, error.message);
    res.status(404).json({
      success: false,
      message: "Project not found for token: " + req.params.symbol
    });
  }
});

// Get project by ID
app.get('/api/project/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Searching for project: ${id}`);
    
    const project = await contract.getProject(id);
    
    res.json({
      success: true,
      data: formatProject(project)
    });
  } catch (error) {
    console.error(`❌ Error searching project ${req.params.id}:`, error.message);
    res.status(404).json({
      success: false,
      message: "Project not found: " + req.params.id
    });
  }
});

// Get all validated projects
app.get('/api/projects/validated', async (req, res) => {
  try {
    const projects = await contract.getAllValidatedProjects();
    const formattedProjects = projects.map(formatProject);
    
    res.json({
      success: true,
      data: formattedProjects
    });
  } catch (error) {
    console.error(`❌ Error fetching validated projects:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching validated projects: " + error.message
    });
  }
});

// Get projects by status
app.get('/api/projects/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const statusCode = parseInt(status);
    
    if (isNaN(statusCode) || statusCode < 0 || statusCode > 4) {
      return res.status(400).json({
        success: false,
        message: "Invalid status code. Use 0-4 (Pending, SABZAValidated, ReadyForTokenization, Tokenized, Rejected)"
      });
    }
    
    const projects = await contract.getProjectsByStatus(statusCode);
    const formattedProjects = projects.map(formatProject);
    
    res.json({
      success: true,
      data: formattedProjects,
      status: ValidationStatus[statusCode]
    });
  } catch (error) {
    console.error(`❌ Error fetching projects by status:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching projects by status: " + error.message
    });
  }
});

// Verify project proof
app.get('/api/verify/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log(`🔐 Verifying proof for: ${projectId}`);
    
    const proofResult = await contract.verifyProjectProof(projectId);
    
    res.json({
      success: true,
      data: {
        isValid: Boolean(proofResult.isValid),
        ipfsCID: proofResult.ipfsCID,
        expectedHash: proofResult.expectedHash,
        actualHash: proofResult.actualHash,
        sabzaValidator: proofResult.sabzaValidator,
        status: ValidationStatus[Number(proofResult.status)] || "Unknown",
        statusCode: Number(proofResult.status),
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${proofResult.ipfsCID}`
      }
    });
  } catch (error) {
    console.error(`❌ Error verifying proof ${req.params.projectId}:`, error.message);
    res.status(404).json({
      success: false,
      message: "Proof verification failed: " + error.message
    });
  }
});

// Manual verification endpoint
app.post('/api/verify/manual', async (req, res) => {
  try {
    const { projectId, ipfsCID, sha256Hash } = req.body;
    
    if (!projectId || !ipfsCID || !sha256Hash) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: projectId, ipfsCID, sha256Hash"
      });
    }
    
    console.log(`🔍 Manual verification for: ${projectId}`);
    
    // Get project from blockchain
    const project = await contract.getProject(projectId);
    
    // Perform verification checks
    const verification = {
      projectExists: Boolean(project.projectId),
      projectIdMatch: project.projectId === projectId,
      ipfsCIDMatch: project.ipfsCID === ipfsCID,
      expectedHashMatch: project.expectedSHA256Hash && 
                        project.expectedSHA256Hash.toLowerCase() === sha256Hash.toLowerCase(),
      actualHashMatch: project.actualSHA256Hash && 
                      project.actualSHA256Hash.toLowerCase() === sha256Hash.toLowerCase(),
      isValidated: project.status === 1 || project.status === 3 // SABZAValidated or Tokenized
    };
    
    const allMatch = verification.projectIdMatch && verification.ipfsCIDMatch && 
                    (verification.expectedHashMatch || verification.actualHashMatch);
    
    res.json({
      success: true,
      data: {
        verification,
        allMatch,
        project: formatProject(project),
        providedData: {
          projectId,
          ipfsCID,
          sha256Hash
        }
      }
    });
    
  } catch (error) {
    console.error(`❌ Error in manual verification:`, error.message);
    res.status(404).json({
      success: false,
      message: "Manual verification failed: " + error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

// For local development only
if (process.env.NODE_ENV !== 'production') {
  // Test provider connection before starting server
  provider.getBlockNumber()
    .then(blockNumber => {
      console.log("✅ Blockchain connection successful! Block:", blockNumber);
      
      app.listen(PORT, () => {
        console.log(`🚀 SABZA Validation API server running on port ${PORT}`);
        console.log(`📋 Contract Address: ${process.env.CONTRACT_ADDRESS}`);
        console.log(`🔗 Provider: ${rpcUrl.substring(0, 50)}...`);
        console.log(`🌐 Endpoints available:`);
        console.log(`   GET /api/health - Health check & blockchain status`);
        console.log(`   GET /api/project/token/:symbol - Get project by token symbol`);
        console.log(`   GET /api/project/:id - Get project by ID`);
        console.log(`   GET /api/verify/:projectId - Verify project proof`);
        console.log(`   GET /api/projects/validated - Get all validated projects`);
        console.log(`   GET /api/projects/status/:status - Get projects by status`);
        console.log(`   GET /api/stats - Get platform statistics`);
        console.log(`\n🎯 Test the connection: curl http://localhost:${PORT}/api/health`);
      });
    })
    .catch(error => {
      console.error("❌ Blockchain connection failed:", error.message);
      console.log("💡 Please check your RPC URL and network connection");
      process.exit(1);
    });
}

// Export for Vercel (serverless functions)
module.exports = app;