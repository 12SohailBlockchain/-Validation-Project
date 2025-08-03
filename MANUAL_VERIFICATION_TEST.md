# Manual Verification Test Guide - Enhanced Rajasthan Solar PV

## Overview
Test the enhanced manual verification feature using the updated Rajasthan Solar PV project with comprehensive metadata.

## Enhanced Test Data - Rajasthan Solar PV Project

Based on your enhanced metadata structure, here's the updated test data:

### 🌞 Rajasthan Solar PV Project (Enhanced Metadata)
```
Project ID: solar_1754261007090  (Latest Enhanced Registry ID)
Project Title: Rajasthan Solar PV - Large Scale Clean Energy Initiative
Token Symbol: RSOLAR
IPFS CID: QmdasbFfSFeGyNduhD5Qu8RuqCyBKnLDWgkc3EYQxvtiFx
Expected Hash: 4b0f7f43dd5b0abce0bf0bc4e3b5d38eead57ee45d634965e984e204ed5c59da
Status: Tokenized ✅
```

### 📍 **Location Details:**
- **Country:** India
- **State:** Rajasthan
- **Coordinates:** 26.9124, 75.7873 (Google Maps Link Available)

### 🌱 **Carbon Credits:**
- **CO₂ Reduction:** 27,850 tCO₂e
- **Vintage Year:** 2023
- **Methodology:** ACM0002
- **GCC Methodology:** GCCM001 (Version - 3.0)
- **Verified By:** UNFCCC-CDM, GCC
- **CORSIA Eligible:** Yes

### ⚡ **Technical Specifications:**
- **Capacity:** 150 MW
- **Technology:** Solar Photovoltaic
- **Status:** Active/Operational
- **Energy Generation:** 300 GWh annually

### 🏆 **Certifications:**
- UNFCCC-CDM
- **GCC Verified** (Highlighted)
- CORSIA Eligible
- Gold Standard
- Verified Carbon Standard (VCS)

### 💰 **Economic Impact:**
- **Total Investment:** $180,000,000 USD
- **Jobs Created:** 1,200 direct, 3,000 indirect
- **Community Benefit:** Education and healthcare programs

## How to Test Enhanced Manual Verification

### Step 1: Start Your System
```bash
cd "Validation Project"
node api/server.js
```

### Step 2: Open Frontend
Open `frontend/index.html` in your browser

### Step 3: Navigate to Manual Verification
Click on the "🔐 Manual Verification" tab

### Step 4: Test Enhanced Verification
Enter the registry-compliant data:

**Project ID:**
```
solar_1753173315014
```

**IPFS URL (Multiple formats supported):**
```
QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
```
OR
```
ipfs://QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
```
OR
```
https://gateway.pinata.cloud/ipfs/QmdasbFfSFeGyNduhD5Qu8RuqCyBKnLDWgkc3EYQxvtiFx
```

**SHA-256 Hash:**
```
4b0f7f43dd5b0abce0bf0bc4e3b5d38eead57ee45d634965e984e204ed5c59da
```

**Expected Result:** ✅ VERIFICATION SUCCESSFUL with Enhanced Metadata Display

## Enhanced Features to Test

### ✅ **New Enhanced Display Features:**

1. **Geographic Information:**
   - Location with coordinates
   - Clickable Google Maps link
   - State and country details

2. **Comprehensive Carbon Credits:**
   - CO₂ reduction prominently displayed
   - Vintage year and methodology
   - **GCC methodology highlighted**
   - Multiple verifier information

3. **Technical Specifications:**
   - Project capacity and technology
   - Operational status
   - Energy generation metrics

4. **Enhanced Certifications:**
   - **GCC Verified badge** (special highlighting)
   - CORSIA eligibility badge
   - Multiple certification standards

5. **Sustainability Metrics:**
   - SDG goals alignment
   - Co-benefits display
   - Environmental impact indicators

6. **Economic Impact:**
   - Investment amounts
   - Job creation numbers
   - Community benefits

7. **Streamlined IPFS Documentation:**
   - Project Design Document
   - Monitoring Report
   - Verification Report
   - Certificates
   - **All links properly formatted and accessible**

### ✅ **GCC Integration Testing:**

The system now properly displays:
- **GCC Methodology:** GCCM001 (Version - 3.0)
- **GCC Verified Badge:** Special highlighting
- **Additional Verifier:** GCC listed alongside UNFCCC-CDM

### ✅ **IPFS Links Streamlining:**

Test that all IPFS documentation links are:
- Properly organized by document type
- Easily accessible with clear labels
- Opening in new tabs
- Using standardized gateway URLs

## Test Failure Scenarios

### Test with Wrong Hash:
```
Project ID: solar_1753173315014
IPFS URL: QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
SHA-256 Hash: wronghash123456789abcdef
```
**Expected Result:** ❌ VERIFICATION FAILED with clear mismatch warnings

### Test with Non-Existent Project:
```
Project ID: nonexistent_project_123
```
**Expected Result:** ❌ Project not found error

## Client Demonstration Checklist

### ✅ **Show Enhanced Features:**
- [ ] Project loads with enhanced metadata
- [ ] Geographic coordinates display with map link
- [ ] GCC verification is prominently shown
- [ ] IPFS documentation links are streamlined
- [ ] All certifications display correctly
- [ ] Economic impact data is visible
- [ ] Sustainability metrics are shown

### ✅ **Verify Core Functionality:**
- [ ] Manual verification works correctly
- [ ] Hash comparison functions properly
- [ ] Blockchain explorer links work
- [ ] All badges and highlights display
- [ ] Mobile responsive design works

## Registry Compliance Notes

- **Project ID:** `solar_1753173315014` - **DO NOT CHANGE** (per registry requirements)
- **GCC Integration:** Fully implemented with methodology and verification
- **IPFS Streamlining:** All documentation links organized and accessible
- **Coordinate Display:** Geographic information with interactive mapping

## API Endpoint Testing

Test the enhanced metadata via API:
```bash
curl http://localhost:3000/api/project/solar_1753173315014
```

Should return comprehensive metadata including:
- Enhanced project information
- Geographic coordinates
- GCC methodology details
- Streamlined documentation links
- Complete certification information

---

## ✅ SUCCESS INDICATORS

When testing is successful, you should see:
- **Enhanced project display** with all metadata sections
- **GCC Verified badge** prominently displayed
- **Geographic coordinates** with clickable map link
- **Streamlined IPFS documentation** section
- **Comprehensive certification** badges
- **Economic and sustainability** metrics
- **Registry-compliant project ID** maintained

This enhanced validation system provides your clients with comprehensive project information while maintaining blockchain security and verification integrity. 