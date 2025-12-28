# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY app/package*.json ./

RUN npm ci

COPY app/ ./

RUN npm run build

# Copy static files to standalone output
RUN cp -r public .next/standalone/public && \
    cp -r .next/static .next/standalone/.next/static

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Copy standalone build (already includes public/ and .next/static from build stage)
COPY --from=builder /app/.next/standalone ./

EXPOSE 3000

CMD ["node", "server.js"]
