// Simple metadata output for manual IPFS upload
const fs = require('fs');
const crypto = require('crypto');

// Enhanced project metadata
const enhancedProjectData = {
  "projectInfo": {
    "projectTitle": "Rajasthan Solar PV - Large Scale Clean Energy Initiative",
            "projectId": "solar_1754261007090",
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
                "ipfsHash": "QmdasbFfSFeGyNduhD5Qu8RuqCyBKnLDWgkc3EYQxvtiFx"
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
  
  // Backward compatibility
  "name": "Rajasthan Solar PV - Large Scale Clean Energy Initiative",
  "description": "Large-scale solar photovoltaic project in Rajasthan generating clean energy and supporting local communities with GCC verification and comprehensive environmental impact.",
  "tokenSymbol": "RSOLAR",
  "totalSupply": "27850",
  "founders": [
    "Rajasthan Solar Energy Ltd.",
    "Clean Energy Solutions India"
  ],
  "whitepaper": "https://gateway.pinata.cloud/ipfs/QmRajasthanPDD2023",
  "website": "https://rajasthansolar.in",
  "roadmap": {
    "Q1 2023": "Project commissioning and setup",
    "Q2 2023": "Operational capacity achievement", 
    "Q3 2023": "Carbon credit generation begins",
    "Q4 2023": "GCC verification and certification"
  },
  "financials": {
    "fundingGoal": "180000000 USD",
    "useOfFunds": {
      "Infrastructure": "60%",
      "Technology": "25%",
      "Operations": "10%",
      "Community Programs": "5%"
    }
  },
  "compliance": {
    "jurisdiction": "India",
    "licenses": [
      "Solar Energy License",
      "Environmental Compliance",
      "GCC Verification"
    ],
    "auditor": "UNFCCC-CDM, GCC"
  }
};

function generateMetadataFiles() {
  try {
    console.log("🚀 Generating Enhanced Rajasthan Solar PV Metadata Files");
    console.log("=" .repeat(60));
    
    // Create the JSON file
    const jsonContent = JSON.stringify(enhancedProjectData, null, 2);
    const filename = 'rajasthan-solar-enhanced-metadata.json';
    
    fs.writeFileSync(filename, jsonContent, 'utf8');
    console.log(`✅ Created: ${filename}`);
    
    // Calculate SHA-256 hash
    const hash = crypto.createHash('sha256').update(jsonContent).digest('hex');
    console.log(`🔐 SHA-256 Hash: ${hash}`);
    
    // Create a simple HTML preview with safety checks
    const projectInfo = enhancedProjectData.projectInfo || {};
    const location = enhancedProjectData.location || {};
    const carbonCredits = enhancedProjectData.carbonCredits || {};
    const technicalSpecs = enhancedProjectData.technicalSpecifications || {};
    const compliance = enhancedProjectData.compliance || {};
    const economicImpact = enhancedProjectData.economicImpact || {};
    const coordinates = location.coordinates || {};
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Rajasthan Solar PV - Enhanced Metadata</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { color: #2e7d32; border-bottom: 2px solid #4caf50; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #4caf50; }
        .highlight { color: #1976d2; font-weight: bold; }
        .coordinates { color: #d32f2f; font-weight: bold; }
        .badge { display: inline-block; background: #4caf50; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin: 2px; }
        pre { background: #263238; color: #4caf50; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌞 ${projectInfo.projectTitle || 'Rajasthan Solar PV'}</h1>
            <p><strong>Project ID:</strong> ${projectInfo.projectId || 'N/A'}</p>
            <p><strong>Token Symbol:</strong> <span class="highlight">${projectInfo.tokenSymbol || 'RSOLAR'}</span></p>
        </div>
        
        <div class="section">
            <h2>📍 Location & Geographic Details</h2>
            <p><strong>Country:</strong> ${location.country || 'India'}</p>
            <p><strong>State:</strong> ${location.state || 'Rajasthan'}</p>
            <p><strong>Coordinates:</strong> <span class="coordinates">${coordinates.latitude || '26.9124'}, ${coordinates.longitude || '75.7873'}</span></p>
        </div>
        
        <div class="section">
            <h2>🌱 Carbon Credits & Environmental Impact</h2>
            <p><strong>CO₂ Reduction:</strong> <span class="highlight">${carbonCredits.totalOffset || '27,850 tCO₂e'}</span></p>
            <p><strong>Vintage Year:</strong> ${carbonCredits.vintageYear || 2023}</p>
            <p><strong>Methodology:</strong> ${carbonCredits.methodology || 'ACM0002'}</p>
            <p><strong>GCC Methodology:</strong> <span class="highlight">${carbonCredits.gccMethodology || 'GCCM001 (Version - 3.0)'}</span></p>
            <p><strong>Verified By:</strong> ${carbonCredits.verifiedBy || 'UNFCCC-CDM'}, ${carbonCredits.additionalVerifier || 'GCC'}</p>
        </div>
        
        <div class="section">
            <h2>⚡ Technical Specifications</h2>
            <p><strong>Capacity:</strong> <span class="highlight">${technicalSpecs.capacity || '150 MW'}</span></p>
            <p><strong>Technology:</strong> ${technicalSpecs.technology || 'Solar Photovoltaic'}</p>
            <p><strong>Status:</strong> ${technicalSpecs.operationalStatus || 'Active'}</p>
            <p><strong>Energy Generation:</strong> ${economicImpact.energyGeneration || '300 GWh annually'}</p>
        </div>
        
        <div class="section">
            <h2>🏆 Certifications & Compliance</h2>
            ${compliance.certifications && Array.isArray(compliance.certifications) ? compliance.certifications.map(cert => `<span class="badge">${cert}</span>`).join('') : '<span class="badge">UNFCCC-CDM</span><span class="badge">GCC Verified</span><span class="badge">CORSIA Eligible</span>'}
        </div>
        
        <div class="section">
            <h2>💰 Economic Impact</h2>
            <p><strong>Total Investment:</strong> <span class="highlight">${economicImpact.totalInvestment || '$180,000,000 USD'}</span></p>
            <p><strong>Jobs Created:</strong> ${economicImpact.jobsCreated || '1,200 direct, 3,000 indirect'}</p>
            <p><strong>Community Benefit:</strong> ${economicImpact.localCommunityBenefit || 'Education and healthcare programs'}</p>
        </div>
        
        <div class="section">
            <h2>📊 Raw JSON Data</h2>
            <pre>${JSON.stringify(enhancedProjectData, null, 2)}</pre>
        </div>
    </div>
</body>
</html>`;
    
    const htmlFilename = 'rajasthan-solar-preview.html';
    fs.writeFileSync(htmlFilename, htmlContent, 'utf8');
    console.log(`✅ Created: ${htmlFilename}`);
    
    console.log("\n🎉 SUCCESS! Files generated successfully!");
    console.log("=" .repeat(60));
    
    console.log("\n📊 Enhanced Project Summary:");
    console.log("- Project Title:", projectInfo.projectTitle || 'Rajasthan Solar PV');
    console.log("- Project ID:", projectInfo.projectId || 'solar_1754258679993');
    console.log("- Token Symbol:", projectInfo.tokenSymbol || 'RSOLAR');
    console.log("- Location:", `${location.state || 'Rajasthan'}, ${location.country || 'India'}`);
    console.log("- Coordinates:", `${coordinates.latitude || '26.9124'}, ${coordinates.longitude || '75.7873'}`);
    console.log("- Carbon Credits:", carbonCredits.totalOffset || '27,850 tCO₂e');
    console.log("- GCC Methodology:", carbonCredits.gccMethodology || 'GCCM001 (Version - 3.0)');
    console.log("- Capacity:", technicalSpecs.capacity || '150 MW');
    console.log("- Investment:", economicImpact.totalInvestment || '$180,000,000 USD');
    
    console.log("\n📂 Files Created:");
    console.log(`- ${filename} (for IPFS upload)`);
    console.log(`- ${htmlFilename} (preview)`);
    
    console.log("\n🚀 Next Steps:");
    console.log("1. Open: https://app.pinata.cloud");
    console.log("2. Click 'Upload' → 'File'");
    console.log(`3. Select: ${filename}`);
    console.log("4. Copy the IPFS hash");
    console.log("5. New URL: https://gateway.pinata.cloud/ipfs/[NEW_HASH]");
    
    console.log("\n✅ Enhanced Features Ready:");
    console.log("- Geographic coordinates with map integration");
    console.log("- GCC methodology and verification");
    console.log("- Comprehensive sustainability metrics");
    console.log("- Economic impact and job creation data");
    console.log("- Streamlined documentation links");
    console.log("- Enhanced certification badges");
    
    return {
      filename,
      htmlFilename,
      hash,
      data: enhancedProjectData
    };
    
  } catch (error) {
    console.error("❌ Error generating files:", error.message);
    throw error;
  }
}

if (require.main === module) {
  try {
    const result = generateMetadataFiles();
    console.log("\n🎯 Client Demo Ready!");
    console.log("Your dashboard already shows enhanced metadata.");
    console.log(`Upload ${result.filename} to IPFS for matching enhanced data!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

module.exports = { generateMetadataFiles, enhancedProjectData }; 