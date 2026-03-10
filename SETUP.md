# Project Setup & Run Guide

Complete step-by-step guide to set up and run the AI-Powered Feedback Management System.

## ✅ Prerequisites Checklist

- [ ] Node.js 16+ installed
- [ ] npm or yarn package manager
- [ ] MongoDB Atlas account (free tier)
- [ ] Google Gemini API key (free tier)
- [ ] Gmail account (for email notifications - optional)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## 📋 Step-by-Step Setup

### Step 1: Clone/Navigate to Project

```bash
cd /Users/pankajroy/Desktop/aiProject
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend
```bash
cd backend
```

#### 2.2 Create Environment File
```bash
cp .env.example .env
```

#### 2.3 Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account (if not already)
3. Create new project
4. Create M0 cluster (free tier)
5. Wait for cluster to be provisioned
6. Click "Connect"
7. Create database user with username/password
8. Choose "Drivers" option
9. Copy connection string
10. Replace `<username>` and `<password>` with your credentials
11. Add database name: `feedback_db`

Example:
```
mongodb+srv://user:password@cluster0.mongodb.net/feedback_db?retryWrites=true&w=majority
```

#### 2.4 Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key
4. Keep it safe (don't share publicly)

#### 2.5 Update .env File

Edit `backend/.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/feedback_db?retryWrites=true&w=majority

# Google Gemini API
GOOGLE_API_KEY=your_google_api_key_here

# Email Configuration (Optional - skip if not using)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Team Emails (Optional)
ENG_EMAIL=engineering@company.com
PRODUCT_EMAIL=product@company.com
SUPPORT_EMAIL=support@company.com
SALES_EMAIL=sales@company.com

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### 2.6 Install Dependencies
```bash
npm install
```

#### 2.7 Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
📝 API: http://localhost:5000/api/feedback
🏥 Health: http://localhost:5000/api/health
```

**Keep this terminal open!**

---

### Step 3: Frontend Setup (New Terminal)

#### 3.1 Open New Terminal

#### 3.2 Navigate to Frontend
```bash
cd /Users/pankajroy/Desktop/aiProject/frontend
```

#### 3.3 Install Dependencies
```bash
npm install
```

#### 3.4 Start Frontend Server
```bash
npm run dev
```

You should see:
```
VITE v4.5.0  ready in ### ms

➜  Local:   http://localhost:5173/
```

**Keep this terminal open!**

---

## 🌐 Access the Application

1. **Frontend**: Open browser → `http://localhost:5173`
2. **Backend API**: `http://localhost:5000/api/feedback`
3. **Health Check**: `http://localhost:5000/api/health`

## 🧪 Test the System

### Test 1: Create Feedback

1. Go to frontend (`http://localhost:5173`)
2. Click "+ Submit Feedback"
3. Fill in form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Message**: The login button is not working on mobile devices
4. Click "Submit Feedback"
5. Should see success message
6. Feedback appears in list with classifications

### Test 2: Filter Feedbacks

1. Enter name in search box
2. Select category from dropdown
3. Select priority from dropdown
4. See list update in real-time

### Test 3: Delete Feedback

1. Find a feedback card
2. Click delete button (🗑️)
3. Confirm deletion
4. Card removed from list

### Test 4: API Testing (Optional - Using cURL)

In a new terminal:

```bash
# Check health
curl http://localhost:5000/api/health

# Create feedback
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@test.com",
    "message": "Great product but could use dark mode support"
  }'

# Get all feedbacks
curl http://localhost:5000/api/feedback

# Filter by category
curl "http://localhost:5000/api/feedback?category=Bug"

# Filter by priority
curl "http://localhost:5000/api/feedback?priority=High"
```

## 🐛 Troubleshooting

### Backend Won't Start

**Error: "MongoDB connection failed"**
- ✅ Check `.env` has correct `MONGODB_URI`
- ✅ Verify IP whitelist: [MongoDB Atlas IP Whitelist](https://cloud.mongodb.com/v2/home)
- ✅ Ensure credentials are correct (no special characters encode)
- ✅ Test connection: `mongodb+srv://user:pass@cluster0.mongodb.net/feedback_db?retryWrites=true`

**Error: "API key not found"**
- ✅ Verify `GOOGLE_API_KEY` in `.env`
- ✅ Check API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

**Error: "Cannot find module"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Won't Load

**Error: "Connection refused"**
- ✅ Check backend is running on port 5000
- ✅ Check frontend is running on port 5173
- ✅ Verify CORS is enabled (backend logs should show requests)

**Error: "Cannot GET /*"**
- ✅ Ensure you're accessing `http://localhost:5173`
- ✅ Check Vite dev server is running

### API Calls Fail

**Error: "429 Rate Limit"**
- ✅ Gemini free tier has limits
- ✅ Wait a minute and try again
- ✅ Consider upgrading API plan

**Error: "Email not sending"**
- ✅ If using Gmail: Enable "Less secure app access"
- ✅ Or use App-Specific Password instead
- ✅ Verify email configuration in `.env`

## 📝 Project File Structure

```
aiProject/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── *.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── README.md (Main documentation)
└── .gitignore
```

## 🚀 Optional: Email Setup

### If You Want Email Notifications

#### 1. Enable Gmail App Password

1. Go to [Google Account](https://myaccount.google.com)
2. Left menu → "Security"
3. Enable "2-Step Verification" (if not already)
4. Scroll to "App passwords"
5. Select "Mail" and "Windows Computer"
6. Copy the generated password
7. Add to `.env`:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=the_generated_app_password
```

#### 2. Set Team Email Mappings

Edit `.env`:
```env
ENG_EMAIL=engineering@yourcompany.com
PRODUCT_EMAIL=product@yourcompany.com
SUPPORT_EMAIL=support@yourcompany.com
SALES_EMAIL=sales@yourcompany.com
```

#### 3. Test Email

Create feedback → check team email inbox

---

## 🎓 Learning Resources

- [LangChain.js Documentation](https://js.langchain.com/)
- [Google Gemini API Guide](https://ai.google.dev/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)

## 📦 Build for Production

### Backend

```bash
cd backend
npm run build
npm start
```

Output: `backend/dist/`

### Frontend

```bash
cd frontend
npm run build
```

Output: `frontend/dist/`

## 🌍 Deploy to Production

### Backend on Render.com

1. Push code to GitHub
2. Create account on [Render.com](https://render.com)
3. New Web Service → Connect GitHub
4. Select repository
5. Set environment variables:
   - `MONGODB_URI`
   - `GOOGLE_API_KEY`
   - `FRONTEND_URL` (production frontend URL)
   - (optional) Email variables
6. Deploy

### Frontend on Vercel

1. Create account on [Vercel](https://vercel.com)
2. Import project from GitHub
3. Select `frontend` as root directory
4. Set environment variable:
   - `VITE_API_URL` (if needed)
5. Deploy

## ✨ You're All Set!

The system is now:
- ✅ Frontend running at `http://localhost:5173`
- ✅ Backend API at `http://localhost:5000`
- ✅ Connected to MongoDB
- ✅ Ready for AI-powered feedback classification!

**Happy building! 🚀**
