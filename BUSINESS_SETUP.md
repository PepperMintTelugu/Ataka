# Telugu Books Business - Complete Setup Guide

## 🏪 Business Platform Overview

This is your complete Telugu Books ecommerce platform with:

- ✅ Frontend: React app for customers
- ✅ Backend: Node.js API for business operations
- ✅ Database: MongoDB Atlas (configured with your credentials)
- ✅ Payment: Razorpay integration ready
- ✅ Shipping: ShipRocket integration ready

## 🚀 Quick Start Your Business

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Your Database is Already Configured

- **MongoDB Atlas**: Connected to your cluster
- **Connection**: `cluster0.xwg7aps.mongodb.net`
- **Database**: `telugu-books`
- **Status**: ✅ Ready for production

### 3. Start Your Platform

```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run dev:frontend  # Customer website
npm run dev:backend   # Business API
```

### 4. Access Your Business Platform

- **Customer Website**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## 💳 Payment Integration (Next Step)

### Razorpay Setup (Required for taking payments)

1. Sign up at: https://razorpay.com
2. Get your Key ID and Secret
3. Update in `backend/.env`:

```bash
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```

4. Update in `frontend/.env`:

```bash
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
```

## 📦 Shipping Integration (Next Step)

### ShipRocket Setup (Required for shipping books)

1. Sign up at: https://shiprocket.in
2. Get your credentials
3. Update in `backend/.env`:

```bash
SHIPROCKET_EMAIL=your-business-email@gmail.com
SHIPROCKET_PASSWORD=your-shiprocket-password
```

## 📧 Email Notifications (Recommended)

### Gmail SMTP Setup

1. Enable 2-factor authentication in Gmail
2. Generate App Password
3. Update in `backend/.env`:

```bash
EMAIL_USER=your-business-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## 🔐 Security Configuration

Your platform includes:

- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ XSS protection
- ✅ Helmet security headers

## 📊 Business Features Included

### Customer Features

- ✅ Browse Telugu books by category
- ✅ Search and filter books
- ✅ Book details with reviews
- ✅ Shopping cart
- ✅ Wishlist
- ✅ User accounts
- ✅ Order tracking
- ✅ Mobile responsive design

### Business Management

- ✅ Book inventory management
- ✅ Order management
- ✅ Customer management
- ✅ Sales analytics
- ✅ Shipping integration
- ✅ Payment processing

## 🌐 Production Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

```bash
# Frontend to Vercel
cd frontend && npm run build
# Deploy dist folder to Vercel

# Backend to Railway
# Connect GitHub repository to Railway
```

### Option 2: Full VPS (Recommended for business)

```bash
# Ubuntu/CentOS server setup
git clone your-repo
npm run install:all
npm run build
pm2 start ecosystem.config.js
```

## 📈 Business Analytics

### Google Analytics Setup (Optional)

1. Create GA4 property
2. Get tracking ID
3. Update in `frontend/.env`:

```bash
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npm run test:db
```

### Port Conflicts

```bash
# Kill existing processes
killall node
```

### Dependencies Issues

```bash
# Clean install
npm run clean
npm run install:all
```

## 📞 Business Support

### Your Configuration

- **Database**: MongoDB Atlas (✅ Connected)
- **Admin Email**: peppermint@telugubooks.org
- **Environment**: Development → Production ready

### Next Business Steps

1. ✅ Platform is ready
2. 🔄 Configure payment gateway
3. 🔄 Configure shipping provider
4. 🔄 Add your book inventory
5. 🔄 Deploy to production
6. 🚀 Launch your business!

---

**Your Telugu Books business platform is ready to serve customers!**
The database is connected and the platform is fully functional.
