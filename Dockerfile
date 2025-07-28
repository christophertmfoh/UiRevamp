# === BUILD STAGE ===
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/ 2>/dev/null || true

# Install dependencies with npm ci for faster, reliable builds
RUN npm ci --only=production && \
    cd client && npm ci --only=production

# Copy source code
COPY . .

# Build the client application
RUN cd client && npm run build

# === PRODUCTION STAGE ===
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
COPY server/package*.json ./server/ 2>/dev/null || true
RUN npm ci --only=production && rm -rf /root/.npm

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/client/dist ./client/dist
COPY --from=builder --chown=nextjs:nodejs /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/shared ./shared

# Copy configuration files
COPY --chown=nextjs:nodejs tsconfig.json ./

# Create necessary directories with proper permissions
RUN mkdir -p /app/uploads /app/logs && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "server/index.js"]

# === DEVELOPMENT STAGE ===
FROM node:18-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose ports for both client and server
EXPOSE 3000 5000

# Start development servers
CMD ["npm", "run", "dev"]