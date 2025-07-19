const { projectOwnerSubmit } = require('./1-project-owner-submit');
const { sabzaValidateProject } = require('./2-sabza-validate');
const { bitbondMarkTokenized } = require('./3-bitbond-tokenize');

async function runCompleteTestFlow() {
  console.log("🚀 Starting Complete SABZA Validation Test Flow");
  console.log("=" * 60);
  
  try {
    // Step 1: Project Owner submits
    console.log("\n📋 PHASE 1: PROJECT OWNER SUBMISSION");
    const submitResult = await projectOwnerSubmit();
    
    // Wait a bit for block confirmation
    console.log("\n⏳ Waiting 10 seconds for block confirmation...");
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Step 2: SABZA validates
    console.log("\n🔍 PHASE 2: SABZA VALIDATION");
    const validateResult = await sabzaValidateProject(
      submitResult.projectId,
      submitResult.ipfsCID
    );
    
    if (!validateResult.validated) {
      throw new Error("SABZA validation failed");
    }
    
    // Wait a bit for block confirmation
    console.log("\n⏳ Waiting 10 seconds for block confirmation...");
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Step 3: Bitbond tokenizes
    console.log("\n🪙 PHASE 3: BITBOND TOKENIZATION");
    const tokenizeResult = await bitbondMarkTokenized(submitResult.projectId);
    
    console.log("\n" + "=" * 60);
    console.log("🎉 COMPLETE TEST FLOW SUCCESS!");
    console.log("=" * 60);
    console.log("✅ Project Owner: Submitted metadata to IPFS");
    console.log("✅ SABZA: Downloaded, hashed, validated, and signed");
    console.log("✅ Bitbond: Marked as tokenized");
    console.log("✅ Investors: Can now verify token authenticity");
    console.log("\n📊 Final Results:");
    console.log("- Project ID:", submitResult.projectId);
    console.log("- Token Symbol:", submitResult.tokenSymbol);
    console.log("- IPFS CID:", submitResult.ipfsCID);
    console.log("- Status: Tokenized and ready for investors");
    
    return {
      projectId: submitResult.projectId,
      tokenSymbol: submitResult.tokenSymbol,
      ipfsCID: submitResult.ipfsCID,
      status: "Tokenized"
    };
    
  } catch (error) {
    console.error("\n❌ Test flow failed:", error.message);
    throw error;
  }
}

if (require.main === module) {
  runCompleteTestFlow()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { runCompleteTestFlow };