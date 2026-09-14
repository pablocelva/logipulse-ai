# Stage 1: Build & compile TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo configuration & lockfiles
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ai-analytics-service/package.json ./apps/ai-analytics-service/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/ai-analytics-service ./apps/ai-analytics-service

# Build production bundle
WORKDIR /app/apps/ai-analytics-service
RUN pnpm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3003

# Run as non-root user
USER node

# Copy built dist and production node_modules from builder
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/apps/ai-analytics-service/node_modules ./apps/ai-analytics-service/node_modules
COPY --chown=node:node --from=builder /app/apps/ai-analytics-service/dist ./apps/ai-analytics-service/dist
COPY --chown=node:node --from=builder /app/apps/ai-analytics-service/package.json ./apps/ai-analytics-service/

EXPOSE 3003

CMD ["node", "apps/ai-analytics-service/dist/src/main.js"]
