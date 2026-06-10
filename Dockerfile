# Stage 1: Install dependencies and build
FROM node:18-alpine AS builder

# Pin pnpm to match lockfileVersion 9.0. The build broke once pnpm@latest
# became pnpm 11 (which requires Node 20+ and crashed on Node 18's corepack).
# Node 18 is kept because native deps (usb, tiny-secp256k1) ship prebuilt
# binaries for its ABI; Node 20 would force a gyp rebuild needing build tools.
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Build tools for native deps (usb, bufferutil, utf-8-validate, secp256k1)
# pulled in by the Solana / wallet-adapter dependency tree. node-gyp needs
# python3 + a C/C++ toolchain; usb additionally needs libusb + eudev headers.
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev libusb-dev

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# NEXT_PUBLIC_ vars must be present at build time to be inlined.
# Railway passes these as build args automatically when they match
# env var names, or set them via railway.toml / Dockerfile ARG.
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

RUN pnpm build

# Stage 2: Production runner
FROM node:18-alpine AS runner

# Runner only runs `node server.js`; pnpm not strictly needed, but keep it
# pinned and consistent with the builder stage.
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
