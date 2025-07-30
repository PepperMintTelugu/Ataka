#!/bin/bash

# Telugu Books Ecommerce - Production Deployment Script for HostItBro
# Run this script on your HostItBro server

set -e

echo "🚀 Starting Telugu Books Ecommerce Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="your-domain.com"  # Replace with your actual domain
APP_DIR="/home/your-username/public_html"  # Replace with your actual path
BACKEND_PORT=5000
FRONTEND_PORT=3000

echo -e "${BLUE}📁 Setting up directory structure...${NC}"

# Create necessary directories
mkdir -p $APP_DIR/telugu-books
cd $APP_DIR/telugu-books

# Create uploads directory for images
mkdir -p uploads/books
mkdir -p uploads/brands
chmod 755 uploads/books
chmod 755 uploads/brands

echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install Node.js dependencies (backend)
cd backend
npm install --production

# Install frontend dependencies and build
cd ..
npm install
npm run build

echo -e "${BLUE}⚙️ Setting up environment variables...${NC}"

# Create production environment file for backend
cat > backend/.env << EOL
# Production Environment Variables
NODE_ENV=production
PORT=$BACKEND_PORT

# Database
MONGODB_URI=mongodb://localhost:27017/telugu-books-prod

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# ShipRocket
SHIPROCKET_EMAIL=your-shiprocket-email
SHIPROCKET_PASSWORD=your-shiprocket-password

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
FRONTEND_URL=https://$DOMAIN
EOL

# Create production environment file for frontend
cat > .env.production << EOL
# Frontend Production Environment
VITE_API_BASE_URL=https://$DOMAIN/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
EOL

echo -e "${BLUE}🔧 Setting up PM2 configuration...${NC}"

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [
    {
      name: 'telugu-books-backend',
      script: 'backend/src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: $BACKEND_PORT
      },
      error_file: 'logs/backend-error.log',
      out_file: 'logs/backend-out.log',
      log_file: 'logs/backend-combined.log',
      time: true
    }
  ]
};
EOL

# Create logs directory
mkdir -p logs

echo -e "${BLUE}🌐 Setting up Nginx configuration...${NC}"

# Create Nginx configuration
cat > nginx-telugu-books.conf << EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL certificates (you'll need to set these up)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    # Root directory for frontend files
    root $APP_DIR/telugu-books/dist;
    index index.html;
    
    # Serve static frontend files
    location / {
        try_files \$uri \$uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API routes to backend
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Serve uploaded files
    location /uploads/ {
        root $APP_DIR/telugu-books;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security: deny access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log)$ {
        deny all;
    }
}
EOL

echo -e "${BLUE}📝 Creating startup script...${NC}"

# Create startup script
cat > start.sh << EOL
#!/bin/bash

# Start Telugu Books Ecommerce Platform

echo "🚀 Starting Telugu Books Platform..."

# Start backend with PM2
pm2 start ecosystem.config.js

# Show status
pm2 status

echo "✅ Telugu Books Platform started successfully!"
echo "🌐 Frontend: https://$DOMAIN"
echo "🔧 API: https://$DOMAIN/api"
echo "📊 Admin: https://$DOMAIN/admin"

echo ""
echo "📋 Useful commands:"
echo "pm2 status          - Check app status"
echo "pm2 logs            - View logs"
echo "pm2 restart all     - Restart services"
echo "pm2 stop all        - Stop services"
EOL

chmod +x start.sh

echo -e "${BLUE}🛑 Creating stop script...${NC}"

# Create stop script
cat > stop.sh << EOL
#!/bin/bash

echo "🛑 Stopping Telugu Books Platform..."

pm2 stop all
pm2 delete all

echo "✅ All services stopped"
EOL

chmod +x stop.sh

echo -e "${BLUE}🔄 Creating update script...${NC}"

# Create update script
cat > update.sh << EOL
#!/bin/bash

echo "🔄 Updating Telugu Books Platform..."

# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend
npm install --production

# Rebuild frontend
cd ..
npm install
npm run build

# Restart services
pm2 restart all

echo "✅ Update completed!"
EOL

chmod +x update.sh

echo -e "${GREEN}✅ Deployment setup completed!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Update the domain and paths in this script"
echo "2. Set up SSL certificates"
echo "3. Configure MongoDB"
echo "4. Add the Nginx configuration to your server"
echo "5. Update environment variables with real values"
echo "6. Run: ./start.sh"
echo ""
echo -e "${BLUE}🔧 Configuration files created:${NC}"
echo "- ecosystem.config.js (PM2 config)"
echo "- nginx-telugu-books.conf (Nginx config)"
echo "- backend/.env (Backend environment)"
echo "- .env.production (Frontend environment)"
echo "- start.sh, stop.sh, update.sh (Management scripts)"
