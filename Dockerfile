# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY app/package*.json ./

RUN npm ci

COPY app/ ./

RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# Copy standalone server
COPY --from=builder /app/.next/standalone ./

# Copy static assets (must be at root level for Next.js standalone)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
