#!/bin/bash

# Ataka Bookstore - Manual Deployment Script
# This script helps deploy your application to Appwrite manually

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Check if Appwrite CLI is installed
check_appwrite_cli() {
    if ! command -v appwrite &> /dev/null; then
        print_error "Appwrite CLI is not installed."
        print_info "Install it with: npm install -g appwrite-cli"
        exit 1
    fi
    print_success "Appwrite CLI found"
}

# Check if user is logged in to Appwrite
check_appwrite_login() {
    if ! appwrite account get &> /dev/null; then
        print_error "Not logged in to Appwrite."
        print_info "Login with: appwrite login"
        exit 1
    fi
    print_success "Appwrite login verified"
}

# Check if Node.js and npm are installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    print_success "Node.js and npm found"
}

# Install dependencies
install_dependencies() {
    print_step "Installing frontend dependencies..."
    cd frontend
    npm ci
    cd ..
    print_success "Frontend dependencies installed"
    
    print_step "Installing function dependencies..."
    for function_dir in appwrite-functions/*/; do
        if [ -f "$function_dir/package.json" ]; then
            function_name=$(basename "$function_dir")
            print_info "Installing dependencies for $function_name"
            cd "$function_dir"
            npm ci
            cd - > /dev/null
        fi
    done
    print_success "Function dependencies installed"
}

# Build frontend
build_frontend() {
    print_step "Building frontend..."
    cd frontend
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Please update the .env file with your actual values before deploying"
        else
            print_error ".env.example not found. Please create a .env file manually"
            exit 1
        fi
    fi
    
    # Run type checking
    print_info "Running type checking..."
    npm run typecheck
    
    # Build the application
    print_info "Building application..."
    npm run build:prod
    
    cd ..
    print_success "Frontend built successfully"
}

# Deploy database collections
deploy_database() {
    print_step "Deploying database collections..."
    
    if appwrite deploy collection --all; then
        print_success "Database collections deployed"
    else
        print_error "Failed to deploy database collections"
        exit 1
    fi
}

# Deploy storage buckets
deploy_storage() {
    print_step "Deploying storage buckets..."
    
    if appwrite deploy bucket --all; then
        print_success "Storage buckets deployed"
    else
        print_error "Failed to deploy storage buckets"
        exit 1
    fi
}

# Deploy functions
deploy_functions() {
    print_step "Deploying Appwrite functions..."
    
    if appwrite deploy function --all; then
        print_success "Functions deployed"
    else
        print_error "Failed to deploy functions"
        exit 1
    fi
}

# Deploy hosting
deploy_hosting() {
    print_step "Deploying frontend to Appwrite hosting..."
    
    if appwrite deploy hosting; then
        print_success "Frontend deployed to hosting"
    else
        print_error "Failed to deploy frontend"
        exit 1
    fi
}

# Set function environment variables
set_function_variables() {
    print_step "Setting function environment variables..."
    
    # Read environment variables from frontend/.env
    if [ -f "frontend/.env" ]; then
        # Extract Razorpay keys if present
        RAZORPAY_KEY_ID=$(grep VITE_RAZORPAY_KEY_ID frontend/.env | cut -d '=' -f2 | tr -d '"')
        
        if [ ! -z "$RAZORPAY_KEY_ID" ]; then
            print_info "Setting Razorpay Key ID for payment function..."
            # Note: This will only set the key ID. Secret should be set manually for security
            echo "Please set RAZORPAY_KEY_SECRET manually in Appwrite Console → Functions → payment-razorpay → Variables"
        fi
    fi
    
    print_warning "Please ensure all sensitive environment variables are set in Appwrite Console"
}

# Main deployment function
deploy_all() {
    print_step "Starting complete deployment..."
    
    check_node
    check_appwrite_cli
    check_appwrite_login
    
    # Ask for confirmation
    echo -e "\n${YELLOW}This will deploy your Ataka bookstore to Appwrite.${NC}"
    echo -e "${YELLOW}Make sure you have:${NC}"
    echo -e "${YELLOW}- Updated frontend/.env with correct values${NC}"
    echo -e "${YELLOW}- Set up your Appwrite project${NC}"
    echo -e "${YELLOW}- Configured authentication providers${NC}"
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Deployment cancelled"
        exit 0
    fi
    
    install_dependencies
    build_frontend
    deploy_database
    deploy_storage
    deploy_functions
    deploy_hosting
    set_function_variables
    
    print_success "🎉 Deployment completed successfully!"
    print_info "Your Ataka bookstore is now live!"
    print_info "Check the Appwrite Console for your hosting URL"
}

# Show help
show_help() {
    echo "Ataka Bookstore Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  --all         Deploy everything (default)"
    echo "  --frontend    Build and deploy frontend only"
    echo "  --functions   Deploy functions only"
    echo "  --database    Deploy database collections only"
    echo "  --storage     Deploy storage buckets only"
    echo "  --build       Build frontend only"
    echo "  --install     Install dependencies only"
    echo "  --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh                 # Deploy everything"
    echo "  ./deploy.sh --frontend      # Deploy frontend only"
    echo "  ./deploy.sh --functions     # Deploy functions only"
    echo ""
}

# Parse command line arguments
case "${1:-}" in
    --help)
        show_help
        ;;
    --frontend)
        check_node
        check_appwrite_cli
        check_appwrite_login
        install_dependencies
        build_frontend
        deploy_hosting
        ;;
    --functions)
        check_appwrite_cli
        check_appwrite_login
        install_dependencies
        deploy_functions
        ;;
    --database)
        check_appwrite_cli
        check_appwrite_login
        deploy_database
        ;;
    --storage)
        check_appwrite_cli
        check_appwrite_login
        deploy_storage
        ;;
    --build)
        check_node
        install_dependencies
        build_frontend
        ;;
    --install)
        check_node
        install_dependencies
        ;;
    --all|"")
        deploy_all
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
