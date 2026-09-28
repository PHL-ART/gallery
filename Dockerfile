FROM node:20-alpine AS base

# ── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── Builder ───────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
# next.config.mjs allowlists this host for next/image at build time, so it has
# to be available here — the runtime env_file is not read during the build.
ARG S3_ENDPOINT
ENV S3_ENDPOINT=$S3_ENDPOINT
RUN mkdir -p public
RUN test -n "$S3_ENDPOINT" || (echo "ERROR: S3_ENDPOINT build arg is empty — next/image would reject every S3 URL" && exit 1)
RUN npm run build

# ── Migrator (runs prisma migrate deploy at startup) ─────────────────────────
FROM base AS migrator
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY package.json ./
RUN npx prisma generate
CMD ["npx", "prisma", "db", "push", "--accept-data-loss"]

# ── Runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma native binaries are not traced by Next.js standalone — copy explicitly
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma/client ./node_modules/.prisma/client
# sharp native binaries are not traced by Next.js standalone — copy explicitly
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@img ./node_modules/@img

# The image cache is a named volume mounted at runtime. Docker seeds a fresh volume
# from the image, so this directory must exist here and be owned by nextjs —
# otherwise the volume is created root-owned and the optimizer cannot write to it.
RUN mkdir -p /app/.next/cache/images && chown -R nextjs:nodejs /app/.next

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
