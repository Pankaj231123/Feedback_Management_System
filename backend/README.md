# Backend - AI Feedback Classification API

Express.js server with TypeScript, MongoDB, and LangChain integration for intelligent feedback classification.

## 📋 Overview

REST API that:
- Accepts user feedback with name, email, and message
- Classifies feedback using Google Gemini LLM via LangChain
- Stores enriched feedback in MongoDB
- Sends email notifications to appropriate teams

## 🏗️ Architecture

```
src/
├── config/
│   ├── env.ts          # Environment variables configuration
│   └── database.ts     # MongoDB connection setup
├── models/
│   └── Feedback.ts     # MongoDB Feedback schema
├── services/
│   ├── llm.service.ts      # LangChain + Gemini integration
│   └── email.service.ts    # Nodemailer integration
├── controllers/
│   └── feedbackController.ts  # API route handlers
├── routes/
│   └── feedbackRoutes.ts   # Route definitions
├── app.ts              # Express app setup
└── server.ts          # Server entry point
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Environment Setup

1. Copy the example:
```bash
cp .env.example .env
```

2. Fill in required variables:

**Essential:**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/feedback_db
GOOGLE_API_KEY=your_google_gemini_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Optional (Email):**
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_specific_password
ENG_EMAIL=eng@company.com
PRODUCT_EMAIL=product@company.com
SUPPORT_EMAIL=support@company.com
SALES_EMAIL=sales@company.com
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## 📡 API Reference

### Create Feedback
```
POST /api/feedback
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "The login button doesn't work on mobile"
}
```

**Response (201):**
```json
{
  "message": "Feedback created successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "The login button doesn't work on mobile",
    "category": "Bug",
    "priority": "High",
    "sentiment": "Negative",
    "team": "Engineering",
    "createdAt": "2026-03-03T10:30:00Z",
    "updatedAt": "2026-03-03T10:30:00Z"
  }
}
```

### Get Feedbacks
```
GET /api/feedback?name=John&category=Bug&priority=High
```

**Response (200):**
```json
{
  "count": 1,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "...",
      "category": "Bug",
      "priority": "High",
      "sentiment": "Negative",
      "team": "Engineering",
      "createdAt": "2026-03-03T10:30:00Z"
    }
  ]
}
```

### Get Feedback by ID
```
GET /api/feedback/:id
```

### Delete Feedback
```
DELETE /api/feedback/:id
```

## 🤖 LLM Integration

### How Classification Works

1. **Prompt Engineering**: Sends feedback to Gemini with structured prompt
2. **Output Parser**: Uses LangChain's StructuredOutputParser for JSON format
3. **Fallback**: Returns default values if LLM fails
4. **Async**: Non-blocking email notifications after save

### Supported Classifications

| Field | Values |
|-------|--------|
| Category | Bug, Feature Request, Complaint, Praise, Other |
| Priority | Low, Medium, High |
| Sentiment | Positive, Neutral, Negative |
| Team | Engineering, Product, Support, Sales |

## 📧 Email Notifications

Automatic email sent to team after feedback creation:

- **Subject**: `[HIGH] New Bug - Negative Sentiment`
- **Body**: Includes name, email, message, and all classifications
- **To**: Team email from mapping

### Gmail Setup

1. Enable 2FA on Gmail
2. Generate App Password:
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Create "Mail" app password
   - Use in `EMAIL_PASSWORD`

## 🗄️ Database

### Feedback Model

```typescript
{
  _id: ObjectId
  name: String (required)
  email: String (required, validated)
  message: String (required, min 10 chars)
  category: String (default: "Other")
  priority: String (default: "Medium")
  sentiment: String (default: "Neutral")
  team: String (default: "Support")
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### MongoDB Atlas Setup

1. Create free cluster at [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create database user with auto-generated password
3. Whitelist IP address
4. Copy connection string
5. Format: `mongodb+srv://user:pass@cluster.mongodb.net/feedback_db`

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Create Feedback
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@test.com",
    "message": "Great product but needs dark mode support"
  }'
```

### Get All
```bash
curl http://localhost:5000/api/feedback
```

### Filter
```bash
curl "http://localhost:5000/api/feedback?category=Bug&priority=High"
```

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| mongoose | ^7.7.0 | MongoDB ODM |
| @langchain/google-genai | ^0.0.15 | Gemini integration |
| langchain | ^0.1.0 | LLM framework |
| nodemailer | ^6.9.0 | Email sending |
| dotenv | ^16.3.1 | Env variables |
| cors | ^2.8.5 | CORS middleware |

## 🚀 Deployment

### Render.com

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy (auto-rebuilds on push)

### Railway.app

1. Connect GitHub account
2. Create new project from repository
3. Add MongoDB plugin
4. Set environment variables
5. Deploy

### Environment Variables on Platform

Copy all values from `.env` to platform's environment settings:
- `MONGODB_URI`
- `GOOGLE_API_KEY`
- `EMAIL_USER` (if using notifications)
- `EMAIL_PASSWORD` (if using notifications)
- `PORT` (usually auto-set)
- `FRONTEND_URL` (production frontend URL)

## ⚠️ Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "MongoDB connection failed" | Invalid URI or credentials | Check `.env` MONGODB_URI |
| "API key not found" | Missing GOOGLE_API_KEY | Add to `.env` |
| "Message too short" | Min 10 characters required | Provide longer message |
| "Invalid email" | Email format incorrect | Use valid email address |

## 🔒 Security

- ✅ Input validation on all endpoints
- ✅ Email password in ENV (never in code)
- ✅ CORS restricted to frontend origin
- ✅ TypeScript strict mode
- ✅ MongoDB credentials encrypted in connection string

## 📈 Performance

- Async email sending (doesn't block response)
- LangChain caching for LLM calls
- MongoDB indexes on frequently queried fields
- Error handling prevents crashes

## 🛠️ Development Tools

- TypeScript for type safety
- ts-node for development
- TSC for production builds
- ESM modules for modern imports

---

**Need Help?** Check the main [README.md](/README.md)
