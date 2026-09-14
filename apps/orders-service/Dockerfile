# Stage 1: Build & compile TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo configuration & lockfiles
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/orders-service/package.json ./apps/orders-service/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/orders-service ./apps/orders-service

# Build production bundle
WORKDIR /app/apps/orders-service
RUN pnpm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3001

# Run as non-root user
USER node

# Copy built dist and production node_modules from builder
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/apps/orders-service/node_modules ./apps/orders-service/node_modules
COPY --chown=node:node --from=builder /app/apps/orders-service/dist ./apps/orders-service/dist
COPY --chown=node:node --from=builder /app/apps/orders-service/package.json ./apps/orders-service/

EXPOSE 3001

CMD ["node", "apps/orders-service/dist/src/main.js"]
