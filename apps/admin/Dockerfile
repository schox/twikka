# --- Stage 1: Install dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY packages/ ./packages/
COPY apps/twikka-admin/package.json ./apps/twikka-admin/package.json

RUN npm ci

# --- Stage 2: Build the app ---
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/ ./
COPY apps/twikka-admin/ ./apps/twikka-admin/

# Next.js inlines NEXT_PUBLIC_* at build time
ARG NEXT_PUBLIC_TWIKKA_SUPABASE_URL
ARG NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_TWIKKA_SUPABASE_URL=$NEXT_PUBLIC_TWIKKA_SUPABASE_URL
ENV NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY

RUN npx turbo build --filter=twikka-admin

# --- Stage 3: Production runner ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/twikka-admin/public ./apps/twikka-admin/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/twikka-admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/twikka-admin/.next/static ./apps/twikka-admin/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/twikka-admin/server.js"]
