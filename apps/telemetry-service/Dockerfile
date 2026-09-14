# Stage 1: Build & compile TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo configuration & lockfiles
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/telemetry-service/package.json ./apps/telemetry-service/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/telemetry-service ./apps/telemetry-service

# Build production bundle
WORKDIR /app/apps/telemetry-service
RUN pnpm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3002

# Run as non-root user
USER node

# Copy built dist and production node_modules from builder
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/apps/telemetry-service/node_modules ./apps/telemetry-service/node_modules
COPY --chown=node:node --from=builder /app/apps/telemetry-service/dist ./apps/telemetry-service/dist
COPY --chown=node:node --from=builder /app/apps/telemetry-service/package.json ./apps/telemetry-service/

EXPOSE 3002

CMD ["node", "apps/telemetry-service/dist/src/main.js"]
