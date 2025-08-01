#!/bin/bash

# Ataka Bookstore - Appwrite Deployment Script
# This script prepares and builds the project for Appwrite deployment

set -e

echo "🚀 Starting Ataka Bookstore deployment preparation..."

# Check if we're in the right directory
if [ ! -f "appwrite.json" ]; then
    echo "❌ Error: appwrite.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf frontend/dist

# Install dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm ci --production=false

# Build the frontend
echo "🔨 Building frontend for production..."
npm run build

# Verify build
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Output directory: frontend/dist"

cd ..

# Build Appwrite functions
echo "🔧 Building Appwrite functions..."

# Books API
if [ -d "appwrite-functions/books-api" ]; then
    echo "📚 Building books-api function..."
    cd appwrite-functions/books-api
    npm ci --production
    cd ../..
fi

# Orders API
if [ -d "appwrite-functions/orders-api" ]; then
    echo "📋 Building orders-api function..."
    cd appwrite-functions/orders-api
    npm ci --production
    cd ../..
fi

# Payment Razorpay
if [ -d "appwrite-functions/payment-razorpay" ]; then
    echo "💳 Building payment-razorpay function..."
    cd appwrite-functions/payment-razorpay
    npm ci --production
    cd ../..
fi

# Import WooCommerce
if [ -d "appwrite-functions/import-woocommerce" ]; then
    echo "🔄 Building import-woocommerce function..."
    cd appwrite-functions/import-woocommerce
    npm ci --production
    cd ../..
fi

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure your Appwrite project is set up"
echo "2. Configure environment variables in Appwrite console:"
echo "   - VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1"
echo "   - VITE_APPWRITE_PROJECT_ID=ataka-bookstore"
echo "3. Deploy using Appwrite CLI:"
echo "   appwrite deploy"
echo ""
echo "🔗 Deployment files ready for Appwrite!"
