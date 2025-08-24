# Multi-stage build for React web app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root workspace files so pnpm can install correctly
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY packages/web/package.json ./packages/web/package.json

# Install pnpm
RUN npm install -g pnpm

# Install workspace dependencies (use workspace root)
RUN pnpm -w install --frozen-lockfile

# Copy web source code
COPY packages/web ./packages/web

# Build arguments
ARG VITE_API_BASE_URL
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Set environment variables for the build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Build the web application (run from workspace root but target web package)
RUN pnpm --filter ./packages/web run build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# If you want a custom nginx.conf or service worker, mount them via docker-compose
# instead of baking them into the image. Example in docker-compose.yml:
#   volumes:
#     - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
#     - ./packages/web/public/sw.js:/usr/share/nginx/html/sw.js:ro

# Add health check
RUN apk add --no-cache curl

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]