# 🚀 SABZA Validation System - Deployment Guide

## Overview
This guide will help you deploy the SABZA Validation System to Vercel hosting platform for live production use.

## Prerequisites
- Node.js 18+ installed
- Git repository
- Vercel account (free)
- Environment variables ready

## Deployment Steps

### Step 1: Prepare for Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

### Step 2: Configure Environment Variables

In your Vercel dashboard, add these environment variables:

```
CONTRACT_ADDRESS = 0x058976FD969398b868C2D88d9193B16Ad458aC67
QUICKNODE_URL = your_quicknode_rpc_url_here
PRIVATE_KEY = your_ethereum_private_key_here
```

### Step 3: Deploy to Vercel

1. **Navigate to project directory:**
```bash
cd "Validation Project"
```

2. **Deploy to production:**
```bash
vercel --prod
```

3. **Follow the prompts:**
- Link to existing project or create new
- Confirm deployment settings
- Wait for deployment to complete

### Step 4: Verify Deployment

1. **Test the live URL provided by Vercel**
2. **Check API endpoints:**
   - `https://your-app.vercel.app/api/health`
   - `https://your-app.vercel.app/api/stats`

3. **Test manual verification:**
   - Navigate to Manual Verification tab
   - Enter test data for SOLAR24 project
   - Verify it works with blockchain

## Test Data for Live System

### SOLAR24 Project (Verified & Tokenized)
```
Project ID: solar_1753173315014
IPFS URL: QmdgWk4Lw9rYHy1NqYXKbWXQ7fkxnUeo9e6tQeUaDZtvcS
SHA-256 Hash: 71abc320a1a206906c7749cab74d52a69ed4f31d2e48de4e76870e5ab7fdd2bd
Expected Result: ✅ VERIFICATION SUCCESSFUL
```

## Alternative Deployment Options

### Option 1: Netlify
1. Upload `frontend/` folder to Netlify
2. Deploy API separately to Heroku/Railway
3. Update `API_BASE_URL` in `frontend/app.js`

### Option 2: Traditional VPS
1. Upload files to your server
2. Install Node.js and dependencies
3. Run `npm start` for API server
4. Serve frontend files with nginx/apache

## Troubleshooting

### Common Issues:

1. **API not connecting:**
   - Check environment variables in Vercel dashboard
   - Verify QuickNode RPC URL is working
   - Check contract address is correct

2. **CORS errors:**
   - API includes CORS headers, should work
   - Check if API is deployed correctly

3. **Environment variables not loading:**
   - Redeploy after adding environment variables
   - Check variable names match exactly

### Support Commands:

```bash
# Check deployment logs
vercel logs your-deployment-url

# Redeploy
vercel --prod

# Check environment variables
vercel env ls
```

## Live URLs Structure

After deployment, your URLs will be:
- **Frontend:** `https://your-app.vercel.app/`
- **API Health:** `https://your-app.vercel.app/api/health`
- **Manual Verification:** `https://your-app.vercel.app/api/verify/manual`

## Security Notes

1. **Private Key:** Never commit to git, only in Vercel environment variables
2. **RPC URL:** Use environment variables, not hardcoded
3. **HTTPS:** Vercel provides SSL certificates automatically

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API health check returns success
- [ ] Manual verification works with test data
- [ ] Blockchain explorer links work
- [ ] All statistics load properly
- [ ] Project search functions correctly

## Client Handover

1. **Provide live URL** to client
2. **Share test data** for manual verification
3. **Demonstrate features** on live system
4. **Provide admin access** to Vercel dashboard if needed

Your SABZA Validation System is now ready for production use! 🎉 