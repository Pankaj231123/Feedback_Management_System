# AI-Powered Feedback Management System

A production-ready feedback management system with AI-powered intelligent classification, built with TypeScript, React, Node.js, MongoDB, and LangChain.

## 📋 Project Overview

This system allows users to submit feedback that is automatically classified by an LLM (Google Gemini) into:
- **Category**: Bug, Feature Request, Complaint, Praise, Other
- **Priority**: Low, Medium, High
- **Sentiment**: Positive, Neutral, Negative
- **Team**: Engineering, Product, Support, Sales

The system then routes notifications to the appropriate team via email.

## 🏗️ Project Structure

```
aiProject/
├── backend/                    # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── models/            # MongoDB schemas
│   │   ├── controllers/       # API controllers
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic (LLM, Email)
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/                   # React + Vite + TypeScript
    ├── src/
    │   ├── components/        # React components
    │   ├── pages/            # Page components
    │   ├── api/              # API client
    │   ├── types/            # TypeScript types
    │   ├── App.tsx          # Main app component
    │   ├── main.tsx         # Entry point
    │   ├── index.css        # Global styles
    │   └── App.css          # Component styles
    ├── public/              # Static assets
    ├── index.html          # HTML template
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier eligible)
- Google Gemini API key (free tier available)
- Gmail account (for email notifications - optional)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Fill in environment variables:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback_db
   GOOGLE_API_KEY=your_google_gemini_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   
   API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### POST `/api/feedback`
Create new feedback with automatic LLM classification

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "The login button is not working on mobile devices"
}
```

**Response:**
```json
{
  "message": "Feedback created successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "The login button is not working on mobile devices",
    "category": "Bug",
    "priority": "High",
    "sentiment": "Negative",
    "team": "Engineering",
    "createdAt": "2026-03-03T10:30:00Z"
  }
}
```

### GET `/api/feedback`
Get all feedbacks with optional filters

**Query Parameters:**
- `name` - Filter by user name (partial match, case-insensitive)
- `category` - Filter by category
- `priority` - Filter by priority

**Example:**
```
GET /api/feedback?category=Bug&priority=High
```

### GET `/api/feedback/:id`
Get feedback by ID

### DELETE `/api/feedback/:id`
Delete feedback by ID

## 🤖 LLM Integration Details

### Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env` as `GOOGLE_API_KEY`

### Classification Prompt

The system uses LangChain's structured output parser to ensure consistent JSON responses:

```typescript
const prompt = `
You are a feedback classification system.
Extract: category, priority, sentiment, team

Return ONLY valid JSON.
Feedback: "${userMessage}"
`;
```

## 📧 Email Integration (Optional)

### Gmail Setup for Notifications

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App-Specific Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Create App Password for "Mail"
   - Use this password in `.env`

3. Map team emails in `.env`:
   ```env
   ENG_EMAIL=engineering@company.com
   PRODUCT_EMAIL=product@company.com
   SUPPORT_EMAIL=support@company.com
   SALES_EMAIL=sales@company.com
   ```

## 🗄️ Database Schema

### Feedback Model
```typescript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, must be valid email),
  message: String (required, min 10 chars),
  category: String (enum: Bug, Feature Request, Complaint, Praise, Other),
  priority: String (enum: Low, Medium, High),
  sentiment: String (enum: Positive, Neutral, Negative),
  team: String (enum: Engineering, Product, Support, Sales),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Features

### Pages/Components

1. **Feedback List Page**
   - Display all feedbacks in a card grid
   - Real-time filter by name, category, priority
   - Delete feedback functionality
   - Sentiment emoji indicators
   - Priority color indicators

2. **Create Feedback Modal**
   - Form validation
   - Real-time error messages
   - Success notification
   - Auto-refresh feedback list after submission

3. **Search & Filter Section**
   - Name search with regex matching
   - Category dropdown filter
   - Priority dropdown filter

## 🔧 Build & Deployment

### Build Frontend
```bash
cd frontend
npm run build
```
Output: `frontend/dist/`

### Build Backend
```bash
cd backend
npm run build
```
Output: `backend/dist/`

### Deployment Options

**Backend:**
- [Render.com](https://render.com) - Free tier available
- [Railway.app](https://railway.app) - Pay-as-you-go
- [Heroku](https://heroku.com) - Eco dyno (free)

**Frontend:**
- [Vercel](https://vercel.com) - Free tier
- [Netlify](https://netlify.com) - Free tier
- [GitHub Pages](https://pages.github.com) - Free

**Database:**
- [MongoDB Atlas](https://mongodb.com/cloud) - Free tier with 512MB storage

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback_db
GOOGLE_API_KEY=gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
ENG_EMAIL=eng@company.com
PRODUCT_EMAIL=product@company.com
SUPPORT_EMAIL=support@company.com
SALES_EMAIL=sales@company.com
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing API Locally

### Using cURL:
```bash
# Create feedback
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test feedback message about a bug fix"
  }'

# Get all feedbacks
curl http://localhost:5000/api/feedback

# Filter by category
curl "http://localhost:5000/api/feedback?category=Bug"

# Delete feedback
curl -X DELETE http://localhost:5000/api/feedback/{id}
```

### Using Postman:
1. Import the API endpoints
2. Set headers: `Content-Type: application/json`
3. Test each endpoint with sample data

## 📊 Performance Optimizations

- **LangChain Structured Output**: Ensures consistent JSON parsing
- **MongoDB Indexing**: Indexed fields for fast queries
- **CORS Configuration**: Specific origin whitelisting
- **Frontend Caching**: React components optimization
- **Async Email Sending**: Non-blocking email notifications

## 🔒 Security Considerations

- API endpoints validate input data
- MongoDB connection uses encrypted credentials
- Email passwords handled via environment variables
- CORS restricts requests to frontend origin
- TypeScript strict mode ensures type safety

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct
- Test connection: `mongodb+srv://...`

### Gemini API 429 Error (Rate Limit)
- Free tier has request limits
- Implement retry logic
- Consider upgrading API plan

### Email Not Sending
- Enable "Less secure app access" (if needed)
- Use App-Specific Password instead of account password
- Check team email mappings in .env
- Verify SMTP credentials

### CORS Issues
- Check `FRONTEND_URL` in backend .env
- Verify frontend URL matches exactly
- Clear browser cache and try again

## 📚 Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Axios
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB, Mongoose ODM
- **AI/LLM**: LangChain.js, Google Gemini API
- **Email**: Nodemailer
- **Styling**: CSS with responsive design

## 📄 License

MIT License - feel free to use for learning and production.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Questions or Issues?** Open an issue in the repository.
# Feedback_Management_System
