FROM node:20-alpine AS base
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev libusb-dev
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install deps (standalone, no workspace)
RUN echo "shamefully-hoist=true" > .npmrc && pnpm install --no-frozen-lockfile

# Copy source
COPY . .

# Build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npx next build --no-lint

# Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# Install runtime deps
RUN rm -rf node_modules && \
    echo '{"dependencies":{"next":"14.2.18","react":"18.3.1","react-dom":"18.3.1"}}' > package.json && \
    npm install --omit=dev --ignore-scripts

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
