#!/bin/bash

# Telugu Books Ecommerce Platform - Quick Installation Script
# This script sets up the complete platform on Ubuntu/Debian servers

set -e

echo "🚀 Installing Telugu Books Ecommerce Platform..."
echo "=================================================="

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if [ -f /etc/debian_version ]; then
        OS="debian"
        print_status "Detected Debian/Ubuntu system"
    elif [ -f /etc/redhat-release ]; then
        OS="redhat"
        print_status "Detected RedHat/CentOS system"
    else
        print_error "Unsupported Linux distribution"
        exit 1
    fi
else
    print_error "This script only supports Linux systems"
    exit 1
fi

# Update system packages
print_header "📦 Updating system packages..."
if [ "$OS" = "debian" ]; then
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y curl wget git build-essential
elif [ "$OS" = "redhat" ]; then
    sudo yum update -y
    sudo yum install -y curl wget git gcc gcc-c++ make
fi

# Install Node.js 18.x
print_header "📦 Installing Node.js 18.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    if [ "$OS" = "debian" ]; then
        sudo apt-get install -y nodejs
    elif [ "$OS" = "redhat" ]; then
        sudo yum install -y nodejs npm
    fi
else
    print_status "Node.js is already installed ($(node --version))"
fi

# Verify Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

# Install PM2 globally
print_header "📦 Installing PM2 Process Manager..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    print_status "PM2 installed successfully"
else
    print_status "PM2 is already installed"
fi

# Install MongoDB
print_header "📦 Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    if [ "$OS" = "debian" ]; then
        wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
        sudo apt-get update
        sudo apt-get install -y mongodb-org
    elif [ "$OS" = "redhat" ]; then
        sudo tee /etc/yum.repos.d/mongodb-org-5.0.repo > /dev/null <<EOF
[mongodb-org-5.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/5.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-5.0.asc
EOF
        sudo yum install -y mongodb-org
    fi
    
    sudo systemctl enable mongod
    sudo systemctl start mongod
    print_status "MongoDB installed and started"
else
    print_status "MongoDB is already installed"
fi

# Install Nginx (optional)
print_header "📦 Installing Nginx (optional reverse proxy)..."
read -p "Do you want to install Nginx as a reverse proxy? (y/N): " install_nginx
if [[ $install_nginx =~ ^[Yy]$ ]]; then
    if [ "$OS" = "debian" ]; then
        sudo apt install -y nginx
    elif [ "$OS" = "redhat" ]; then
        sudo yum install -y nginx
    fi
    sudo systemctl enable nginx
    sudo systemctl start nginx
    print_status "Nginx installed and started"
fi

# Create application directory
print_header "📁 Setting up application directory..."
APP_DIR="/var/www/telugu-books"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clone repository (if not already present)
if [ ! -d "$APP_DIR/.git" ]; then
    print_header "📥 Cloning repository..."
    read -p "Enter your repository URL: " REPO_URL
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
else
    print_status "Repository already exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
fi

# Install dependencies
print_header "📦 Installing application dependencies..."
npm install
npm run install:backend

# Create environment files
print_header "⚙️ Setting up environment configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_warning "Please edit .env file with your configuration"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    print_warning "Please edit backend/.env file with your configuration"
fi

# Create uploads directory
mkdir -p backend/uploads
mkdir -p logs

# Set up PM2 startup
print_header "⚙️ Configuring PM2 startup..."
pm2 startup | tail -1 | sudo bash

# Build application
print_header "🔨 Building application..."
npm run build

# Configure firewall
print_header "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw allow 5000
    sudo ufw --force enable
    print_status "UFW firewall configured"
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-port=22/tcp
    sudo firewall-cmd --permanent --add-port=80/tcp
    sudo firewall-cmd --permanent --add-port=443/tcp
    sudo firewall-cmd --permanent --add-port=5000/tcp
    sudo firewall-cmd --reload
    print_status "Firewalld configured"
fi

# Create systemd service for auto-restart
print_header "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/telugu-books.service > /dev/null <<EOF
[Unit]
Description=Telugu Books Ecommerce Platform
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=$(which pm2) start backend/ecosystem.config.js --env production
ExecReload=$(which pm2) reload backend/ecosystem.config.js --env production
ExecStop=$(which pm2) delete all
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable telugu-books

print_header "✅ Installation completed successfully!"
echo "=================================================="
print_status "Application directory: $APP_DIR"
print_status "MongoDB is running on: mongodb://localhost:27017"
print_status "Application will run on: http://localhost:5000"
echo ""
print_warning "Next steps:"
echo "1. Edit .env and backend/.env files with your configuration"
echo "2. Start the application: pm2 start backend/ecosystem.config.js --env production"
echo "3. Save PM2 configuration: pm2 save"
echo "4. Check application status: pm2 status"
echo ""
print_status "For SSL setup, use: sudo certbot --nginx -d your-domain.com"
print_status "View logs: pm2 logs telugu-books-backend"
echo ""
echo "🎉 Happy selling Telugu books! 📚"
