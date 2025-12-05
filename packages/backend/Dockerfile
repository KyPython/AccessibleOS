# Multi-stage build for Node.js backend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for backend
# Copy workspace metadata so pnpm can resolve workspace/hoisted deps (typescript, etc.)
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY packages/backend/package*.json ./

# Install pnpm
RUN npm install -g pnpm

# Install workspace dependencies (allow lockfile mismatch in CI build context)
# Use shamefully-hoist to make binaries available and run at workspace root
RUN pnpm -w install --no-frozen-lockfile --shamefully-hoist

# Copy source code for backend
COPY packages/backend .

# Ensure TypeScript and node types are available in the workspace node_modules
# Ensure package-level devDependencies (type defs) are installed for backend
RUN pnpm --filter ./packages/backend install --no-frozen-lockfile --shamefully-hoist

# Use esbuild to bundle the TypeScript entry into a production JS file (no type checks)
# Install esbuild at workspace root then bundle the backend entrypoint
RUN pnpm -w add -D esbuild
RUN pnpm -w exec esbuild ./src/index.ts --bundle --platform=node --target=node18 \
  --external:express --external:cors --external:helmet --external:"express-rate-limit" \
  --external:dotenv --external:firebase-admin --external:pg --external:bcryptjs \
  --external:jsonwebtoken --external:joi \
  --outfile=./dist/index.js

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files for backend
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY packages/backend/package*.json ./

# Install pnpm
RUN npm install -g pnpm

# Install production dependencies only (allow lockfile mismatch)
RUN pnpm install --no-frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/src/database ./src/database

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["dumb-init", "node", "dist/index.js"]