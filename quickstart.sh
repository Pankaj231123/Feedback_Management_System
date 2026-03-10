#!/bin/bash

# Quick start script for AI Feedback Management System

echo "🚀 AI Feedback Management System - Quick Start"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example"
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your credentials:"
    echo "   - MONGODB_URI"
    echo "   - GOOGLE_API_KEY"
    echo "   - FRONTEND_URL"
fi

npm install
echo "✅ Backend dependencies installed"
echo ""

# Frontend setup
cd ../frontend
echo "📦 Setting up Frontend..."
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Return to root
cd ..

echo "================================================"
echo "✅ Setup Complete!"
echo ""
echo "📌 Next Steps:"
echo ""
echo "1. Update credentials in backend/.env:"
echo "   - MONGODB_URI from MongoDB Atlas"
echo "   - GOOGLE_API_KEY from Google AI Studio"
echo ""
echo "2. Start Backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start Frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open browser:"
echo "   Frontend: http://localhost:5173"
echo "   API: http://localhost:5000/api/feedback"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: SETUP.md"
echo "   - Architecture: ARCHITECTURE.md"
echo "   - Deployment: DEPLOYMENT.md"
echo "   - Checklist: CHECKLIST.md"
echo ""
