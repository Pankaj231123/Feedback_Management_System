# Deployment Guide

Complete guide to deploy the AI Feedback System to production.

## 🚀 Deployment Architecture

```
Frontend (Vercel/Netlify)
        ↓ API calls
Backend API (Render/Railway)
        ↓ MongoDB connection
Database (MongoDB Atlas)
```

## 📋 Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] `.env` files in `.gitignore` (NOT in repo)
- [ ] Backend runs locally without errors
- [ ] Frontend builds successfully (`npm run build`)
- [ ] MongoDB Atlas cluster created
- [ ] Google Gemini API key obtained
- [ ] Email configured (optional)
- [ ] All environment variables documented

## 🔧 Environment Variables Required

### Backend Production `.env`

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/feedback_db?retryWrites=true&w=majority

# Google Gemini API
GOOGLE_API_KEY=xxx

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Email (Optional)
EMAIL_USER=xxx
EMAIL_PASSWORD=xxx
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
ENG_EMAIL=xxx
PRODUCT_EMAIL=xxx
SUPPORT_EMAIL=xxx
SALES_EMAIL=xxx
```

---

## 📦 Option 1: Deploy to Render.com (Recommended)

### Backend Deployment

#### 1. Prepare Repository

```bash
# Make sure all files are committed
git add .
git commit -m "Production ready"
git push origin main
```

#### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

#### 3. Deploy Backend

1. Click "New +" → "Web Service"
2. Connect to repository
3. Configure:
   - **Name**: `feedback-ai-api` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Region**: Choose closest to users
4. Click "Advanced" and add environment variables:
   ```
   MONGODB_URI=...
   GOOGLE_API_KEY=...
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
5. Click "Create Web Service"

**Backend URL**: `https://feedback-ai-api.onrender.com`

#### 4. Update Frontend API URL

In `frontend/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://feedback-ai-api.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
```

Or create `.env.production`:
```
VITE_API_URL=https://feedback-ai-api.onrender.com
```

---

## 📦 Option 2: Deploy Backend to Railway.app

### 1. Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### 2. Deploy

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js project
5. Configure environment variables:
   - Add all variables from backend `.env`
6. Deploy

**Backend URL**: Auto-assigned by Railway (shown in dashboard)

---

## 🎨 Option 1: Deploy Frontend to Vercel

### 1. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### 2. Deploy Frontend

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   - `VITE_API_URL=https://your-backend-url.onrender.com`
5. Click "Deploy"

**Frontend URL**: `https://your-app.vercel.app`

### 3. Update Backend CORS

In `backend/.env`:
```env
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🎨 Option 2: Deploy Frontend to Netlify

### 1. Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### 2. Deploy

1. Click "Add new site" → "Import an existing project"
2. Connect GitHub
3. Select repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables:
   - `VITE_API_URL=https://your-backend-url`
6. Click "Deploy site"

**Frontend URL**: `https://your-app.netlify.app`

---

## 🗄️ MongoDB Atlas (Database)

### Setup Instructions

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create free account
3. Create new project
4. Build an M0 cluster (free tier)
5. Wait for provisioning (5-10 minutes)
6. Click "Connect"
7. Create database user:
   - **Username**: e.g., `feedback_admin`
   - **Password**: Auto-generate strong password
   - **Method**: Password
8. Choose "Drivers" connection method
9. Copy connection string:
   ```
   mongodb+srv://feedback_admin:PASSWORD@cluster0.mongodb.net/feedback_db?retryWrites=true&w=majority
   ```
10. Add to backend `.env`:
    ```
    MONGODB_URI=mongodb+srv://feedback_admin:PASSWORD@cluster0.mongodb.net/feedback_db?retryWrites=true&w=majority
    ```

### Security Setup

1. Network Access:
   - Click "Network Access" in left menu
   - Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for simplicity
   - Or add specific IPs (recommended for production)

2. Database Access:
   - Manage users and roles
   - Use strong passwords
   - Limit access to specific databases

---

## 🔐 Environment Variables Checklist

### Copy to Each Platform

| Variable | Backend | Frontend | Example |
|----------|---------|----------|---------|
| MONGODB_URI | ✅ | ❌ | mongodb+srv://... |
| GOOGLE_API_KEY | ✅ | ❌ | AIzaSy... |
| EMAIL_USER | ✅ | ❌ | your@gmail.com |
| EMAIL_PASSWORD | ✅ | ❌ | xxxx xxxx xxxx xxxx |
| NODE_ENV | ✅ | ❌ | production |
| FRONTEND_URL | ✅ | ❌ | https://app.vercel.app |
| VITE_API_URL | ❌ | ✅ | https://api.onrender.com |

---

## 🧪 Test Deployed Application

### 1. Frontend Load Test

1. Visit: `https://your-frontend-url.com`
2. Should load successfully
3. Check console for errors (F12)

### 2. API Connection Test

1. Click "+ Submit Feedback"
2. Fill form with test data
3. Submit
4. Should run LLM classification
5. Should appear in list
6. Check backend logs for requests

### 3. Database Verification

1. Log in to MongoDB Atlas
2. Navigate to "Browse Collections"
3. Should see `Feedback` collection
4. View recent documents

### 4. Email Test (If Configured)

1. Create feedback that triggers classification
2. Check team email inbox
3. Verify email received with feedback details

---

## 🔄 Continuous Deployment (CD)

### GitHub Actions (Optional Auto-Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # Deploy backend
      - name: Deploy Backend to Render
        run: |
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
      
      # Deploy frontend (Vercel handles auto-deploy from GitHub)
```

---

## 📊 Monitoring & Logs

### Backend Logs

**Render.com**:
1. Go to service dashboard
2. Click "Logs" tab
3. View real-time logs

**Railway.app**:
1. Select project
2. View logs in dashboard
3. Filter by service

### Frontend Monitoring

**Vercel**:
1. Go to project dashboard
2. "Analytics" tab
3. View performance metrics

**Netlify**:
1. Go to site settings
2. "Analytics" section
3. View deployment history

---

## 🚨 Troubleshooting Production Issues

### Backend Not Responding

**Check:**
1. Service is running (check platform dashboard)
2. Environment variables are set correctly
3. Log into dashboard and view error logs
4. Verify MongoDB connection string
5. Check API key is valid

### Frontend Shows "Cannot Connect to API"

**Check:**
1. Backend service is running
2. `FRONTEND_URL` in backend matches deployment URL
3. API endpoint in vite.config.ts is correct
4. CORS is enabled
5. Network tab in browser DevTools

### Database Connection Fails

**Check:**
1. `MONGODB_URI` is correct format
2. IP whitelist includes platform's IPs
3. Database user credentials are correct
4. Connection string has `/feedback_db` at end
5. Test string locally before deploying

### LLM Errors (429 Rate Limit)

**Solutions:**
1. Free tier has requests/min limit
2. Wait before retrying
3. Upgrade API plan
4. Add retry logic in code

---

## 📈 Scaling Considerations

### For Increased Traffic

1. **Database**: Consider upgrading MongoDB plan
2. **Backend**: Render/Railway auto-scale with paid plans
3. **Frontend**: Netlify/Vercel handle scale automatically
4. **API Rate Limiting**: Add rate limiter middleware
5. **Caching**: Implement Redis for frequently accessed data

---

## 🔒 Security Best Practices

- ✅ Never commit `.env` to repository
- ✅ Use different credentials for dev/prod
- ✅ Rotate API keys periodically
- ✅ Monitor access logs
- ✅ Enable database backups
- ✅ Use HTTPS only (auto with Vercel/Netlify)
- ✅ Set strong passwords for all services
- ✅ Keep dependencies updated

---

## 💰 Cost Estimation

### Free Tier Resources

| Service | Free Tier | Limit |
|---------|-----------|-------|
| MongoDB Atlas | 512 MB | 3 replicas |
| Render.com | Yes | 750 hours/month |
| Vercel | Yes | Unlimited |
| Google Gemini API | Yes | 60 calls/minute |
| Gmail SMTP | Yes | Unlimited |

### Production Costs (Estimated)

- MongoDB: $57/month (M1 tier, 10GB)
- Backend: $7/month (Render paid plan)
- Frontend: Free (Vercel)
- API: Free or $100+/month (Gemini depends on usage)
- **Total**: ~$165-200/month

---

## 📞 Support

If deployment fails:

1. Check platform-specific documentation
2. Review logs in dashboard
3. Verify environment variables
4. Test API locally
5. Check GitHub issues/documentation
6. Contact platform support

**Happy deploying! 🚀**
