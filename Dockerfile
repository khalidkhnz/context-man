# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm (optional, use npm if preferred)
# RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 contextman

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Change ownership
RUN chown -R contextman:nodejs /app

# Switch to non-root user
USER contextman

# Expose ports
# REST API
EXPOSE 7777
# MCP HTTP/SSE
EXPOSE 7778

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:7777/api/projects || exit 1

# Default command: start REST API
CMD ["node", "dist/bin/context-man.js", "serve", "api"]
