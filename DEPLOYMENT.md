# Telugu Books Ecommerce - Deployment Guide 🚀

This guide provides step-by-step instructions for deploying the Telugu Books Ecommerce Platform to production servers.

## 📋 Pre-Deployment Checklist

### Server Requirements

- [ ] Ubuntu 20.04+ or CentOS 8+ server
- [ ] 2GB RAM minimum (4GB recommended)
- [ ] 20GB storage minimum
- [ ] Node.js 18+ installed
- [ ] MongoDB 5.0+ installed
- [ ] Domain name configured
- [ ] SSL certificate ready

### Required Accounts & Services

- [ ] Razorpay account (test & live keys)
- [ ] Google OAuth app configured
- [ ] ShipRocket account (optional)
- [ ] MongoDB Atlas (optional, for cloud database)
- [ ] Cloudflare/CloudFront (optional, for CDN)

### Environment Configuration

- [ ] Production environment variables configured
- [ ] Database connection tested
- [ ] Payment gateway keys verified
- [ ] Email service configured
- [ ] Domain DNS records configured

## 🚀 Quick Deployment (Recommended)

### Option 1: Automated Installation Script

```bash
# Download and run installation script
curl -fsSL https://raw.githubusercontent.com/your-username/telugu-books-ecommerce/main/install.sh | bash

# Follow the prompts for configuration
```

### Option 2: Docker Deployment

```bash
# Clone repository
git clone <your-repository-url>
cd telugu-books-ecommerce

# Copy and configure environment
cp .env.production .env
cp backend/.env.example backend/.env

# Edit environment files with your values
nano .env
nano backend/.env

# Deploy with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
```

## 🔧 Manual Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start services
sudo systemctl enable mongod
sudo systemctl start mongod
```

### 2. Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/telugu-books
sudo chown $USER:$USER /var/www/telugu-books

# Clone repository
git clone <your-repository-url> /var/www/telugu-books
cd /var/www/telugu-books

# Install dependencies
npm install
npm run install:backend

# Configure environment
cp .env.production .env
cp backend/.env.example backend/.env

# Edit configuration files
nano .env
nano backend/.env
```

### 3. Environment Configuration

#### Frontend (.env)

```env
VITE_API_URL=https://api.your-domain.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Backend (backend/.env)

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com

MONGODB_URI=mongodb://localhost:27017/telugu-books-prod
JWT_SECRET=your_super_secure_jwt_secret

RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Build and Start

```bash
# Build frontend
npm run build

# Start with PM2
pm2 start backend/ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
# Run the command output by PM2
```

### 5. Nginx Configuration (Optional)

```bash
# Install Nginx
sudo apt install -y nginx

# Copy configuration
sudo cp nginx.conf /etc/nginx/sites-available/telugu-books
sudo ln -s /etc/nginx/sites-available/telugu-books /etc/nginx/sites-enabled/

# Edit domain name in config
sudo nano /etc/nginx/sites-available/telugu-books

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## 🔍 Post-Deployment Verification

### 1. Health Checks

```bash
# Check application status
pm2 status

# Check logs
pm2 logs telugu-books-backend

# Test application endpoints
curl http://localhost:5000/health
curl https://your-domain.com/api/health
```

### 2. Database Verification

```bash
# Connect to MongoDB
mongo

# Check database
use telugu-books-prod
show collections
```

### 3. Services Check

```bash
# Check running services
sudo systemctl status mongod
sudo systemctl status nginx
sudo systemctl status telugu-books
```

## 🔧 Configuration Management

### Environment Variables Management

For sensitive configuration, use:

1. **Environment files** (development)
2. **PM2 ecosystem files** (production)
3. **Docker secrets** (containerized)
4. **Cloud provider secrets** (AWS/Azure/GCP)

### Key Security Configurations

```env
# Strong JWT secret (32+ characters)
JWT_SECRET=your_very_long_and_random_secret_key_here

# Secure cookie settings
COOKIE_SECURE=true
COOKIE_HTTPONLY=true
COOKIE_SAMESITE=strict

# CORS settings
CORS_ORIGIN=https://your-domain.com

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Monitoring & Maintenance

### 1. Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# Application logs
pm2 logs telugu-books-backend --lines 100

# System resources
htop
df -h
free -h
```

### 2. Database Backup

```bash
# Create backup script
cat > /usr/local/bin/backup-telugu-books.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/telugu-books"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# MongoDB backup
mongodump --db telugu-books-prod --out $BACKUP_DIR/mongo_$DATE

# Compress backup
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/mongo_$DATE
rm -rf $BACKUP_DIR/mongo_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-telugu-books.sh

# Schedule backup (daily at 2 AM)
echo "0 2 * * * /usr/local/bin/backup-telugu-books.sh" | crontab -
```

### 3. Log Rotation

```bash
# Configure logrotate
sudo cat > /etc/logrotate.d/telugu-books << 'EOF'
/var/www/telugu-books/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Application Won't Start

```bash
# Check logs
pm2 logs telugu-books-backend

# Check configuration
node -c backend/src/server.js

# Verify environment
echo $NODE_ENV
cat .env
```

#### 2. Database Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Test connection
mongo --eval "db.stats()"

# Check authentication
mongo mongodb://localhost:27017/telugu-books-prod --eval "db.stats()"
```

#### 3. Payment Integration Issues

```bash
# Verify Razorpay keys
curl -u "rzp_test_key:rzp_test_secret" https://api.razorpay.com/v1/payments

# Check webhook configuration
tail -f logs/webhook.log
```

#### 4. SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect your-domain.com:443
```

### Performance Optimization

#### 1. Enable Redis Caching (Optional)

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis in backend/.env
REDIS_URL=redis://localhost:6379
ENABLE_CACHE=true
```

#### 2. CDN Setup (Optional)

```bash
# Configure Cloudflare or AWS CloudFront
# Update image URLs to use CDN
CDN_URL=https://cdn.your-domain.com
```

## 📝 Maintenance Schedule

### Daily

- [ ] Check application status (`pm2 status`)
- [ ] Monitor error logs (`pm2 logs --err`)
- [ ] Verify backup completion

### Weekly

- [ ] Update system packages (`sudo apt update && sudo apt upgrade`)
- [ ] Check disk space (`df -h`)
- [ ] Review access logs
- [ ] Test payment integration

### Monthly

- [ ] Update Node.js dependencies (`npm audit fix`)
- [ ] Review security logs
- [ ] Performance optimization
- [ ] SSL certificate renewal check

## 🔄 Updates & Rollbacks

### Application Updates

```bash
# Backup current version
cp -r /var/www/telugu-books /var/www/telugu-books-backup-$(date +%Y%m%d)

# Pull latest changes
cd /var/www/telugu-books
git pull origin main

# Install dependencies
npm install
npm run install:backend

# Build application
npm run build

# Restart with zero downtime
pm2 reload ecosystem.config.js --env production
```

### Rollback Procedure

```bash
# Stop application
pm2 stop telugu-books-backend

# Restore backup
rm -rf /var/www/telugu-books
mv /var/www/telugu-books-backup-YYYYMMDD /var/www/telugu-books

# Restart application
cd /var/www/telugu-books
pm2 start backend/ecosystem.config.js --env production
```

---

## 📞 Support

For deployment support:

- 📧 Email: support@telugubooks.com
- 📱 Phone: +91 90000 00000
- 💬 Discord: [Join our server](https://discord.gg/telugubooks)

**Happy Deploying! 🚀**
