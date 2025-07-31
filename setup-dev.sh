#!/bin/bash

echo "🚀 Setting up Ataka Bookstore for Development"

# Create environment files if they don't exist
echo "📝 Creating environment files..."

# Backend environment
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✅ Created backend/.env (please update with your values)"
else
  echo "⚠️  backend/.env already exists"
fi

# Frontend environment  
if [ ! -f frontend/.env.development ]; then
  echo "✅ frontend/.env.development already exists"
else
  echo "⚠️  frontend/.env.development already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Start development servers
echo "🚀 Starting development servers..."
echo "🎯 Frontend will be available at: http://localhost:8080"
echo "🎯 Backend will be available at: http://localhost:5000"
echo "🎯 Backend health check: http://localhost:5000/health"

npm run dev
