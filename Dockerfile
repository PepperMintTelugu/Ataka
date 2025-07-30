# Multi-stage build for Telugu Books Ecommerce Platform
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production && \
    cd backend && npm ci --only=production

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install PM2 globally
RUN npm install pm2 -g

# Create app directory
WORKDIR /app

# Copy backend dependencies and code
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source
COPY backend/src ./backend/src
COPY backend/ecosystem.config.js ./backend/

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p backend/uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application with PM2
CMD ["pm2-runtime", "backend/ecosystem.config.js"]
