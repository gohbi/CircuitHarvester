# Stage 1: Builder (Node.js)
# Installs dependencies and compiles TypeScript/React into static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source files
COPY . .

# Accept API_KEY as build argument and inject into build
ARG API_KEY
ENV API_KEY=${API_KEY}

# Build the application
RUN npm run build

# Stage 2: Runner (Nginx)
# Uses Alpine Linux for minimal footprint (~20MB)
FROM nginx:alpine AS runner

# Copy the built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
