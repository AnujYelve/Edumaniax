# Multi-stage build for smaller, more secure production image
FROM node:22-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (needed for Prisma generate)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Production stage
FROM node:22-slim AS production

# Set the working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy package files
COPY package*.json ./

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/prisma/schema.prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code (only necessary files)
COPY server.js ./
COPY controllers ./controllers
COPY routes ./routes
COPY middlewares ./middlewares
COPY utils ./utils
COPY connectionManager.js ./

# Set ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
