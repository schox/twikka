# Twikka Website - Claude Guide

## Project Overview

This is a modern website for Twikka built with Next.js 15, TypeScript, and Supabase. It features a CMS-driven architecture where content (team members, services, blog posts) is stored in Supabase and rendered dynamically.

## Critical Commands

```bash
# Development
npm run dev          # Start development server on port 3003
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
# Note: No test scripts configured yet - ask user for testing approach
```

## Tech Stack

- **Frontend**: Next.js 15.3.3 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **State Management**: React Context API, Zustand
- **UI Libraries**: Radix UI, Headless UI, Lucide icons
- **Tables**: @tanstack/react-table
- **Hosting**: TBD (Vercel recommended)

## Project Structure

```
twikka-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/          # Public website pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── about/         # About page
│   │   │   ├── services/      # Service listings
│   │   │   ├── team/          # Team member profiles
│   │   │   ├── contact/       # Contact page
│   │   │   ├── blog/          # Blog posts
│   │   │   └── faq/           # Frequently asked questions
│   │   ├── (protected)/       # Admin-only pages
│   │   │   ├── home/          # Admin dashboard
│   │   │   ├── media/         # Image library management
│   │   │   └── settings/      # Admin settings
│   │   └── login/             # Authentication
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Header.tsx        # Site header
│   │   └── Footer.tsx        # Site footer
│   ├── contexts/             # React contexts
│   ├── providers/            # Context providers
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
├── supabase/                 # Database migrations
└── public/                   # Static assets
```

## Database Schema

### Blog Tables (Shared with other brands)

- **blog_post**: Blog posts table (filtered by brand = 2 for Twikka)
- **blog_category**: Blog categories
- **blog_tag**: Blog tags
- **blog_author**: Blog authors

### Other Tables

- **web.team_member**: Team member profiles (filtered by account_id)
- **web.service**: Services offered (filtered by account_id)
- **web.form_submission**: Contact form submissions
- **account**: Multi-tenant accounts
- **user_profile**: User profiles with roles

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://cpgapeppncrhrfoubqvh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

## Key Implementation Notes

1. **Site Configuration**: Brand ID (2) and account ID are configured in `src/config/site.ts`
2. **Multi-tenant**: Shares Supabase instance with other apps, uses brand/account filtering
3. **Blog System**: Uses same blog tables as other brands, filtered by `brand = 2`
4. **Public Access**: Most content is publicly accessible (no auth required)
5. **Admin Section**: Protected routes for content management
6. **Dynamic Content**: All content pulled from Supabase, not hardcoded
7. **Image Storage**: Use Supabase Storage for all images
8. **SEO**: Implement proper meta tags and structured data

## Current Status

- ✅ Basic structure cloned from fall-website
- ✅ Package.json configured with port 3003
- ✅ Site configuration updated for Twikka brand
- 🔄 Styling and branding needs customization
- 🔄 Unnecessary pages need cleanup
- 🔄 Account ID needs to be set once created in database

## Common Tasks

### Adding a New Page

1. Create page in `src/app/(public)/[page]/page.tsx`
2. Add any required data fetching hooks
3. Update navigation components
4. Add SEO metadata

### Working with Supabase

- Client: `src/lib/supabaseClient.ts`
- Configuration: `src/config/site.ts` contains brand/account IDs
- Always filter by brand/account_id for multi-tenant support
- Use Row Level Security (RLS) policies

### Site Configuration

The `src/config/site.ts` file contains all site-specific configuration:

- `brandId`: 2 (Twikka's brand ID)
- `accountId`: Placeholder - needs to be set once account is created
- Site metadata, contact info, and feature flags
- Import `BRAND_ID` and `ACCOUNT_ID` constants in service files

## MCP Server Configuration

Supabase MCP server is configured with project ref: cpgapeppncrhrfoubqvh

## TODO

1. Create Twikka account in database and update account ID
2. Create brand record in database (ID: 2, name: "Twikka")
3. Customize color scheme and branding
4. Remove podiatry-specific pages (if not needed)
5. Add Twikka-specific content and services
6. Configure deployment (Vercel or other hosting)