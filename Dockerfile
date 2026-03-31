FROM node:20-alpine AS base
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev libusb-dev

FROM base AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npx next build --no-lint

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

RUN rm -rf node_modules && \
    echo '{"dependencies":{"next":"14.2.35","react":"18.3.1","react-dom":"18.3.1"}}' > package.json && \
    npm install --omit=dev --ignore-scripts

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
