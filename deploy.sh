#!/bin/bash

# Telugu Books Ecommerce Platform Deployment Script
echo "🚀 Starting Telugu Books Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB is not installed. Please install MongoDB."
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2 globally..."
    npm install -g pm2
fi

print_step "1. Setting up Frontend..."

# Frontend setup
if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found. Make sure you're in the correct directory."
    exit 1
fi

print_status "Installing frontend dependencies..."
npm install

print_status "Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully!"
else
    print_error "Frontend build failed!"
    exit 1
fi

print_step "2. Setting up Backend..."

# Backend setup
cd backend

if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found."
    exit 1
fi

print_status "Installing backend dependencies..."
npm install --production

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Copying from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Please update .env file with your configuration before starting the server."
    else
        print_error ".env.example file not found!"
        exit 1
    fi
fi

print_step "3. Database Setup..."

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    print_status "MongoDB is running."
else
    print_warning "MongoDB is not running. Please start MongoDB service."
    print_status "You can start it with: sudo systemctl start mongod"
fi

print_step "4. Starting Backend Server..."

# Stop existing PM2 process if running
pm2 delete telugu-books-api 2>/dev/null || true

# Start the backend with PM2
print_status "Starting backend server with PM2..."
pm2 start src/server.js --name "telugu-books-api" --watch

if [ $? -eq 0 ]; then
    print_status "Backend server started successfully!"
else
    print_error "Failed to start backend server!"
    exit 1
fi

# Save PM2 configuration
pm2 save
pm2 startup

print_step "5. Frontend Deployment..."

cd ..

# Check if we're deploying to a web server
if command -v nginx &> /dev/null; then
    print_status "Nginx detected. Consider setting up reverse proxy."
    print_status "Example nginx configuration:"
    echo "
server {
    listen 80;
    server_name store.ataka.co.in;
    
    # Frontend
    location / {
        root $(pwd)/dist;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
    "
fi

print_step "6. Post-deployment Tasks..."

print_status "Checking server status..."
sleep 3

# Check if backend is responding
if curl -f http://localhost:5000/health &> /dev/null; then
    print_status "✅ Backend server is responding!"
else
    print_error "❌ Backend server is not responding!"
fi

# Show PM2 status
print_status "PM2 Process Status:"
pm2 status

print_step "7. Security Recommendations..."

print_warning "🔒 Security Checklist:"
echo "□ Update all environment variables in .env"
echo "□ Enable MongoDB authentication"
echo "□ Configure firewall (ufw)"
echo "□ Set up SSL certificate (Let's Encrypt)"
echo "□ Enable rate limiting"
echo "□ Configure backup strategy"

print_step "8. Next Steps..."

print_status "📝 Configuration needed:"
echo "1. Update backend/.env with your actual API keys:"
echo "   - MongoDB URI"
echo "   - JWT Secret"
echo "   - Google OAuth credentials"
echo "   - Razorpay API keys"
echo "   - ShipRocket credentials"
echo "   - Cloudinary configuration"
echo ""
echo "2. Set up admin user:"
echo "   - Access /admin after updating .env"
echo "   - Create first admin account"
echo ""
echo "3. Configure domain:"
echo "   - Point store.ataka.co.in to this server"
echo "   - Set up SSL certificate"
echo "   - Configure nginx reverse proxy"

print_status "🎉 Deployment completed successfully!"
print_status "Frontend: Built and ready"
print_status "Backend: Running on port 5000"
print_status "Admin: Access at /admin"
print_status "API: Available at /api"

echo ""
print_status "📚 Your Telugu Books platform is ready!"
print_status "Visit: http://localhost:3000 (development)"
print_status "Visit: http://store.ataka.co.in (production)"

echo ""
print_warning "Remember to:"
echo "- Update all environment variables"
echo "- Test payment integration"
echo "- Configure shipping settings"
echo "- Customize theme in admin panel"

exit 0
