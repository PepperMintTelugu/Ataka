# 📚 Ataka - The Ultimate Telugu Bookstore

A modern, full-featured e-commerce platform designed specifically for Telugu literature. Built with React, TypeScript, and powered by Appwrite for a scalable, production-ready experience.

## ✨ Features

### 🛍️ E-Commerce Functionality

- **Complete Shopping Experience**: Browse, search, filter, and purchase books
- **Smart Cart & Wishlist**: Persistent cart and wishlist with cross-device sync
- **Secure Payments**: Razorpay integration with multiple payment options
- **Order Tracking**: Complete order management and tracking system
- **User Accounts**: Registration, login with Google OAuth support

### 🏪 Telugu-Focused Design

- **Bilingual Support**: Full English and Telugu text support
- **Cultural Design**: Color scheme and design elements honoring Telugu heritage
- **Telugu Authors**: Dedicated sections for Telugu authors and publishers
- **Local Content**: Categories specifically for Telugu literature genres

### 🔧 Admin Features

- **Book Management**: Complete CRUD operations for books, authors, publishers
- **Order Management**: Process orders, update status, manage inventory
- **Analytics Dashboard**: Sales insights, user behavior, and performance metrics
- **Import Tools**: WooCommerce integration for easy data migration
- **Content Management**: Dynamic homepage and promotional content

### 🚀 Modern Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Appwrite (Database, Auth, Functions, Storage)
- **Payments**: Razorpay for secure payment processing
- **Authentication**: Email/password and Google OAuth
- **Notifications**: Smart cart abandonment and promotional notifications
- **Deployment**: Automated GitHub Actions to Appwrite Cloud

## 🏗️ Architecture

```
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components and routing
│   │   ├── contexts/        # React contexts (App, Auth, Notifications)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API clients
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Helper functions
│   └── ...
├── appwrite-functions/       # Serverless functions
│   ├── books-api/           # Book management API
│   ├── orders-api/          # Order processing API
│   ├── payment-razorpay/    # Payment processing
│   └── import-woocommerce/  # Data import functionality
├── .github/workflows/       # GitHub Actions for CI/CD
└── docs/                    # Documentation and guides
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Appwrite CLI (`npm install -g appwrite-cli`)
- Appwrite Cloud account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ataka-platform

# Install dependencies
npm run install:all

# Setup environment variables
cd frontend
cp .env.example .env
# Edit .env with your Appwrite and Razorpay credentials

# Start development server
npm run dev
```

### Development

```bash
# Frontend development
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📦 Deployment

### Option 1: Automated GitHub Deployment

1. Push code to GitHub
2. Set up repository secrets (see `.github/workflows/deploy-to-appwrite.yml`)
3. GitHub Actions will automatically deploy on push to main

### Option 2: Manual Deployment

```bash
# Make script executable (Linux/Mac)
chmod +x deploy.sh

# Run deployment
./deploy.sh --all
```

### Option 3: Step-by-Step Deployment

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Deploy database
appwrite deploy collection --all

# Deploy functions
appwrite deploy function --all

# Build and deploy frontend
cd frontend && npm run build
cd .. && appwrite deploy hosting
```

## 🔧 Configuration

### Environment Variables

Create `frontend/.env` with:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Appwrite Setup

1. Create project in Appwrite Cloud
2. Configure authentication providers (Email, Google)
3. Set up payment webhook URLs for Razorpay
4. Configure storage buckets for images

## 📚 Documentation

- [Deployment Guide](./GITHUB_TO_APPWRITE_DEPLOYMENT.md) - Complete deployment instructions
- [Production Checklist](./PRODUCTION_CHECKLIST.md) - Pre-launch checklist
- [Business Setup](./ATAKA_BUSINESS_LAUNCH.md) - Business preparation guide
- [API Documentation](./API_INTEGRATION_COMPLETE.md) - API reference

## 🛠️ Key Technologies

### Frontend

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Framer Motion**: Smooth animations

### Backend (Appwrite)

- **Database**: NoSQL document database
- **Authentication**: Multi-provider auth system
- **Functions**: Serverless function execution
- **Storage**: File upload and management
- **Realtime**: WebSocket connections for live updates

### Integrations

- **Razorpay**: Payment processing
- **Google OAuth**: Social authentication
- **Shiprocket**: Shipping and logistics (planned)
- **WooCommerce**: Data import functionality

## 🔒 Security Features

- **Authentication**: Secure user authentication with session management
- **Authorization**: Role-based access control (user/admin)
- **Payment Security**: PCI-compliant payment processing via Razorpay
- **Data Validation**: Server-side input validation and sanitization
- **HTTPS**: SSL/TLS encryption for all communications
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery protection

## 📊 Analytics & Monitoring

- **User Analytics**: Track user behavior and conversion funnels
- **Sales Analytics**: Revenue, orders, and inventory insights
- **Performance Monitoring**: Page load times and Core Web Vitals
- **Error Tracking**: Appwrite function logs and error monitoring
- **Notification System**: Cart abandonment and promotional notifications

## 🎯 Performance Optimizations

- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Intelligent caching strategies
- **CDN**: Global content delivery network
- **Database Indexing**: Optimized database queries
- **Bundle Analysis**: Webpack bundle optimization

## 🌐 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile**: iOS Safari, Android Chrome

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Success Stories

This platform is designed to:

- **Empower Telugu Authors**: Provide a dedicated platform for Telugu literature
- **Preserve Culture**: Make Telugu books accessible to global Telugu community
- **Support Business**: Complete e-commerce solution for book publishers
- **Scale Globally**: Modern architecture that grows with your business

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our discussions for help and feature requests
- **Commercial Support**: Contact us for enterprise support options

---

## 🚀 Ready to Launch?

Your modern Telugu bookstore platform is ready for production! Follow the deployment guide and launch checklist to go live.

**Happy selling! 📚✨**
