# Blockchain Explorer Verification Guide

## Overview
Learn how to verify your project hashes directly on Sepolia Etherscan blockchain explorer.

## Your Contract Information
```
Contract Address: 0x058976FD969398b868C2D88d9193B16Ad458aC67
Network: Ethereum Sepolia Testnet
Explorer: https://sepolia.etherscan.io/
```

## Step-by-Step Verification

### Step 1: Access Your Smart Contract
Go to: https://sepolia.etherscan.io/address/0x058976FD969398b868C2D88d9193B16Ad458aC67

### Step 2: View Contract Transactions
Click on the **"Transactions"** tab to see all interactions with your contract.

### Step 3: Find Your Project Transactions
Based on your logs, for SOLAR24 project:

**Project Submission Transaction:**
- TX Hash: `0xfaa4e96b90fa05747df6d231c8ed6fb10d693d325cfa889ba4c91f48cd3ca80f`
- Link: https://sepolia.etherscan.io/tx/0xfaa4e96b90fa05747df6d231c8ed6fb10d693d325cfa889ba4c91f48cd3ca80f

**SABZA Validation Transaction:**
- TX Hash: `0x26b1f916d2448a6ea522723a8adcbb1fdc36aac2d918645ea7a46fc91c02b95b`
- Link: https://sepolia.etherscan.io/tx/0x26b1f916d2448a6ea522723a8adcbb1fdc36aac2d918645ea7a46fc91c02b95b

**Tokenization Transaction:**
- TX Hash: `0x1d75e3743010ba5d5138950177e9a31935efa17fe3244bd982206606cb4af625`
- Link: https://sepolia.etherscan.io/tx/0x1d75e3743010ba5d5138950177e9a31935efa17fe3244bd982206606cb4af625

### Step 4: View Transaction Details

#### In the Submission Transaction:
1. Click on the submission transaction link
2. Scroll down to **"Logs"** section
3. Look for `ProjectSubmitted` event
4. You'll see the `expectedHash` parameter with your hash: `71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd`

#### In the Validation Transaction:
1. Click on the validation transaction link
2. Look for `SABZAValidationCompleted` event in logs
3. You'll see the `actualHash` parameter with the same hash

### Step 5: Read Contract State Directly

Go to your contract page and click **"Contract"** tab, then **"Read Contract"**:

#### Method 1: Use `getProject` function
1. Find function `getProject`
2. Enter project ID: `solar_1753173315014`
3. Click **"Query"**
4. You'll see all project data including both hashes

#### Method 2: Use `verifyProjectProof` function
1. Find function `verifyProjectProof`
2. Enter project ID: `solar_1753173315014`
3. Click **"Query"**
4. Returns: `isValid`, `ipfsCID`, `expectedHash`, `actualHash`, `sabzaValidator`, `status`

## What You'll Find on Blockchain

### Project Data Structure:
```
projectId: "solar_1753173315014"
ipfsCID: "QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS"
expectedSHA256Hash: "71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd"
actualSHA256Hash: "71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd"
tokenSymbol: "SOLAR24"
projectOwner: "0x2caf7A87d1709941bDdb284A200B5f3CEd4eE845"
sabzaValidator: "0x2caf7A87d1709941bDdb284A200B5f3CEd4eE845"
status: 3 (Tokenized)
```

## Hash Verification Process

### Where Hash `71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd` Comes From:

1. **Project Owner** calculates SHA-256 of their document:
   ```bash
   sha256sum solar_project_document.pdf
   # Output: 71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd
   ```

2. **Submits to blockchain** with this expected hash

3. **SABZA Validator** downloads IPFS document:
   ```bash
   # Download from IPFS
   ipfs get QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
   
   # Calculate hash
   sha256sum downloaded_document.pdf
   # Output: 71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd
   ```

4. **Hashes match** ✅ = Document integrity verified!

## Live Verification Links

### Quick Access Links:
- **Contract Overview**: https://sepolia.etherscan.io/address/0x058976FD969398b868C2D88d9193B16Ad458aC67
- **Submit Transaction**: https://sepolia.etherscan.io/tx/0xfaa4e96b90fa05747df6d231c8ed6fb10d693d325cfa889ba4c91f48cd3ca80f
- **Validation Transaction**: https://sepolia.etherscan.io/tx/0x26b1f916d2448a6ea522723a8adcbb1fdc36aac2d918645ea7a46fc91c02b95b
- **IPFS Document**: https://gateway.pinata.cloud/ipfs/QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS

## Manual Hash Verification

You can verify the hash yourself:

### Download the IPFS Document:
```bash
# Using curl
curl -o document.pdf https://gateway.pinata.cloud/ipfs/QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS

# Calculate SHA-256
sha256sum document.pdf
```

### Expected Result:
```
71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd  document.pdf
```

If the hashes match, it proves:
- ✅ Document hasn't been tampered with
- ✅ SABZA validation was accurate
- ✅ Blockchain data is authentic

## Troubleshooting

### If Hash Doesn't Match:
1. **Document Modified**: IPFS content was changed after submission
2. **Wrong IPFS Gateway**: Try different gateway
3. **Encoding Issues**: File encoding/format changed

### Common Checks:
- Verify you're on Sepolia testnet
- Check transaction status is "Success"
- Ensure contract address is correct
- Compare with multiple IPFS gateways

This blockchain verification provides cryptographic proof that your project data is authentic and hasn't been tampered with! 