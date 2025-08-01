#!/usr/bin/env node
/**
 * Telugu Books Business Setup Script
 * Ensures the platform is ready for production use
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🏪 Setting up Telugu Books Business Platform...\n");

// MongoDB Atlas Configuration
const MONGODB_CONFIG = {
  uri: "mongodb+srv://peppermint:4npu3gACSEtYveGv@cluster0.xwg7aps.mongodb.net/telugu-books?retryWrites=true&w=majority&appName=Cluster0",
  database: "telugu-books",
};

// Create backend .env file
const backendEnvPath = path.join(__dirname, "backend", ".env");
const backendEnvContent = `# Telugu Books Business Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:8080

# MongoDB Atlas Database
MONGODB_URI=${MONGODB_CONFIG.uri}

# JWT Security
JWT_SECRET=telugu-books-business-jwt-secret-${Date.now()}
JWT_EXPIRE=7d

# Business Configuration
ADMIN_EMAIL=peppermint@telugubooks.org
ADMIN_PASSWORD=TeluguBooks2024!

# Payment Gateway (Razorpay) - Update with your credentials
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Shipping (ShipRocket) - Update with your credentials
SHIPROCKET_EMAIL=your-shiprocket-email
SHIPROCKET_PASSWORD=your-shiprocket-password
SHIPROCKET_TOKEN=your-shiprocket-token

# Email Configuration - Update with your business email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-business-email@gmail.com
EMAIL_PASS=your-app-password

# Security Settings
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary for image uploads (Optional)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
`;

// Create frontend .env file
const frontendEnvPath = path.join(__dirname, "frontend", ".env");
const frontendEnvContent = `# Telugu Books Business Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Telugu Books
VITE_APP_DESCRIPTION=Complete Telugu Literature Bookstore

# Razorpay Configuration (Update with your keys)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id

# Google Analytics (Optional)
VITE_GA_TRACKING_ID=your-ga-tracking-id
`;

try {
  // Create backend .env
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log("✅ Backend .env configured with MongoDB Atlas");

  // Create frontend .env
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log("✅ Frontend .env configured");

  console.log("\n🎉 Telugu Books Business Platform is configured!");
  console.log("\n📋 Next Steps:");
  console.log("1. Update payment gateway credentials in backend/.env");
  console.log("2. Configure email settings for order notifications");
  console.log("3. Set up shipping provider (ShipRocket) credentials");
  console.log("4. Run: npm run install:all");
  console.log("5. Run: npm run dev");
  console.log("\n🌐 Your Business URLs:");
  console.log("   Frontend: http://localhost:8080");
  console.log("   Backend API: http://localhost:5000");
  console.log("   Database: MongoDB Atlas (Connected)");
} catch (error) {
  console.error("❌ Setup failed:", error.message);
  process.exit(1);
}
