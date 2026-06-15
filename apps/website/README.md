# Foot Ankle Lower Limb Website

Deployed via Turborepo monorepo structure.

✅ GitHub integration reconnected.

## Project Overview

Modern website for Foot Ankle Lower Limb Clinic built with Next.js 15, TypeScript, and Supabase. Features a CMS-driven architecture for easy content management across multiple clinic locations.

## Tech Stack

- **Frontend**: Next.js 15.3.3 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (for admin access)
- **Storage**: Supabase Storage (images and files)
- **Hosting**: Vercel

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
fall-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── team/
│   │   │   ├── contact/
│   │   │   ├── blog/
│   │   │   └── faq/
│   │   ├── (protected)/       # Admin pages
│   │   │   ├── home/
│   │   │   ├── media/
│   │   │   └── settings/
│   │   └── login/
│   ├── components/            # Reusable components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
├── supabase/                 # Database migrations
└── public/                   # Static assets
```

## Features

- Dynamic content management via Supabase
- Team member profiles
- Service listings
- Blog system (existing tables)
- Image management
- Multi-tenant support (for future clinic sites)
- Responsive design

## Deployment

- Push to main branch auto-deploys to Vercel
- Environment variables configured in Vercel dashboard
