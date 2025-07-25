# 🔐 SABZA Validation System

**Blockchain-based project validation system with manual verification capabilities**

[![Deployment Status](https://img.shields.io/badge/deployment-ready-brightgreen)](https://vercel.com)
[![Network](https://img.shields.io/badge/network-Sepolia-blue)](https://sepolia.etherscan.io/)
[![Contract](https://img.shields.io/badge/contract-verified-success)](https://sepolia.etherscan.io/address/0x058976FD969398b868C2D88d9193B16Ad458aC67)

## 🎯 Overview

SABZA Validation System enables secure, blockchain-based validation of carbon credit projects. The system includes:

- **Smart Contract**: Role-based validation on Ethereum Sepolia
- **API Backend**: RESTful API for blockchain interactions  
- **Web Dashboard**: User-friendly interface for project management
- **Manual Verification**: Direct project validation against blockchain
- **Hash Verification**: Document integrity checking with SHA-256

## 🚀 Quick Start

### 1. Local Development
```bash
# Install dependencies
npm install

# Start API server
npm start

# Open frontend
open frontend/index.html
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📋 Features

### ✅ Core Features
- [x] Smart contract deployment on Sepolia
- [x] Project submission with IPFS integration
- [x] SABZA validator verification process
- [x] Bitbond tokenization workflow
- [x] RESTful API with comprehensive endpoints

### 🆕 New Features  
- [x] **Manual Verification System** - Direct project validation
- [x] **Hash Mismatch Warnings** - Visual integrity alerts
- [x] **Blockchain Explorer Links** - Direct Etherscan integration
- [x] **SHA-256 Calculator** - Standalone hash verification tool

## 🔗 Live System

### Contract Information
- **Address**: `0x058976FD969398b868C2D88d9193B16Ad458aC67`
- **Network**: Ethereum Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x058976FD969398b868C2D88d9193B16Ad458aC67)

### Test Data (SOLAR24 Project)
```
Project ID: solar_1753173315014
Token Symbol: SOLAR24
IPFS CID: QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
Hash: 71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd
Status: ✅ Tokenized
```

## 📚 API Endpoints

```bash
# Health check
GET /api/health

# Get project by token
GET /api/project/token/:symbol

# Get project by ID  
GET /api/project/:id

# Manual verification
POST /api/verify/manual

# Get validated projects
GET /api/projects/validated

# Platform statistics
GET /api/stats
```

## 🔧 Manual Verification Process

1. **Navigate** to Manual Verification tab
2. **Enter** project details:
   - Project ID
   - IPFS URL/CID
   - SHA-256 hash
3. **Submit** to smart contract
4. **Review** verification results:
   - ✅ Green = Data matches blockchain
   - ❌ Red = Data mismatch detected

## 📁 Project Structure

```
Validation Project/
├── api/
│   └── server.js              # Express.js API server
├── frontend/
│   ├── index.html             # Web dashboard
│   └── app.js                 # Frontend JavaScript
├── contracts/
│   └── ProjectValidation.sol  # Smart contract
├── scripts/
│   ├── deploy.js              # Contract deployment
│   └── quick-test-fixed.js    # System testing
├── vercel.json                # Vercel deployment config
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🌐 Environment Variables

```env
CONTRACT_ADDRESS=0x058976FD969398b868C2D88d9193B16Ad458aC67
QUICKNODE_URL=your_rpc_url_here
PRIVATE_KEY=your_private_key_here
```

## 📖 Documentation

- [`CLIENT_PROJECT_REPORT.html`](CLIENT_PROJECT_REPORT.html) - Complete project report
- [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [`HASH_VALIDATION_GUIDE.md`](HASH_VALIDATION_GUIDE.md) - Hash verification explained
- [`MANUAL_VERIFICATION_TEST.md`](MANUAL_VERIFICATION_TEST.md) - Testing guide
- [`BLOCKCHAIN_VERIFICATION_GUIDE.md`](BLOCKCHAIN_VERIFICATION_GUIDE.md) - Blockchain explorer guide

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Ethereum wallet with Sepolia ETH
- QuickNode or Alchemy RPC endpoint

### Local Setup
```bash
# Clone repository
git clone <your-repo-url>
cd "Validation Project"

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

### Testing
```bash
# Run contract tests
npx hardhat test

# Run API tests  
npm run test:api

# Test manual verification
npm run test:verification
```

## 🔒 Security Features

- **Role-based Access Control**: PROJECT_OWNER, SABZA_VALIDATOR, BITBOND_ISSUER roles
- **Cryptographic Signatures**: SABZA validators must sign validation results
- **Hash Verification**: SHA-256 document integrity checking
- **Immutable Storage**: All data stored on Ethereum blockchain
- **Visual Warnings**: Frontend alerts for data mismatches

## 📊 System Status

| Component | Status | Description |
|-----------|--------|-------------|
| Smart Contract | ✅ Deployed | Verified on Sepolia Etherscan |
| API Backend | ✅ Ready | Express.js with all endpoints |
| Frontend Dashboard | ✅ Complete | Responsive web interface |
| Manual Verification | ✅ Functional | Direct blockchain validation |
| Hash Detection | ✅ Working | Visual mismatch warnings |
| Documentation | ✅ Complete | Full guides and reports |

## 🎯 Next Steps

1. **Deploy to Production**: Use Vercel for hosting
2. **Client Training**: Demonstrate manual verification
3. **Go Live**: Start validating real projects
4. **Monitoring**: Track system usage and performance

## 📞 Support

- **Documentation**: See `/docs` folder for complete guides
- **Testing**: Use provided test data for verification
- **Deployment**: Follow `DEPLOYMENT_GUIDE.md`
- **Issues**: Check troubleshooting sections in guides

---

**🎉 Project Status: COMPLETED & READY FOR DEPLOYMENT**

The SABZA Validation System is fully functional with all requested features implemented, tested, and ready for production use. 