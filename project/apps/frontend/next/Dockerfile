# Base dependencies
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# Builder
FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Disabling Next.js telemetry 
# Next.js telemetry collects completely anonymous data about general usage and command performance
ENV NEXT_TELEMETRY_DISABLED 1

RUN bun run build

# Development
FROM oven/bun:1.2-alpine AS dev
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]


# Production
FROM oven/bun:1.2-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built Next.js application from the 'builder' stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Change ownership of the app directory
USER nextjs

EXPOSE 3000

CMD ["bun", "start"]
