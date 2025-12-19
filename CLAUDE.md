# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Photolectic is a stock photography marketplace platform built with Next.js 16, enabling photographers to upload, verify, and license their photos to buyers. Features include:
- **AI Auto-Tagging**: GPT-4.1 Vision analyzes uploaded photos to generate titles, descriptions, and tags
- **Telegram Bot Integration**: Upload photos and manage your portfolio directly from Telegram
- **Multi-step Onboarding**: Slick photographer onboarding with Telegram connection and identity verification

## Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production (runs prisma generate first)
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router and Turbopack
- **Database**: PostgreSQL via Prisma ORM with `@prisma/adapter-pg`
- **Auth**: NextAuth v5 (beta) with credentials + Google OAuth
- **UI**: Radix UI primitives, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Storage**: Vercel Blob for photo storage
- **AI**: OpenAI GPT-4.1 Vision for image analysis and auto-tagging
- **3D**: React Three Fiber for 3D elements

### Directory Structure
- `app/` - Next.js App Router pages and API routes
  - `(auth)/` - Login, register, and onboarding routes
  - `(dashboard)/` - User dashboard and photo management
  - `(admin)/` - Admin panel routes
  - `api/` - API endpoints
    - `photos/upload/` - Photo upload with AI auto-tagging
    - `telegram/webhook/` - Telegram bot webhook handler
    - `dashboard/` - Dashboard data API
- `components/` - React components
  - `ui/` - shadcn/ui base components
  - `brand/` - Brand-specific components
  - `layout/` - Layout components
  - `three/` - React Three Fiber components
- `lib/` - Core utilities
  - `auth.ts` - NextAuth configuration with role-based access
  - `db.ts` - Prisma client singleton
  - `validations.ts` - Zod schemas
- `prisma/` - Database schema and migrations

### Key Features

#### OpenAI Vision Integration
Photos uploaded via web or Telegram are analyzed using GPT-4.1 Vision (`responses` API):
- Auto-generates professional titles
- Creates descriptive captions
- Suggests 5-10 relevant tags
- Categorizes into predefined categories

Location: `app/api/photos/upload/route.ts`, `app/api/telegram/webhook/route.ts`

#### Telegram Bot
The bot (`@PhotolecticBot`) supports:
- `/start` - Welcome message
- `/link <code>` - Link account using code from onboarding
- `/stats` - View portfolio statistics
- `/photos` - List recent uploads
- `/unlink` - Unlink Telegram account
- Send photos directly to upload them

Location: `app/api/telegram/webhook/route.ts`

### Data Model (Key Entities)
- **User**: Supports PHOTOGRAPHER, BUYER, ADMIN roles with optional Telegram linking
- **Photo**: Core entity with EXIF metadata, verification status, and integrity hash
- **LicenseOption**: Pricing tiers (PERSONAL, EDITORIAL, COMMERCIAL, EXTENDED)
- **LicenseRequest**: Tracks license purchase workflow

### Authentication
Uses NextAuth v5 with JWT strategy. Role helpers available in `lib/auth.ts`:
- `hasRole(roles, role)`, `isAdmin(roles)`, `isPhotographer(roles)`, `isBuyer(roles)`

## Code Conventions

### ESLint Rules (enforced)
- **No mock data**: Variables/identifiers with `mock`, `dummy`, `fake` are prohibited
- **No empty links**: `href="#"` and `javascript:` hrefs are not allowed
- **Brand colors only**: Arbitrary hex colors are restricted; use CSS variables from `globals.css`
- **UI imports**: Use `@/components/ui/*` instead of direct Radix imports

### Environment Variables
Required variables are documented in `.env.example`:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` - Auth configuration
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth (optional)
- `OPENAI_API_KEY` - OpenAI API key for Vision auto-tagging
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_WEBHOOK_SECRET` - Webhook verification secret
- `REPLICATE_API_TOKEN` - Image generation for seeding
