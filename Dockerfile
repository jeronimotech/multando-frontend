# Multi-stage build for Next.js web app (pnpm monorepo)
FROM node:20-alpine AS base
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev libusb-dev
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# --- Install + Build everything in one stage ---
FROM base AS builder
WORKDIR /app

# Copy workspace config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all needed packages
COPY apps/web/package.json apps/web/
COPY packages/design-tokens/package.json packages/design-tokens/
COPY packages/ui/package.json packages/ui/

# Use shamefully-hoist for Docker compatibility (flattens all deps, resolves workspace links)
RUN echo "shamefully-hoist=true" > .npmrc && \
    pnpm install --no-frozen-lockfile --filter @multando/web... --filter @multando/design-tokens --filter @multando/ui

# Copy shared package source and build them
COPY packages/design-tokens/ packages/design-tokens/
COPY packages/ui/ packages/ui/
RUN cd packages/design-tokens && npx tsup && cd ../ui && npx tsup

# Copy web source
COPY apps/web/ apps/web/

# Build Next.js (skip lint/typecheck — those run in CI)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN cd apps/web && npx next build --no-lint

# --- Production runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/.next/standalone ./
# Fix: standalone node_modules has broken pnpm symlinks — install minimal deps
# Fix broken pnpm symlinks — reinstall only the runtime deps needed by standalone server
RUN rm -rf node_modules && \
    echo '{"dependencies":{"next":"14.2.18","react":"18.3.1","react-dom":"18.3.1"}}' > package.json && \
    npm install --omit=dev --ignore-scripts

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
