#!/bin/bash

echo "🚀 Deploying Migrated Stack - Kotlin Backend + Nuxt Frontend"
echo "============================================================"

# Start Kotlin Spring Boot backend on port 8080
echo "📦 Starting Kotlin Backend (Spring Boot)..."
cd backend
nohup ./gradlew bootRun > backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Kotlin backend started (PID: $BACKEND_PID) on port 8080"

# Wait for backend to initialize
echo "⏳ Waiting for backend to initialize..."
sleep 10

# Start Nuxt 3 frontend on port 3000
echo "🎨 Starting Nuxt 3 Frontend..."
cd ../frontend
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Nuxt frontend started (PID: $FRONTEND_PID) on port 3000"

echo ""
echo "🎉 Migration Deployment Complete!"
echo "=================================="
echo "📋 Backend (Kotlin + Spring Boot): http://localhost:8080"
echo "🎨 Frontend (Nuxt 3 + Vue 3):      http://localhost:3000" 
echo "🗄️ Database: PostgreSQL (preserved)"
echo ""
echo "🔍 Check logs:"
echo "   Backend:  tail -f backend/backend.log"
echo "   Frontend: tail -f frontend/frontend.log"
echo ""
echo "🛑 To stop: kill $BACKEND_PID $FRONTEND_PID"