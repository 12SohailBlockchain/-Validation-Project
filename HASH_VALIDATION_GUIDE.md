# Hash Validation System Guide

## Overview
Your SABZA validation system uses cryptographic hash verification to ensure document integrity and prevent tampering. This guide explains who can validate projects and how hash verification works.

## Who Can Validate Projects?

### 1. **SABZA Validators** (Primary Validators)
- **Role:** `SABZA_VALIDATOR_ROLE`
- **Responsibilities:**
  - Download IPFS documents submitted by project owners
  - Calculate SHA-256 hash of the actual document
  - Compare with the expected hash provided by project owner
  - Submit validation results with cryptographic signature
- **Authority:** Can mark projects as validated or rejected based on hash comparison

### 2. **Project Owners**
- **Role:** `PROJECT_OWNER_ROLE`
- **Responsibilities:**
  - Submit projects with expected SHA-256 hash
  - Upload documents to IPFS
  - Provide project metadata and token symbols

### 3. **Bitbond Issuers**
- **Role:** `BITBOND_ISSUER_ROLE`
- **Responsibilities:**
  - Mark SABZA-validated projects as tokenized
  - Final step in the validation pipeline

### 4. **System Administrator**
- **Role:** `DEFAULT_ADMIN_ROLE`
- **Responsibilities:**
  - Grant and revoke roles
  - Manage system permissions

## Hash Validation Process

### Step 1: Project Submission
```
Project Owner → Submits project with expectedSHA256Hash
```

### Step 2: SABZA Validation
```
SABZA Validator → Downloads IPFS document
               → Calculates actualSHA256Hash
               → Compares hashes
               → Submits validation result
```

### Step 3: Hash Comparison
```solidity
bool isValid = keccak256(abi.encodePacked(project.expectedSHA256Hash)) == 
               keccak256(abi.encodePacked(_actualSHA256Hash));
```

### Step 4: Status Update
- **If hashes match:** Project status = `SABZAValidated`
- **If hashes don't match:** Project status = `Rejected`

## Frontend Hash Mismatch Warnings

The enhanced frontend now displays:

### ✅ **When Hashes Match:**
- Green "Hash Verified" badge
- "Document integrity confirmed" message
- Green highlighting in hash comparison section

### ⚠️ **When Hashes Don't Match:**
- Red "Hash Mismatch" badge with pulsing animation
- Prominent warning box with shake animation
- Red highlighting in hash comparison section
- Clear "HASH MISMATCH DETECTED!" message

### Hash Comparison Display
- **Expected Hash:** Shows project owner's submitted hash (blue border)
- **Actual Hash:** Shows SABZA-calculated hash (green/red border based on match)
- **Side-by-side comparison** for easy verification

## How to Verify Hash Integrity

### For Project Owners:
1. Submit your project with the correct SHA-256 hash of your document
2. Ensure your IPFS document hasn't been modified after submission

### For SABZA Validators:
1. Download the IPFS document using the provided CID
2. Calculate SHA-256 hash: `sha256sum your_document.pdf`
3. Compare with the expected hash from smart contract
4. Submit validation with your calculated hash

### For Investors/Users:
1. Search for projects by token symbol or project ID
2. Look for hash verification badges
3. Click "Verify Proof on Blockchain" for detailed hash comparison
4. Check that both hashes match for document integrity

## API Endpoints for Hash Verification

```javascript
// Get project with hash data
GET /api/project/token/:symbol
GET /api/project/:id

// Verify blockchain proof with hash comparison
GET /api/verify/:projectId
```

## Technical Implementation

### Smart Contract Function:
```solidity
function sabzaValidateProject(
    string memory _projectId,
    string memory _actualSHA256Hash,
    bytes memory _signature
) external onlySABZAValidator
```

### Frontend Hash Comparison:
```javascript
const hashesMatch = project.expectedSHA256Hash && project.actualSHA256Hash && 
                   project.expectedSHA256Hash.toLowerCase() === project.actualSHA256Hash.toLowerCase();
```

## Security Features

1. **Cryptographic Signatures:** SABZA validators must sign their validation results
2. **Immutable Storage:** All validation data stored on Ethereum blockchain
3. **Role-Based Access:** Only authorized validators can submit validations
4. **Hash Verification:** Document integrity verified through SHA-256 comparison
5. **Visual Warnings:** Frontend prominently displays hash mismatches

## Best Practices

### For Project Owners:
- Calculate hash after final document version
- Use reliable IPFS pinning service
- Double-check hash before submission

### For SABZA Validators:
- Download from multiple IPFS gateways if needed
- Use standard SHA-256 tools for hash calculation
- Report any discrepancies immediately

### For System Users:
- Always check hash verification status
- Be cautious with projects showing hash mismatches
- Verify IPFS documents independently when possible

---

**Note:** This system ensures that any document tampering is immediately detectable through hash comparison. The blockchain provides an immutable audit trail of all validation activities. 