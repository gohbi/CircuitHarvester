# Stage 1: Builder (Node.js)
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
# Note: Uses npm install instead of npm ci for cross-platform compatibility
RUN npm install

# Copy source files
COPY . .

# Build argument for the API key
# Note: For Vite/React apps, the API key must be available at build time
# to be injected into the client-side JavaScript bundle
ARG API_KEY
ENV API_KEY=${API_KEY}

# Build the application
RUN npm run build

# Stage 2: Runner (Nginx)
FROM nginx:alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
