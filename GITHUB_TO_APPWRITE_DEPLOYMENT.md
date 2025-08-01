# Complete GitHub to Appwrite Deployment Guide

This guide provides step-by-step instructions to deploy your Ataka bookstore from GitHub to Appwrite Cloud.

## 🚀 Prerequisites

1. **GitHub Account**: Your project repository
2. **Appwrite Cloud Account**: Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
3. **Appwrite CLI**: Install globally: `npm install -g appwrite-cli`

## 📋 Step 1: Prepare Your Repository

### 1.1 Ensure all files are committed

```bash
git add .
git commit -m "Production ready: Complete bookstore implementation"
git push origin main
```

### 1.2 Create environment configuration

Create `frontend/.env` based on `.env.example`:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here
VITE_RAZORPAY_KEY_ID=your-razorpay-key-here
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
NODE_ENV=production
```

## 🏗️ Step 2: Setup Appwrite Project

### 2.1 Create Appwrite Project

1. Login to [Appwrite Cloud](https://cloud.appwrite.io)
2. Click "Create Project"
3. Name: `ataka-bookstore`
4. Project ID: `ataka-bookstore` (or your preferred ID)

### 2.2 Configure Authentication

1. Go to **Auth** → **Settings**
2. Enable:
   - **Email/Password** authentication
   - **Google OAuth** (add your Google Client ID/Secret)
3. Add success/failure URLs:
   - Success URL: `https://your-domain.com/auth/success`
   - Failure URL: `https://your-domain.com/auth/failure`

### 2.3 Setup Database

1. Go to **Databases**
2. Click "Create Database"
3. Database ID: `ataka_db`
4. Name: `Ataka Database`

The collections will be created automatically via CLI deployment.

### 2.4 Configure Storage

1. Go to **Storage**
2. Create buckets:
   - `book-images` (for book cover images)
   - `user-avatars` (for user profile pictures)
   - `documents` (for admin documents)

### 2.5 Setup Environment Variables

1. Go to **Functions** (we'll set these during function deployment)
2. Add the following variables when deploying functions:
   ```
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   SHIPROCKET_EMAIL=your_shiprocket_email
   SHIPROCKET_PASSWORD=your_shiprocket_password
   ```

## 🖥️ Step 3: Deploy via Appwrite CLI

### 3.1 Initialize Appwrite CLI

```bash
# Login to Appwrite
appwrite login

# Initialize project (from project root)
appwrite init project
```

When prompted:

- Project ID: `ataka-bookstore` (or your chosen ID)
- Use existing project: **Yes**

### 3.2 Deploy Database Structure

```bash
# Deploy database collections
appwrite deploy collection
```

This will create all collections defined in `appwrite.json`:

- `users` - User profiles and authentication data
- `books` - Book catalog with full Telugu support
- `orders` - Order management and tracking
- `settings` - Application configuration
- `homepage` - Dynamic homepage content

### 3.3 Deploy Functions

```bash
# Deploy all functions
appwrite deploy function

# Or deploy individual functions
appwrite deploy function books-api
appwrite deploy function orders-api
appwrite deploy function payment-razorpay
appwrite deploy function import-woocommerce
```

Functions included:

- **books-api**: Book CRUD operations, search, categories
- **orders-api**: Order management and processing
- **payment-razorpay**: Payment processing with Razorpay
- **import-woocommerce**: Import from existing WooCommerce stores

### 3.4 Deploy Storage Buckets

```bash
# Deploy storage buckets
appwrite deploy bucket
```

### 3.5 Build and Deploy Frontend

```bash
# Build the frontend
cd frontend
npm ci
npm run build

# Deploy the built frontend
cd ..
appwrite deploy hosting
```

## 🔧 Step 4: Configure Integration Services

### 4.1 Razorpay Setup

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Account & Settings** → **API Keys**
3. Generate/Copy:
   - Key ID (starts with `rzp_test_` or `rzp_live_`)
   - Key Secret
4. Add these to your Appwrite function environment variables

### 4.2 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/Select project
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Authorized JavaScript origins: `https://your-domain.com`
7. Authorized redirect URIs: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`

### 4.3 Shiprocket Setup (Optional)

1. Login to [Shiprocket](https://shiprocket.in)
2. Go to **API** section
3. Generate API credentials
4. Add to function environment variables

## 🌐 Step 5: Custom Domain Setup

### 5.1 Add Custom Domain in Appwrite

1. Go to **Hosting** → **Settings**
2. Click "Add Domain"
3. Enter your domain: `yourdomain.com`
4. Appwrite will provide DNS records

### 5.2 Configure DNS

Add the provided CNAME record to your domain's DNS:

```
Type: CNAME
Name: @ (or www)
Value: [provided by Appwrite]
```

### 5.3 Enable SSL

1. Wait for DNS propagation (5-30 minutes)
2. Appwrite automatically provisions SSL certificates
3. Force HTTPS redirect: **Enable**

## 🧪 Step 6: Testing & Verification

### 6.1 Frontend Testing

- [ ] Homepage loads correctly
- [ ] Book browsing and search works
- [ ] User registration/login functional
- [ ] Cart and wishlist operations
- [ ] Checkout process complete

### 6.2 Backend Testing

- [ ] API functions respond correctly
- [ ] Database operations work
- [ ] File uploads successful
- [ ] Authentication flows complete

### 6.3 Integration Testing

- [ ] Razorpay test payments work
- [ ] Google OAuth login functional
- [ ] Email notifications sent
- [ ] Order tracking works

## 📊 Step 7: Production Configuration

### 7.1 Performance Optimization

```bash
# Enable Appwrite CDN
# Go to Storage → Settings → Enable CDN

# Configure caching headers
# Functions → Settings → Add headers
```

### 7.2 Security Configuration

1. **CORS Settings**: Add your domain to allowed origins
2. **Rate Limiting**: Configure in Functions → Settings
3. **API Keys**: Rotate and secure all API keys
4. **Permissions**: Review all collection/bucket permissions

### 7.3 Monitoring Setup

1. **Appwrite Console**: Monitor usage and errors
2. **Function Logs**: Review function execution logs
3. **Database Metrics**: Track database performance
4. **Storage Usage**: Monitor file storage usage

## 🚨 Step 8: Troubleshooting

### Common Issues:

**Build Fails**

```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules
cd frontend && npm ci
npm run build
```

**Function Deployment Fails**

```bash
# Check function dependencies
cd appwrite-functions/function-name
npm ci
cd ../..
appwrite deploy function function-name
```

**Domain Not Working**

- Verify DNS propagation: `nslookup yourdomain.com`
- Check SSL certificate status in Appwrite Console
- Ensure CNAME record points to Appwrite endpoint

**Database Connection Issues**

- Verify database ID matches in all configurations
- Check collection permissions
- Ensure API keys have correct scopes

## 🎯 Step 9: Go Live Checklist

### Pre-Launch

- [ ] All environment variables configured
- [ ] Payment gateway in live mode
- [ ] Google OAuth verified domain
- [ ] SSL certificate active
- [ ] All functions deployed and tested
- [ ] Database properly seeded
- [ ] Email templates configured
- [ ] Legal pages updated (Privacy, Terms)

### Launch

- [ ] DNS updated to point to Appwrite
- [ ] Social media announcements
- [ ] Monitoring and alerting active
- [ ] Customer support ready
- [ ] Backup strategy implemented

### Post-Launch

- [ ] Monitor error logs
- [ ] Track user adoption
- [ ] Collect user feedback
- [ ] Plan feature updates
- [ ] Regular security audits

## 📞 Support Resources

- **Appwrite Docs**: [appwrite.io/docs](https://appwrite.io/docs)
- **Community Discord**: [discord.gg/appwrite](https://discord.gg/appwrite)
- **GitHub Issues**: [github.com/appwrite/appwrite](https://github.com/appwrite/appwrite)
- **Stack Overflow**: Tag `appwrite`

## 🎉 Congratulations!

Your Telugu bookstore is now live on Appwrite! Users can browse books, make purchases, and enjoy a complete e-commerce experience.

### Next Steps:

1. **Add Content**: Upload your book catalog
2. **Test Thoroughly**: Complete end-to-end testing
3. **Marketing**: Start promoting your store
4. **Analytics**: Track user behavior and sales
5. **Iterate**: Based on user feedback and analytics

Your modern, scalable Telugu bookstore is ready for customers! 🚀📚
