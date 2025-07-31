# Ataka - The Ultimate Telugu Bookstore

A complete online bookstore platform specifically designed for Telugu literature, built with React and powered by Appwrite.

## 🚀 Quick Deploy to Appwrite

Your project is configured for easy Appwrite deployment. Follow these simple steps:

### 1. Prerequisites

- [Appwrite account](https://appwrite.io)
- [Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation) installed
- Node.js 18+ installed

### 2. Setup Appwrite Project

1. Create a new project in Appwrite console
2. Copy your Project ID and API Endpoint
3. Install Appwrite CLI: `npm install -g appwrite-cli`

### 3. Configure Environment

```bash
# Copy environment template
cp frontend/.env.example frontend/.env

# Edit with your Appwrite details
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
```

### 4. Deploy

```bash
# Login to Appwrite
appwrite login

# Initialize project
appwrite init project

# Build frontend
cd frontend && npm install && npm run build && cd ..

# Deploy everything
appwrite deploy
```

### 5. GitHub Actions (Automatic Deployment)

Set these secrets in your GitHub repository settings:

- `VITE_APPWRITE_ENDPOINT` - Your Appwrite endpoint
- `VITE_APPWRITE_PROJECT_ID` - Your project ID
- `APPWRITE_CLI_KEY` - Your Appwrite API key

Every push to main will automatically deploy to Appwrite!

## ✨ Features

- 📚 **Complete Telugu Bookstore** - Browse, search, and purchase Telugu books
- 🛒 **Shopping Cart & Checkout** - Full e-commerce functionality
- 👤 **User Authentication** - Secure login/register with Appwrite Auth
- 🎨 **Admin Dashboard** - Manage books, orders, and content
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔍 **Advanced Search** - Find books by title, author, category
- ⭐ **Reviews & Ratings** - Customer feedback system
- 📦 **Order Management** - Track orders and shipping
- 💳 **Payment Integration** - Razorpay payment gateway
- 🚀 **Fast & Secure** - Built with modern web technologies

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Appwrite (Database, Auth, Functions, Storage)
- **Styling**: TailwindCSS, shadcn/ui components
- **State Management**: React Context API
- **Payment**: Razorpay integration
- **Deployment**: Appwrite hosting

## 📁 Project Structure

```
ataka-bookstore/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── lib/             # Utility functions and Appwrite config
│   │   └── hooks/           # Custom React hooks
├── appwrite-functions/       # Appwrite cloud functions
│   ├── books-api/           # Book management API
│   ├── orders-api/          # Order processing API
│   ├── payment-razorpay/    # Payment handling
│   └── import-woocommerce/  # Data import functions
├── appwrite.json            # Appwrite configuration
└── .github/workflows/       # GitHub Actions for deployment
```

## 🔧 Development

```bash
# Install dependencies
cd frontend && npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## 📱 Pages & Features

- **Homepage** - Featured books, categories, hero slider
- **Shop** - Browse all books with filters and search
- **Book Details** - Individual book pages with reviews
- **Cart & Checkout** - Shopping cart and order placement
- **User Account** - Profile, orders, wishlist
- **Admin Dashboard** - Complete admin panel for managing the store

## 🔐 Admin Access

Access the admin panel at `/admin` with admin credentials.

Default admin features:

- Manage books inventory
- Process orders
- View analytics
- Manage categories and authors
- Configure homepage content

## 🌐 Appwrite Services Used

- **Authentication** - User login/register
- **Database** - Books, orders, users, settings
- **Storage** - Book images and documents
- **Functions** - Payment processing, order handling
- **Hosting** - Static site hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Support

For deployment help or questions:

- Check [Appwrite Documentation](https://appwrite.io/docs)
- Review the deployment logs in Appwrite console
- Ensure all environment variables are set correctly

---

**Made with ❤️ for Telugu literature lovers**
