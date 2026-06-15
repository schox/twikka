# --- Stage 1: Install dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY packages/ ./packages/
COPY apps/twikka-website/package.json ./apps/twikka-website/package.json

RUN npm ci

# --- Stage 2: Build the app ---
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/ ./
COPY apps/twikka-website/ ./apps/twikka-website/

# Next.js inlines NEXT_PUBLIC_* at build time
ARG NEXT_PUBLIC_TWIKKA_SUPABASE_URL
ARG NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_NOVANSA_SUPABASE_URL
ARG NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_TWIKKA_SUPABASE_URL=$NEXT_PUBLIC_TWIKKA_SUPABASE_URL
ENV NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_NOVANSA_SUPABASE_URL=$NEXT_PUBLIC_NOVANSA_SUPABASE_URL
ENV NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN

RUN npx turbo build --filter=twikka-website

# --- Stage 3: Production runner ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/twikka-website/public ./apps/twikka-website/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/twikka-website/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/twikka-website/.next/static ./apps/twikka-website/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/twikka-website/server.js"]
