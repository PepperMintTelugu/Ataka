# Ataka Bookstore - Production Deployment Guide

## 🎯 Quick Start Commands

### 1. Database Setup (MongoDB Atlas)
```bash
# Set your MongoDB URI in backend/.env
MONGODB_URI=mongodb+srv://ataka-admin:password@ataka-bookstore.xxxxx.mongodb.net/ataka-bookstore

# Run migration script
cd backend
npm install
node scripts/migrate-data.js
```

### 2. Backend Deployment (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up

# Your backend will be available at: https://your-app.railway.app
```

### 3. Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Your frontend will be available at: https://your-app.vercel.app
```

## 🔧 Environment Variables Setup

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ataka-bookstore
JWT_SECRET=your-32-character-secret
FRONTEND_URL=https://your-vercel-app.vercel.app
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-railway-app.railway.app
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
NODE_ENV=production
```

## 🗄️ Database Migration

Your app currently uses mock data. The migration script will:

1. **Connect to MongoDB Atlas**
2. **Create collections**: books, categories, authors, publishers, users, orders
3. **Import mock data** from your frontend
4. **Set up indexes** for performance

### Run Migration
```bash
cd backend
MONGODB_URI="your-connection-string" node scripts/migrate-data.js
```

## 🔐 Required Services Setup

### 1. MongoDB Atlas
- ✅ Free tier available
- Create cluster → Get connection string
- Whitelist Railway IP: 0.0.0.0/0

### 2. Razorpay (Payment Gateway)
- Create account at razorpay.com
- Get live API keys
- Configure webhook: `https://your-railway-app.railway.app/api/payments/webhook`

### 3. Google OAuth
- Google Cloud Console → APIs & Services → Credentials
- Create OAuth 2.0 Client ID
- Authorized redirect URIs: `https://your-vercel-app.vercel.app/auth/google/callback`

### 4. Cloudinary (Image Storage) - Optional
- Free tier: 25GB storage
- Get cloud name, API key, secret

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] MongoDB Atlas cluster created
- [ ] Database user with read/write access
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained

### Backend (Railway)
- [ ] Environment variables configured
- [ ] Database migration completed
- [ ] API endpoints responding
- [ ] CORS configured for frontend domain

### Frontend (Vercel)
- [ ] Environment variables set
- [ ] API base URL pointing to Railway
- [ ] Build completing successfully
- [ ] Static assets loading

### Testing
- [ ] Frontend loads correctly
- [ ] API connectivity working
- [ ] Book catalog displays
- [ ] Search functionality working
- [ ] Admin panel accessible

## 🧪 Testing Your Deployment

### 1. Test API Endpoints
```bash
# Health check
curl https://your-railway-app.railway.app/health

# Books API
curl https://your-railway-app.railway.app/api/books

# Categories API
curl https://your-railway-app.railway.app/api/categories
```

### 2. Test Frontend
1. Visit `https://your-vercel-app.vercel.app`
2. Check browser console for errors
3. Test book search and filtering
4. Verify admin panel access

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Failed**
- Check MongoDB URI format
- Verify database user credentials
- Ensure IP whitelist includes 0.0.0.0/0

**2. CORS Errors**
- Update `FRONTEND_URL` in backend environment
- Add Vercel domain to `ALLOWED_ORIGINS`

**3. API Not Responding**
- Check Railway deployment logs
- Verify environment variables set
- Ensure PORT is set to 5000

**4. Frontend Build Fails**
- Check environment variables in Vercel
- Verify `VITE_API_BASE_URL` format
- Review build logs for specific errors

## 💰 Cost Breakdown

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Railway**: $5/month for hobby plan (or free trial)
- **MongoDB Atlas**: 512MB storage (M0 free tier)

### Recommended Upgrades
- **Railway**: Hobby plan ($5/month) for production
- **MongoDB**: M2 cluster ($9/month) for better performance
- **Cloudinary**: Pro plan ($99/month) for higher limits

## 📞 Support

If you encounter issues:

1. **Check deployment logs**:
   - Railway: Dashboard → Deployments → View logs
   - Vercel: Dashboard → Functions → View logs

2. **Verify environment variables**:
   - Both platforms: Settings → Environment Variables

3. **Test API manually**:
   - Use curl or Postman to test endpoints

4. **Database connectivity**:
   - MongoDB Atlas: Network access and database user settings

Your Ataka bookstore will be live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app
- **Admin**: https://your-app.vercel.app/admin

🎉 **Happy deploying!**
