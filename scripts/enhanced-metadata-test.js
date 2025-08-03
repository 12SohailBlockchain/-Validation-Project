// Enhanced metadata test for Rajasthan Solar PV project
const { ethers } = require("ethers");
require('dotenv').config();

const enhancedMetadata = {
  "projectInfo": {
    "projectTitle": "Rajasthan Solar PV - Large Scale Clean Energy Initiative",
    "projectId": "solar_1753173315014", // Keep original project ID as per registry
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
  }
};

async function testEnhancedMetadata() {
  console.log("🔧 Testing Enhanced Rajasthan Solar PV Metadata");
  console.log("📋 Project ID:", enhancedMetadata.projectInfo.projectId);
  console.log("🎯 Token Symbol:", enhancedMetadata.projectInfo.tokenSymbol);
  console.log("🌍 Location:", `${enhancedMetadata.location.state}, ${enhancedMetadata.location.country}`);
  console.log("📍 Coordinates:", `${enhancedMetadata.location.coordinates.latitude}, ${enhancedMetadata.location.coordinates.longitude}`);
  console.log("🔋 Capacity:", enhancedMetadata.technicalSpecifications.capacity);
  console.log("🌱 CO₂ Reduction:", enhancedMetadata.carbonCredits.totalOffset);
  console.log("🏆 GCC Methodology:", enhancedMetadata.carbonCredits.gccMethodology);
  console.log("✅ Certifications:", enhancedMetadata.compliance.certifications.join(", "));
  
  return enhancedMetadata;
}

if (require.main === module) {
  testEnhancedMetadata();
}

module.exports = { enhancedMetadata, testEnhancedMetadata }; 