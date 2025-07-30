# Telugu Books Ecommerce - HostItBro Deployment Guide

## 📋 Overview

This guide will help you deploy your Telugu Books ecommerce platform to HostItBro hosting.

## 🏗️ Project Structure

```
telugu-books/
├── src/                     # Frontend React components
├── backend/                 # Node.js backend API
├── dist/                    # Built frontend (after npm run build)
├── package.json             # Frontend dependencies
├── backend/package.json     # Backend dependencies
└── deploy-production.sh     # Deployment script
```

## 🚀 Deployment Steps

### Step 1: Prepare Your Local Environment

1. **Clone/Download your project to HostItBro server:**

```bash
cd /home/yourusername/public_html
git clone <your-repo-url> telugu-books
cd telugu-books
```

2. **Make deployment script executable:**

```bash
chmod +x deploy-production.sh
```

### Step 2: Install Node.js on HostItBro

If Node.js isn't installed, you may need to:

1. Contact HostItBro support to enable Node.js
2. Or use their Node.js hosting option
3. Ensure you have Node.js 18+ and npm

### Step 3: Configure Environment Variables

1. **Edit the deployment script:**

```bash
nano deploy-production.sh
```

2. **Update these values:**

```bash
DOMAIN="store.ataka.co.in"  # Your actual domain
APP_DIR="/home/yourusername/public_html"  # Your hosting path
```

3. **Set up your API keys in the script:**

- Google OAuth Client ID
- Razorpay Keys (Test/Live)
- MongoDB connection string
- Email SMTP settings

### Step 4: Set Up Database

**Option A: MongoDB Atlas (Recommended)**

1. Create account at mongodb.com
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in deployment script

**Option B: Local MongoDB (if HostItBro supports it)**

```bash
# Install MongoDB (if available)
sudo apt update
sudo apt install mongodb
```

### Step 5: Deploy the Application

```bash
./deploy-production.sh
```

### Step 6: Configure Web Server

**If using Apache (most HostItBro setups):**

Create `.htaccess` in your domain root:

```apache
# Telugu Books Ecommerce .htaccess

# Enable rewrite engine
RewriteEngine On

# API routes to backend
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# Frontend routes (React Router)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"

# Cache static files
<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</filesMatch>
```

**If using Nginx:**
Copy the generated `nginx-telugu-books.conf` to your Nginx sites directory.

### Step 7: Start the Application

```bash
# Install PM2 globally (if not installed)
npm install -g pm2

# Start the application
./start.sh
```

### Step 8: Set Up SSL Certificate

**Option A: Let's Encrypt (Free)**

```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot --apache -d store.ataka.co.in
```

**Option B: HostItBro SSL**
Use HostItBro's SSL certificate management in their control panel.

### Step 9: Configure Domain DNS

Point your domain to HostItBro:

1. Go to your domain registrar
2. Update nameservers to HostItBro's nameservers
3. Or create A record pointing to HostItBro IP

## 🔧 Configuration Files Explanation

### `ecosystem.config.js` - PM2 Configuration

Manages the Node.js backend process:

- Auto-restart on crashes
- Memory limits
- Logging
- Environment variables

### `backend/.env` - Backend Environment

Contains sensitive configuration:

- Database connections
- API keys
- JWT secrets
- Email settings

### `.env.production` - Frontend Environment

Contains public configuration:

- API URLs
- Public keys (Razorpay public key, Google Client ID)

## 📊 Monitoring and Management

### Check Application Status

```bash
pm2 status
pm2 logs
pm2 monit
```

### Update Application

```bash
./update.sh
```

### Stop Application

```bash
./stop.sh
```

### Restart Services

```bash
pm2 restart all
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts:**

   - Change BACKEND_PORT in deployment script
   - Update Nginx/Apache proxy configuration

2. **Database connection errors:**

   - Check MongoDB connection string
   - Ensure database server is running
   - Verify network access

3. **File permissions:**

   ```bash
   chmod -R 755 telugu-books/
   chmod -R 777 telugu-books/uploads/
   ```

4. **Node.js module errors:**
   ```bash
   cd backend && npm install --production
   cd .. && npm install && npm run build
   ```

### Log Files

```bash
# Backend logs
tail -f logs/backend-combined.log

# Nginx/Apache logs
tail -f /var/log/nginx/error.log
tail -f /var/log/apache2/error.log
```

## 🛠️ HostItBro Specific Tips

1. **File Manager:** Use HostItBro's file manager for easy file uploads
2. **Node.js:** Enable Node.js in HostItBro control panel
3. **Databases:** Use HostItBro's database manager for MySQL/MongoDB
4. **SSL:** Enable SSL through HostItBro control panel
5. **Subdomains:** Create subdomain for API if needed

## 📱 Testing Your Deployment

1. **Frontend:** Visit `https://store.ataka.co.in`
2. **API:** Test `https://store.ataka.co.in/api/books`
3. **Admin:** Access `https://store.ataka.co.in/admin`
4. **Mobile:** Test responsive design on mobile devices

## 🔐 Security Checklist

- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] File permissions set correctly
- [ ] Regular backups enabled
- [ ] Security headers configured
- [ ] API rate limiting enabled

## 📞 Support

If you encounter issues:

1. Check HostItBro documentation
2. Contact HostItBro support for server-specific issues
3. Check application logs for debugging
4. Ensure all environment variables are set correctly

## 🎉 Launch Checklist

- [ ] Domain pointing to HostItBro
- [ ] SSL certificate working
- [ ] Database connected
- [ ] API endpoints responding
- [ ] Frontend loading correctly
- [ ] Admin panel accessible
- [ ] Payment gateway configured
- [ ] Email notifications working
- [ ] File uploads working
- [ ] Mobile experience tested

Your Telugu Books ecommerce platform should now be live at `https://store.ataka.co.in`! 🚀
