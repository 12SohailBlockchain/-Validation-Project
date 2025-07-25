# Manual Verification Test Guide

## Overview
Test the new manual verification feature using real project data from your blockchain.

## Test Data from Your Logs

Based on your test runs, here's real data you can use to test the verification:

### Test Project 1 (SOLAR24)
```
Project ID: solar_1753173315014
Token Symbol: SOLAR24
IPFS CID: QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
Expected Hash: 71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd
Status: Tokenized
```

### Test Project 2 (TST)
```
Project ID: test_1752965171958
Token Symbol: TST
Status: Tokenized
```

## How to Test Manual Verification

### Step 1: Start Your System
```bash
cd "Validation Project"
node api/server.js
```

### Step 2: Open Frontend
Open `frontend/index.html` in your browser

### Step 3: Navigate to Manual Verification
Click on the "🔐 Manual Verification" tab

### Step 4: Test Successful Verification
Enter the following data for SOLAR24 project:

**Project ID:**
```
solar_1753173315014
```

**IPFS URL:**
```
QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
```
OR
```
ipfs://QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
```
OR
```
https://gateway.pinata.cloud/ipfs/QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
```

**SHA-256 Hash:**
```
71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd
```

**Expected Result:** ✅ VERIFICATION SUCCESSFUL!

### Step 5: Test Failed Verification
Try with incorrect data:

**Project ID:**
```
solar_1753173315014
```

**IPFS URL:**
```
QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
```

**SHA-256 Hash (WRONG):**
```
wronghash123456789abcdef
```

**Expected Result:** ❌ VERIFICATION FAILED!

### Step 6: Test Non-Existent Project
**Project ID:**
```
nonexistent_project_123
```

**Expected Result:** ❌ Project not found error

## Verification Features to Test

1. **Input Validation:**
   - Try submitting with empty fields
   - Should show error messages

2. **IPFS URL Formats:**
   - Test with CID only: `QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS`
   - Test with ipfs:// prefix: `ipfs://QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS`
   - Test with gateway URL: `https://gateway.pinata.cloud/ipfs/QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS`

3. **Hash Comparison:**
   - Expected vs Actual hash matching
   - Case-insensitive comparison

4. **Visual Feedback:**
   - Green checkmarks for matches
   - Red X marks for mismatches
   - Success/error animations

5. **Navigation:**
   - "View Full Project Details" button
   - "View IPFS Document" link

## API Endpoint
The manual verification uses:
```
POST /api/verify/manual
Content-Type: application/json

{
  "projectId": "solar_1753173315014",
  "ipfsCID": "QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS",
  "sha256Hash": "71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd"
}
```

## Troubleshooting

### Common Issues:
1. **API Server Not Running:** Make sure `node api/server.js` is running
2. **CORS Errors:** API should have CORS enabled for localhost
3. **Project Not Found:** Verify the project ID exists on blockchain
4. **Hash Mismatch:** Check that you're using the correct expected or actual hash

### Success Indicators:
- ✅ All fields match blockchain data
- Green success message
- Detailed verification breakdown
- Working links to full project and IPFS document

This manual verification system allows users to independently verify project data against the blockchain without relying on automated searches. 