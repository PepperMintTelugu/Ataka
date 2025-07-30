#!/bin/bash

echo "🚀 Setting up Telugu Books Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ and try again.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm run install:all

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Setup environment files
echo -e "${BLUE}⚙️  Setting up environment files...${NC}"

# Frontend environment
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${YELLOW}📝 Created frontend/.env from example${NC}"
    echo -e "${YELLOW}   Please update frontend/.env with your configuration${NC}"
fi

# Backend environment
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}📝 Created backend/.env from example${NC}"
    echo -e "${YELLOW}   Please update backend/.env with your MongoDB URI and other settings${NC}"
fi

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. ${YELLOW}Configure your environment files:${NC}"
echo -e "   - frontend/.env (API endpoints)"
echo -e "   - backend/.env (MongoDB URI, JWT secrets, etc.)"
echo ""
echo -e "2. ${YELLOW}Start MongoDB:${NC}"
echo -e "   - Local: brew services start mongodb/brew/mongodb-community"
echo -e "   - Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
echo -e "   - Or use MongoDB Atlas (cloud)"
echo ""
echo -e "3. ${YELLOW}Start the development servers:${NC}"
echo -e "   npm run dev"
echo ""
echo -e "4. ${YELLOW}Access the application:${NC}"
echo -e "   - Frontend: http://localhost:3000"
echo -e "   - Backend: http://localhost:5000"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
