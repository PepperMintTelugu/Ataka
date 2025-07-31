# Production Deployment Checklist

## 🔧 Pre-Deployment Setup

### Frontend (Vercel)

- [x] Optimized Vite configuration with proper chunking
- [x] Added environment variables example
- [x] Updated vercel.json with security headers
- [x] Set proper build commands (`npm ci && npm run build:prod`)
- [x] Configured CORS headers for API communication

### Backend (Railway)

- [x] Updated railway.json with production settings
- [x] Configured health check endpoint
- [x] Set proper CORS origins including Vercel domains
- [x] Added security middleware (helmet, rate limiting)
- [x] Configured graceful shutdown handlers

## 📋 Environment Variables

### Frontend (Vercel Dashboard)

```bash
VITE_API_URL=https://your-backend.railway.app
VITE_APP_URL=https://your-frontend.vercel.app
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_APP_NAME=Ataka - The Ultimate Bookstore
VITE_ENVIRONMENT=production
```

### Backend (Railway Dashboard)

```bash
NODE_ENV=production
PORT=$PORT
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=https://your-frontend.vercel.app
SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🚀 Deployment Steps

### 1. Backend Deployment (Railway)

1. Connect Railway to your GitHub repository
2. Select the root directory (contains `backend/` folder)
3. Set environment variables in Railway dashboard
4. Deploy and verify health check: `https://your-backend.railway.app/health`

### 2. Frontend Deployment (Vercel)

1. Connect Vercel to your GitHub repository
2. Set build settings:
   - Build Command: `cd frontend && npm ci && npm run build:prod`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm ci`
3. Set environment variables in Vercel dashboard
4. Update `VITE_API_URL` to your Railway backend URL
5. Deploy and verify

### 3. Post-Deployment Verification

- [x] Frontend loads correctly
- [x] API endpoints respond (check Network tab)
- [x] CORS headers allow frontend-backend communication
- [x] Images and assets load properly
- [x] Responsive design works on mobile
- [x] Circular categories display correctly
- [x] Mobile sticky buttons function properly
- [x] Header slide animation works on scroll

## 🔍 Common Issues & Solutions

### CORS Errors

- Ensure backend CORS configuration includes your Vercel domain
- Check both production and preview URLs

### Environment Variables

- Prefix frontend variables with `VITE_`
- Verify all required variables are set

### Build Failures

- Use `npm ci` instead of `npm install` for reproducible builds
- Check for TypeScript errors: `npm run typecheck`
- Verify build locally: `npm run build:prod`

### API Connection Issues

- Verify backend health endpoint is accessible
- Check network requests in browser dev tools
- Ensure API URLs don't have trailing slashes

## 📊 Performance Optimizations Applied

- [x] Code splitting with manual chunks
- [x] Optimized bundle sizes
- [x] Circular categories with proper responsive design
- [x] Mobile-optimized sticky bottom navigation
- [x] Sliding header with smooth animations
- [x] Lazy loading for heavy components

## 🔐 Security Features

- [x] Helmet security headers
- [x] Rate limiting
- [x] CORS protection
- [x] XSS prevention
- [x] MongoDB sanitization
- [x] Secure content security policy
