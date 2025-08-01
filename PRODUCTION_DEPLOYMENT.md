# Production Deployment Guide for Ataka Bookstore

## Overview
This guide covers deploying the Ataka Telugu Bookstore to production with proper API connectivity.

## Architecture
- **Frontend**: React app deployed to Vercel/Netlify
- **Backend**: Node.js API server deployed to Railway/Heroku/DigitalOcean
- **Database**: MongoDB Atlas or self-hosted MongoDB

## Environment Setup

### 1. Backend Deployment

#### Environment Variables (Backend)
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ataka-bookstore

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxx

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Deploy Backend
1. **Railway** (Recommended):
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway link
   railway up
   ```

2. **Heroku**:
   ```bash
   # Install Heroku CLI and login
   heroku create ataka-backend
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set NODE_ENV=production
   # ... set other environment variables
   git push heroku main
   ```

### 2. Frontend Deployment

#### Environment Variables (Frontend)
Create `.env.production` in `frontend/` directory:
```bash
# Backend API
VITE_API_BASE_URL=https://your-backend-domain.com

# Payment Gateway (Live)
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
REACT_APP_RAZORPAY_KEY_SECRET=xxxxxxxxxx

# Shipping
REACT_APP_SHIPROCKET_API_URL=https://apiv2.shiprocket.in/v1/external
REACT_APP_SHIPROCKET_EMAIL=admin@ataka.com
REACT_APP_SHIPROCKET_PASSWORD=production-password
REACT_APP_SHIPROCKET_TOKEN=production-token

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback

NODE_ENV=production
```

#### Deploy Frontend to Vercel
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel Dashboard**:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.production`

#### Deploy Frontend to Netlify
1. **Build the project**:
   ```bash
   cd frontend
   npm run build:prod
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## Database Setup

### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create new cluster
3. Create database user
4. Whitelist your backend server IP
5. Get connection string

### Local MongoDB (Development)
```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/ataka-bookstore
```

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000` (development)
- `http://localhost:8080` (development)
- Your production domain (set via `FRONTEND_URL`)

Update `backend/src/server.js` line 95 with your production domain:
```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  process.env.FRONTEND_URL,
  "https://your-domain.vercel.app", // Add your actual domain
  "https://your-domain.com"
];
```

## Testing Production Setup

### 1. Test API Connectivity
```bash
# Health check
curl https://your-backend-domain.com/health

# Test CORS
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-backend-domain.com/api/books
```

### 2. Test Frontend
1. Visit your frontend URL
2. Check browser console for errors
3. Test admin functions (add/edit/delete books)
4. Verify API calls in Network tab

## Common Issues

### 1. CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Add your domain to `allowedOrigins` array
- Check browser console for specific CORS errors

### 2. API Connection Failed
- Verify backend is running and accessible
- Check `VITE_API_BASE_URL` in frontend environment
- Ensure database connection is working

### 3. Environment Variables Not Loading
- Verify variable names (use `VITE_` prefix for frontend)
- Check deployment platform environment settings
- Ensure `.env.production` is not gitignored

### 4. Database Connection Issues
- Verify MongoDB URI format
- Check database user permissions
- Ensure IP whitelist includes your server

## Production Checklist

### Backend
- [ ] Environment variables configured
- [ ] Database connected and accessible
- [ ] CORS configured for production domain
- [ ] Error handling and logging implemented
- [ ] Rate limiting enabled
- [ ] Security headers configured

### Frontend
- [ ] Production build created (`npm run build:prod`)
- [ ] Environment variables set
- [ ] API base URL pointing to production backend
- [ ] Payment gateway configured for live mode
- [ ] Google OAuth redirect URLs updated
- [ ] Error boundaries implemented

### Security
- [ ] HTTPS enabled on both frontend and backend
- [ ] JWT secrets are strong and unique
- [ ] Database credentials secured
- [ ] API keys and secrets not exposed
- [ ] CORS properly configured
- [ ] Rate limiting enabled

## Monitoring

### Backend Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Database connection monitoring
- Server resource usage

### Frontend Monitoring
- Error tracking for client-side issues
- Performance monitoring
- User analytics

## Scaling Considerations

### Backend
- Use horizontal scaling with load balancer
- Implement caching (Redis)
- Database read replicas
- CDN for static assets

### Frontend
- Use CDN (Vercel/Netlify handle this)
- Image optimization
- Code splitting
- Progressive loading

## Support

If you encounter issues:
1. Check the logs for specific error messages
2. Verify environment variables are set correctly
3. Test API endpoints manually
4. Check database connectivity
5. Review CORS configuration

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
