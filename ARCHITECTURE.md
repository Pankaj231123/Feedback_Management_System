# Project Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                               │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Vite)                                            │
│  ├── App.tsx (Main component)                                     │
│  ├── FeedbackModal.tsx (Form)                                     │
│  ├── FeedbackList.tsx (Display)                                   │
│  ├── SearchFilters.tsx (Filters)                                  │
│  └── feedbackApi.ts (API client)                                 │
└────────────────┬────────────────────────────────────────────────┘
                 │ HTTP REST API (JSON)
                 │ /api/feedback endpoints
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                   NODE.JS BACKEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  Express Server (TypeScript)                                      │
│                                                                    │
│  Routes Layer                                                     │
│  ├── POST /api/feedback      (Create)                            │
│  ├── GET /api/feedback       (List with filters)                 │
│  ├── GET /api/feedback/:id   (Single)                            │
│  └── DELETE /api/feedback/:id (Delete)                           │
│                                                                    │
│  Controllers Layer                                               │
│  └── feedbackController.ts                                        │
│      ├── createFeedback()  ─────┐                               │
│      ├── getFeedbacks()          │                               │
│      ├── getFeedbackById()        │                               │
│      └── deleteFeedback()         │                               │
│                                   │                               │
│  Services Layer                   │                               │
│  ├── llm.service.ts ◄────────────┤ LLM Classification          │
│  │   └── classifyFeedback()      │                              │
│  │       Uses LangChain          │                              │
│  │                                │                              │
│  └── email.service.ts            │                              │
│      └── sendTeamNotification()   │                              │
│          Uses Nodemailer          │                              │
│                                   │                              │
│  Models Layer                     │                              │
│  └── Feedback.ts ◄────────────────┘ MongoDB Schema             │
│      └── Mongoose Definition                                     │
│                                                                    │
└────────┬────────────────┬──────────────────────────┬────────────┘
         │                │                          │
         │ LLM Requests  │ MongoDB Reads/Writes    │ Email SMTP
         │                │                          │
         ▼                ▼                          ▼
    ┌─────────┐   ┌──────────────┐       ┌──────────────────┐
    │ GEMINI  │   │  MONGODB     │       │ Gmail SMTP       │
    │  API    │   │  ATLAS       │       │ (Optional)       │
    └─────────┘   │              │       └──────────────────┘
                  │ Feedback DB  │
                  │ Collections: │
                  │ - feedback   │
                  │ - indexes    │
                  └──────────────┘
```

## 📊 Data Flow: Feedback Creation

```
USER SUBMITS FORM
        │
        ▼
Frontend Validation
  (name, email, message)
        │
        ▼
POST /api/feedback
  └─> Backend Controller
        │
        ▼
  1. Extract Data
     {name, email, message}
        │
        ▼
  2. Call LLM Service
     classifyFeedback(message)
        │
        ▼
     Send to Gemini via LangChain
     (StructuredOutputParser)
        │
        ▼
     Response:
     {
       category: "Bug",
       priority: "High",
       sentiment: "Negative",
       team: "Engineering"
     }
        │
        ▼
  3. Create Feedback Document
     {
       name, email, message,
       category, priority,
       sentiment, team,
       createdAt, updatedAt
     }
        │
        ▼
  4. Save to MongoDB
     Feedback.save()
        │
        ▼
  5. Send Email Notification
     (async - non-blocking)
     sendTeamNotification(team)
        │
        ▼
  6. Return Response (201)
     {
       message: "Success",
       data: feedback
     }
        │
        ▼
Frontend Receives Response
        │
        ▼
Success Alert
        │
        ▼
Refresh Feedback List
        │
        ▼
New feedback appears in grid
```

## 🔄 Data Flow: Fetch & Filter

```
USER INTERACTS WITH FILTERS
        │
        ├─> Type in Name Search
        │
        ├─> Select Category
        │
        └─> Select Priority
        │
        ▼
Frontend Updates State
  nameFilter, categoryFilter, priorityFilter
        │
        ▼
GET /api/feedback
  ?name=John
  &category=Bug
  &priority=High
        │
        ▼
Backend Builds Query
  query = {}
  if (name) query.name = {$regex, $options: "i"}
  if (category) query.category = category
  if (priority) query.priority = priority
        │
        ▼
MongoDB Find
  Feedback.find(query).sort({createdAt: -1})
        │
        ▼
Return Results
  {
    count: 5,
    data: [...]
  }
        │
        ▼
Frontend Renders Cards
  ├─ Sentiment emoji
  ├─ Priority badge
  ├─ Category badge
  ├─ Team badge
  ├─ Message
  ├─ Email
  └─ Timestamp
```

## 🗑️ Data Flow: Delete

```
USER CLICKS DELETE
        │
        ▼
Confirmation Dialog
        │
        ├─> User Cancels → No action
        │
        └─> User Confirms
                │
                ▼
DELETE /api/feedback/:id
        │
        ▼
Backend Controller
        │
        ▼
findByIdAndDelete(id)
        │
        ▼
MongoDB Deletes Document
        │
        ▼
Return Deleted Feedback (200)
        │
        ▼
Frontend Success Alert
        │
        ▼
Refresh Feedback List
        │
        ▼
Card Removed from Grid
```

## 📁 File Structure Tree

```
aiProject/
│
├── 📄 README.md                 (Main documentation)
├── 📄 SETUP.md                  (Step-by-step setup guide)
├── 📄 DEPLOYMENT.md             (Deployment instructions)
├── 📄 CHECKLIST.md              (Quick reference)
├── 📄 ARCHITECTURE.md           (This file)
├── 📄 .gitignore                (Git configuration)
│
├── backend/
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   ├── env.ts           (Environment configuration)
│   │   │   └── database.ts      (MongoDB connection)
│   │   │
│   │   ├── 📂 models/
│   │   │   └── Feedback.ts      (Mongoose schema)
│   │   │
│   │   ├── 📂 controllers/
│   │   │   └── feedbackController.ts (Route handlers)
│   │   │
│   │   ├── 📂 routes/
│   │   │   └── feedbackRoutes.ts (API endpoints)
│   │   │
│   │   ├── 📂 services/
│   │   │   ├── llm.service.ts       (LangChain + Gemini)
│   │   │   └── email.service.ts     (Nodemailer)
│   │   │
│   │   ├── app.ts               (Express app setup)
│   │   └── server.ts            (Server entry point)
│   │
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 .env.example
│   ├── 📄 .gitignore
│   ├── 📄 README.md             (Backend documentation)
│   └── 📂 dist/                 (Compiled output - generated)
│
└── frontend/
    ├── 📂 src/
    │   ├── 📂 components/
    │   │   ├── FeedbackList.tsx     (Feedback grid display)
    │   │   ├── FeedbackModal.tsx    (Form modal)
    │   │   └── SearchFilters.tsx    (Filter controls)
    │   │
    │   ├── 📂 api/
    │   │   └── feedbackApi.ts       (Axios client)
    │   │
    │   ├── 📂 types/
    │   │   └── feedback.ts          (TypeScript interfaces)
    │   │
    │   ├── App.tsx                  (Main app component)
    │   ├── main.tsx                 (React entry point)
    │   ├── index.css                (Global styles)
    │   └── App.css                  (Component styles)
    │
    ├── 📂 public/                   (Static assets)
    ├── 📄 index.html                (HTML template)
    ├── 📄 package.json
    ├── 📄 tsconfig.json
    ├── 📄 tsconfig.node.json
    ├── 📄 vite.config.ts            (Vite configuration)
    ├── 📄 .gitignore
    ├── 📄 README.md                 (Frontend documentation)
    └── 📂 dist/                     (Build output - generated)
```

## 🔗 API Contract

### Request/Response Examples

#### 1. Create Feedback
```
REQUEST:
POST /api/feedback HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Login button not working on mobile"
}

RESPONSE (201):
{
  "message": "Feedback created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Login button not working on mobile",
    "category": "Bug",
    "priority": "High",
    "sentiment": "Negative",
    "team": "Engineering",
    "createdAt": "2026-03-03T10:30:00Z",
    "updatedAt": "2026-03-03T10:30:00Z"
  }
}
```

#### 2. Get Feedbacks with Filters
```
REQUEST:
GET /api/feedback?category=Bug&priority=High HTTP/1.1
Host: localhost:5000

RESPONSE (200):
{
  "count": 2,
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

#### 3. Delete Feedback
```
REQUEST:
DELETE /api/feedback/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:5000

RESPONSE (200):
{
  "message": "Feedback deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "...",
    "category": "Bug",
    "priority": "High",
    "sentiment": "Negative",
    "team": "Engineering",
    "createdAt": "2026-03-03T10:30:00Z"
  }
}
```

## 🧱 Layer Architecture

```
┌──────────────────────────────────────────────┐
│     PRESENTATION LAYER (Frontend)             │
│  React Components + HTTP Client               │
│  - FeedbackList, FeedbackModal                │
│  - SearchFilters, API communications         │
└──────────────────┬───────────────────────────┘
                   │ REST API (JSON)
┌──────────────────▼───────────────────────────┐
│     API LAYER (Backend Routes)                │
│  Express Routes + Middleware                  │
│  - Routing, Validation, CORS                 │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│  APPLICATION LAYER (Controllers)              │
│  - Business Logic Orchestration               │
│  - Coordinates Services                       │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│   SERVICE LAYER (Business Logic)              │
│  - LLM Classification (llm.service.ts)       │
│  - Email Notifications (email.service.ts)    │
│  - Data Transformation                        │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│   DATA LAYER (Models & Access)                │
│  - Mongoose Models (Feedback.ts)             │
│  - MongoDB Queries                            │
│  - Data Validation                            │
└──────────────────┬───────────────────────────┘
                   │
                   └─────┬──────────┬──────────┐
                         │          │          │
             ┌───────────▼──┐   ┌──▼─────────┐│
             │  MongoDB     │   │ Gemini API ││
             │  Database    │   │ Google     ││
             └──────────────┘   └───────────┬│
                                  SMTP Mail │
                                  Service  ┘
```

## 🎯 Component Responsibilities

### Frontend Components

| Component | Responsibility |
|-----------|-----------------|
| App.tsx | State management, orchestration |
| FeedbackList.tsx | Display feedback cards, handle delete |
| FeedbackModal.tsx | Form input, validation, submission |
| SearchFilters.tsx | Filter UI, state updates |
| feedbackApi.ts | API communication |

### Backend Components

| Component | Responsibility |
|-----------|-----------------|
| routes/feedbackRoutes.ts | Define endpoints |
| controllers/feedbackController.ts | Request handling, response |
| services/llm.service.ts | LLM classification logic |
| services/email.service.ts | Email sending |
| models/Feedback.ts | Data schema, validation |
| config/database.ts | DB connection |
| config/env.ts | Configuration management |

## 🚀 Deployment Architecture

```
Local Development
├─ Frontend: localhost:5173 (Vite)
├─ Backend: localhost:5000 (Express)
└─ Database: MongoDB Atlas (Cloud)

Production
├─ Frontend: Vercel/Netlify
├─ Backend: Render/Railway
└─ Database: MongoDB Atlas (Cloud)
```

---

**For more details, see the specific README.md files in each folder.**
