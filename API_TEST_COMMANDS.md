# API Test Commands for Manual Verification

## Test the Manual Verification API Endpoint

### 1. Test Successful Verification (SOLAR24 Project)

```bash
curl -X POST http://localhost:3000/api/verify/manual \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "solar_1754261007090",
    "ipfsCID": "QmdasbFfSFeGyNduhD5Qu8RuqCyBKnLDWgkc3EYQxvtiFx",
    "sha256Hash": "4b0f7f43dd5b0abce0bf0bc4e3b5d38eead57ee45d634965e984e204ed5c59da"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "verification": {
      "projectExists": true,
      "projectIdMatch": true,
      "ipfsCIDMatch": true,
      "expectedHashMatch": true,
      "actualHashMatch": true,
      "isValidated": true
    },
    "allMatch": true,
    "project": {
      "projectId": "solar_1753173315014",
      "tokenSymbol": "SOLAR24",
      "status": "Tokenized",
      "ipfsCID": "QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS",
        "expectedSHA256Hash": "4b0f7f43dd5b0abce0bf0bc4e3b5d38eead57ee45d634965e984e204ed5c59da",
  "actualSHA256Hash": "4b0f7f43dd5b0abce0bf0bc4e3b5d38eead57ee45d634965e984e204ed5c59da"
    }
  }
}
```

### 2. Test Verification with Wrong Hash

```bash
curl -X POST http://localhost:3000/api/verify/manual \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "solar_1753173315014",
    "ipfsCID": "QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS",
    "sha256Hash": "wronghash123456789abcdef"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "verification": {
      "projectExists": true,
      "projectIdMatch": true,
      "ipfsCIDMatch": true,
      "expectedHashMatch": false,
      "actualHashMatch": false,
      "isValidated": true
    },
    "allMatch": false,
    "project": {
      "projectId": "solar_1753173315014",
      "status": "Tokenized"
    }
  }
}
```

### 3. Test with Non-Existent Project

```bash
curl -X POST http://localhost:3000/api/verify/manual \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "nonexistent_project_123",
    "ipfsCID": "QmTestCID",
    "sha256Hash": "testhash123"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Manual verification failed: Project not found"
}
```

### 4. Test with Missing Fields

```bash
curl -X POST http://localhost:3000/api/verify/manual \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "solar_1753173315014"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Missing required fields: projectId, ipfsCID, sha256Hash"
}
```

## Other Useful API Tests

### Get Project by Token Symbol
```bash
curl http://localhost:3000/api/project/token/SOLAR24
```

### Get Project by ID
```bash
curl http://localhost:3000/api/project/solar_1753173315014
```

### Verify Blockchain Proof
```bash
curl http://localhost:3000/api/verify/solar_1753173315014
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Get Statistics
```bash
curl http://localhost:3000/api/stats
```

## Testing from JavaScript Console

You can also test from browser console when the frontend is open:

```javascript
// Test successful verification
fetch('http://localhost:3000/api/verify/manual', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectId: 'solar_1754261007090',
    ipfsCID: 'QmdasbFfSFeGyNduhD5Qu8RuqCyBKnLDWgkc3EYQxvtiFx',
    sha256Hash: '4b0f7f43dd5b0abce0bf0bc4e3b5d38eead57ee45d634965e984e204ed5c59da'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## PowerShell Commands (Windows)

```powershell
# Test successful verification
Invoke-RestMethod -Uri "http://localhost:3000/api/verify/manual" -Method POST -ContentType "application/json" -Body '{"projectId":"solar_1753173315014","ipfsCID":"QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS","sha256Hash":"71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd"}'
``` 